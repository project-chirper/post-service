const router = require('express').Router(),
      mongoose = require('mongoose'),
      Post = require('mongoose').model('Post'),
      auth = require('auth-middleware'),
      loadPost = require('../common/loadPost')

router.post('/', auth({ required: true }), require('./create')) // create a post
router.post('/:post_id/reply', auth({ required: true }), loadPost('replies'), require('./reply')) // reply to a post
router.post('/:post_id/repost', auth({ required: true }), loadPost('repostedBy'), require('./repost')) // repost a post
router.put('/:post_id/like', auth({ required: true }), loadPost('likedBy'), require('./like')) // like a post

// fetch a post
router.get(
  '/:post_id',
  auth({ required: false }),
  loadPost(),
  async (req, res) => res.json(await req.targetPost.publicData({ viewer: req.user, depth: 1 }))
)

// fetch a users posts
router.get('/author/:user_id', auth({ required: false }), require('./author'))

module.exports = router