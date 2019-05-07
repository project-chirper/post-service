const router = require('express').Router(),
      mongoose = require('mongoose'),
      Post = mongoose.model('Post'),
      axios = require('axios')

router.get('/new', require('./new')) // get new posts since last fetched timeline

/**
 * @desc Prepares a users timeline
 * @query firstPostId the first post id fetched
 * @query amount Amount of posts to fetch (limit)
 * @query offset Current page (skip = amount*offset)
 * @return JSON of post public data
 */
router.get('/', async (req, res, next) => {
  // Validate firstPostId
  if (req.query.forstPostId && !mongoose.Types.ObjectId.isValid(firstPostId)) res.sendStatus(404) // Unknown first post id

  // Normalize options
  let options = {
    amount: req.query.amount ? parseInt(req.query.amount) : 25, // default 25
    offset: req.query.offset ? parseInt(req.query.offset) : 0 // default 0
  }
  // Validate options
  if (options.amount <= 0 || options.amount > 25) return res.sendStatus(401) // Unauthorized
  if (options.offset < 0) return res.sendStatus(404) // Page not found 404

  // Get who the user is following
  let following
  try {
    let response = await axios({
      url: `http://api-gateway:3001/api/user/${req.user}/following`,
      method: 'get',
      responseType: 'json'
    })
    following = response.data
  } catch (err) {
    next(err)
  }

  // Add own Id to following array, to show own posts in timeline
  following.push(req.user)

  // Prepare timeline
  let query = {
    author: { $in: following }
  }
  if (req.query.firstPostId) query._id = { $lte: req.query.firstPostId } // add first post id

  let posts = await Post.find(query).skip(options.offset * options.amount).limit(options.amount).sort('-dateCreated')

  // Return posts
  return res.json({
    count: posts.length,
    posts: await Promise.all(posts.map(async post => await post.publicData({ viewer: req.user, depth: 1 })))
  })
})

module.exports = router