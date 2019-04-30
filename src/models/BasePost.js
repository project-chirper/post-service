const mongoose = require('mongoose')

const BasePostSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A message is required'],
    minlength: [1, 'Message must be at least 1 character'],
    maxlength: [250, 'Message must be no more than 250 characters']
  }
}, {
  collection: 'baseposts'
})

mongoose.model('BasePost', BasePostSchema)