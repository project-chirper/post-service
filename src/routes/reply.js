const mongoose = require('mongoose'),
      BasePost = mongoose.model('BasePost'),
      Post = mongoose.model('Post'),
      PostReply = mongoose.model('PostReply')

/**
 * @desc Create a post reply
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
  } catch (err) { // Invalid message, return errors.
    return res.status(422).json({
      errors: Object.values(err.errors).map(x => x.message)
    })
  }

  // Create a PostReply and assign BasePost to it
  let postReply = new PostReply({
    replyingTo: req.targetPost._id,
    post: basePost._id
  })

  // Create a Post and assign PostReply to it
  let post = new Post({
    author: req.user,
    body: postReply._id,
    type: 'PostReply'
  })

  // Append reply ID to targetPost's replies
  req.targetPost.replies.push(post._id)

  // Save everything
  try {
    await postReply.save()
    await post.save()
    await req.targetPost.save()
  } catch (err) {
    next(err)
  }

  // Manually populate Post
  postReply.post = basePost
  postReply.replyingTo = req.targetPost
  post.body = postReply

  // Return post public data
  return res.json(await post.publicData(req.user))
}