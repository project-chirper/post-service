const router = require('express').Router(),
      mongoose = require('mongoose'),
      Post = require('mongoose').model('Post'),
      auth = require('auth-middleware')

// Preload Post on routes with :post_id param
router.param('post_id', async (req, res, next, postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) return res.sendStatus(404) // Invalid Post ID
  req.targetPost = await Post.findById(postId)
  if (!req.targetPost) return res.sendStatus(404) // Post not found 404
  next()
})

router.post('/', require('./create')) // create a post


module.exports = router