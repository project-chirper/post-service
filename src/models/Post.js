const mongoose = require('mongoose'),
      fetchUser = require('../common/fetchUser'),
      checkFollowing = require('../common/checkFollowing')

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
PostSchema.methods.publicData = async function({ viewer = false, depth = 0 } = {}) {
  // Fetch viewer
  viewer = typeof viewer === 'string' ? await fetchUser(viewer, 'username') : viewer // If viewer specified, fetch viewer and overwrite parameter  
  // Fetch author - if author and viewer are same, simply set author to viewer also
  let author = viewer.id == this.author ? viewer : await fetchUser(this.author, 'username') // If viewer is also author, set to viewer else fetch author

  let authorData = {
    id: author.id,
    username: author.username,
    isFollowing: viewer ? await checkFollowing(viewer.id, author.id) : false
  }

  if (depth >= 2) return {
    id: this._id,
    author: authorData
  }

  await this.populateBody(depth) // properly populate body

  // Public Data
  let publicData = {
    id: this._id,
    author: authorData,
    dateCreated: this.dateCreated,
    body: await this.body.publicData({ viewer, depth: depth+1 }),
    type: this.type,
    stats: {
      likes: this.likedBy.length,
      reposts: this.repostedBy.length,
      replies: this.replies.length
    },
    hasLiked: viewer ? this.likedBy.indexOf(viewer.id) >= 0 : false
  }

  return publicData
}

PostSchema.methods.populateBody = async function(depth = 0) {
  // Properly populate document
  await this.populate('body').execPopulate()

  switch(this.type) {
    case 'PostReply':
      await this.populate([
        { path: 'body.replyingTo' },
        { path: 'body.post' }
      ]).execPopulate()
      break
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
}

mongoose.model('Post', PostSchema)