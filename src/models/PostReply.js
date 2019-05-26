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
PostReplySchema.methods.publicData = async function({ viewer, depth }) {
  return {
    //id: this._id, not needed
    replyingTo: await this.replyingTo.publicData({ viewer, depth }),
    message: this.post.message
  }
}

PostReplySchema.statics.formatReplies = async function(replies, viewer) {
  return {
    count: replies.length,
    replyingTo: replies[0] ? (await replies[0].publicData({ viewer })).body.replyingTo : undefined,
    replies: await Promise.all(replies.map(async reply => {
      let publicReply = await reply.publicData({ viewer })
      delete publicReply.body.replyingTo
      return publicReply
    }))
  }
}

mongoose.model('PostReply', PostReplySchema)