const mongoose = require('mongoose')

const RepostSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BasePost'
  },
  repost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
}, {
  collection: 'reposts'
})

RepostSchema.methods.publicData = function() {
  return {
    id: this._id,
    repost: this.repost.publicData(),
    message: this.post.message
  }
}

mongoose.model('Repost', RepostSchema)