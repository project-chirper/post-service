const mongoose = require('mongoose'),
      fetchUser = require('../common/fetchUser')

const PostSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Author is required']
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  body: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  type: {
    type: String,
    required: true,
    enum: ['BasePost', 'Repost', 'PostReply']
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  repostedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, {
  collection: 'posts'
})

/**
 * @desc Returns Post public data
 * @param viewer Viewer ID OR Viewer Document
 * @param depth Controls how deep reposts should be returned, by default 1
 * @return JSON
 */
PostSchema.methods.publicData = async function({ viewer, depth }) {
  // Properly populate document
  switch(this.type) {
    case 'Repost':
      await this.populate([
        {
          path: 'body.repost',
          populate: {
            path: 'body'
          }
        },
        { path: 'body.post' }
      ]).execPopulate()
      break
  }

  // If depth is at -1, return id only
  if (depth && depth === -1) return this._id

  // Fetch viewer
  viewer = typeof viewer === 'string' ? await fetchUser(viewer, 'username') : viewer // If viewer specified, fetch viewer and overwrite parameter
  // Fetch author - if author and viewer are same, simply set author to viewer also
  let author = viewer.id == this.author ? viewer : await fetchUser(this.author, 'username') // If viewer is also author, set to viewer else fetch author
  
  // Public Data
  let publicData = {
    id: this._id,
    author: {
      id: author.id,
      username: author.username
    },
    dateCreated: this.dateCreated,
    body: await this.body.publicData({ viewer }),
    type: this.type,
    stats: {
      likes: this.likedBy.length,
      reposts: this.repostedBy.length,
      replies: this.replies.length
    },
    hasLiked: viewer ? this.likedBy.indexOf(viewer.id) >= 0 : false
  }

  // For each post type properly call .publicData()
  switch(this.type) {
    case 'Repost':
      publicData.body.repost = await this.body.repost.publicData({ viewer, depth: depth-1 })
      break
    case 'PostReply':
      publicData.body.replyingTo = await this.body.replyingTo.publicData({ viewer, depth: depth-1 })
      break
  }

  return publicData
}

mongoose.model('Post', PostSchema)