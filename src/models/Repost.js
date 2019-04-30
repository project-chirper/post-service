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

mongoose.model('Repost', RepostSchema)