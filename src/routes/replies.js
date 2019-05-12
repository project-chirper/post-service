const mongoose = require('mongoose'),
      Post = mongoose.model('Post')

/**
 * @desc Fetches replies from specific post
 * @param post_id The post id to fetch from
 * @query firstReplyId the first reply id fetched
 * @query amount Amount of replies to fetch (limit)
 * @query offset Current page (skip = amount*offset)
 * @return JSON of reply public data
 */
module.exports = async (req, res) => {
  // Validate firstReplyId
  //if (req.query.f)
}




let x = async function (req, res) {
  // Normalize options
  let options = {
    amount: req.query.amount ? parseInt(req.query.amount) : 10, // default 10
    offset: req.query.offset ? parseInt(req.query.offset) : 0 // default 0
  }
  // Validate options
  if (options.amount <= 0 || options.amount > 20) return res.sendStatus(401) // Unauthorized
  if (options.offset < 0) return res.sendStatus(404) // Page not found 404

  // Find replies on post
  let replies = await Post.find({ _id: { $in: req.targetPost.replies } }).skip(options.offset * options.amount).limit(options.amount)

  // Return replies
  return res.json({
    count: replies.length,
    replyingTo: replies[0] ? (await replies[0].publicData({ viewer: req.user })).body.replyingTo : undefined,
    replies: await Promise.all(replies.map(async reply => {
      let publicReply = await reply.publicData({ viewer: req.user })
      delete publicReply.body.replyingTo
      return publicReply
    }))
  })
}