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

/**
 * @desc Returns Repost public data
 * @param viewer Viewer ID
 * @return JSON
 */
RepostSchema.methods.publicData = async function(viewer) {
  return {
    //id: this._id, not needed
    repost: await this.repost.publicData({ viewer }),
    message: this.post.message
  }
}

mongoose.model('Repost', RepostSchema)