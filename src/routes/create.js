const mongoose = require('mongoose'),
      BasePost = mongoose.model('BasePost'),
      Post = mongoose.model('Post')

/**
 * @desc Create a plain post
 * @param { message }
 */
module.exports = async (req, res, next) => {
  // Create a BasePost
  let basePost = new BasePost({
    message: req.body.message
  })

  // Attempt to save BasePost
  try {
    await basePost.save()
  } catch(err) { // Invalid message, return errors.
    return res.status(422).json({
      errors: Object.values(err.errors).map(x => x.message)
    });
  }

  // Create a Post and assign BasePost to it
  let post = new Post({
    author: req.user,
    body: basePost._id,
    type: 'BasePost'
  })

  // Save post
  try {
    await post.save()
  } catch (err) {
    next(err)
  }

  // Return post public data
  return res.json(await post.publicData({ viewer: req.user }))
}