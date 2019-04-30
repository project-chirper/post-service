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
 * @param viewer Viewer ID
 * @return JSON
 */
PostSchema.methods.publicData = async function(viewer) {
  // Fetch viewer
  viewer = viewer ? await fetchUser(viewer) : false // If viewer specified, fetch viewer and overwrite parameter
  let author = viewer.id == this.author ? viewer : await fetchUser(this.author) // If viewer is also author, set to viewer else fetch author

  return {
    id: this._id,
    author: {
      id: author.id,
      username: author.username
    },
    dateCreated: this.dateCreated,
    body: await this.body.publicData(viewer),
    type: this.type,
    stats: {
      likes: this.likedBy.length,
      reposts: this.repostedBy.length,
      replies: this.replies.length
    },
    hasLiked: viewer ? this.likedBy.indexOf(viewer._id) >= 0 : false
  }
}

mongoose.model('Post', PostSchema)