const mongoose = require('mongoose'),
      BasePost = mongoose.model('BasePost'),
      Post = mongoose.model('Post'),
      Repost = mongoose.model('Repost')

/**
 * @desc Creates a repost of a post
 * @param { message }
 */
module.exports = async (req, res, next) => {
  // Create a BasePost
  let basePost = new BasePost({
    message: req.body.message
  })

  // Attempt to save basePost
  try {
    await basePost.save()
  } catch(err) {
    return res.status(422).json({
      errors: Object.values(err.errors).map(x => x.message)
    })
  }

  // Create a Repost and assign basePost to it
  let repost = new Repost({
    post: basePost._id,
    repost: req.targetPost._id
  })

  // Create a Post and assign Repost to it
  let post = new Post({
    author: req.user,
    body: repost._id,
    type: 'Repost'
  })

  // Add post as a repost to targetPost
  req.targetPost.repostedBy.push(req.user)

  // Save everything
  try {
    await repost.save()
    await post.save()
    await req.targetPost.save()
  } catch(err) {
    next(err)
  }

  // Return post public data
  return res.json(await post.publicData({ viewer: req.user }))
}