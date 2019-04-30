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

mongoose.model('PostReply', PostReplySchema)