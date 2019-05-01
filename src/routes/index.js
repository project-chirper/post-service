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

router.post('/', auth({ required: true }), require('./create')) // create a post
router.post('/:post_id/reply', auth({ required: true }), require('./reply')) // reply to a post
router.post('/:post_id/repost', auth({ required: true }), require('./repost')) // repost a post
router.put('/:post_id/like', auth({ required: true }), require('./like')) // like a post

// fetch a post
router.get(
  '/:post_id', 
  auth({ required: false }), 
  async (req, res) => res.json(await req.targetPost.publicData({ viewer: req.user, depth: 1 }))
)

// fetch a users posts
router.get('/author/:user_id', auth({ required: false }), require('./author'))

module.exports = router