const mongoose = require('mongoose')

const PostReplySchema = new mongoose.Schema({
  replyingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BasePost'
  }
}, {
  collection: 'postreplies'
})

PostReplySchema.methods.publicData = function() {
  return {
    id: this._id,
    replyingTo: this.replyingTo.publicData(),
    message: this.post.message
  }
}

mongoose.model('PostReply', PostReplySchema)