const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

PostSchema.methods.publicData = function() {
  return {
    id: this._id,
    author: this.author,
    dateCreated: this.dateCreated,
    body: this.body.publicData(),
    type: this.type,
    stats: {
      likes: this.likedBy.length,
      reposts: this.repostedBy.length,
      replies: this.replies.length
    }
  }
}

mongoose.model('Post', PostSchema)