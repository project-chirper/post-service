const router = require('express').Router(),
      mongoose = require('mongoose'),
      Post = require('mongoose').model('Post'),
      auth = require('auth-middleware')

// Preload Post on routes with :post_id param
router.param('post_id', async (req, res, next, postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) return res.sendStatus(404) // Invalid Post ID
  req.targetPost = await Post.findById(postId).populate('body')
  if (!req.targetPost) return res.sendStatus(404) // Post not found 404
  next()
})

// create a post
router.post('/', 
  auth({ required: true }),
  require('./create')
)

// reply to a post
router.post('/:post_id/reply',
  auth({ required: true }),
  require('./reply')
)

// repost a post
router.post('/:post_id/repost',
  auth({ required: true }),
  require('./repost')
)

module.exports = router