const router = require('express').Router(),
      mongoose = require('mongoose'),
      Post = require('mongoose').model('Post'),
      auth = require('chirper-auth-middleware'),
      loadPost = require('../common/loadPost')

router.use('/timeline', auth({ required: true }), require('./timeline')) // get user-tailored timeline

router.post('/', auth({ required: true }), require('./create')) // create a post
router.post('/:post_id/reply', auth({ required: true }), loadPost('replies'), require('./reply')) // reply to a post
router.post('/:post_id/repost', auth({ required: true }), loadPost('repostedBy'), require('./repost')) // repost a post
router.put('/:post_id/like', auth({ required: true }), loadPost('likedBy'), require('./like')) // like a post

router.get('/author/:user_id', auth({ required: false }), require('./author')) // fetch a users posts

router.use('/:post_id/replies', auth({ required: false }), loadPost('replies'), require('./replies')) // Fetch a posts replies

// fetch a post | THIS NEEDS TO BE LAST
router.get(
  '/:post_id',
  auth({ required: false }),
  loadPost(),
  async (req, res) => res.json(await req.targetPost.publicData({ viewer: req.user }))
)

module.exports = router