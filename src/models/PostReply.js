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

/**
 * @desc Returns PostReply public data
 * @param viewer Viewer ID
 * @return JSON
 */
PostReplySchema.methods.publicData = async function(viewer) {
  return {
    id: this._id,
    replyingTo: await this.replyingTo.publicData(viewer),
    message: this.post.message
  }
}

mongoose.model('PostReply', PostReplySchema)