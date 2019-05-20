const router = require('express').Router(),
      mongoose = require('mongoose'),
      Post = mongoose.model('Post'),
      PostReply = mongoose.model('PostReply')

router.get('/new', require('./new'))

/**
 * @desc Fetches replies for specific post
 * @param post_id The post id to fetch replies for
 * @query firstPostId The first ever reply id fetched (excluding new replies) if applicable
 * @query offset current page (skip = amount*offset)
 * @query amount Amount of replies to fetch (limit)
 * @return JSON of reply public data
 */
router.get('/', async (req, res) => {
  // Validate firstReplyId
  if (req.query.firstReplyId && !mongoose.Types.ObjectId.isValid(req.query.firstReplyId)) return res.sendStatus(404) // invalid first reply id
  // Normalize options
  let options = {
    amount: req.query.amount ? parseInt(req.query.amount) : 10, // default 10
    offset: req.query.offset ? parseInt(req.query.offset) : 0 // default 0
  }
  // Validate options
  if (options.amount <= 0 || options.amount > 20 || options.offset < 0) return res.sendStatus(422) // Unprocessable

  // Format query
  let query = {
    _id: { $in: req.targetPost.replies }
  }
  if (req.query.firstReplyId) query._id["$lte"] = req.query.firstReplyId
  
  let replies = await Post.find(query).skip(options.offset * options.amount).limit(options.amount).sort('-dateCreated')

  // Return replies
  return res.json(await PostReply.formatReplies(replies, req.user))
})

module.exports = router