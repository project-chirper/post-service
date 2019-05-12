const mongoose = require('mongoose'),
      Post = mongoose.model('Post')

/**
 * @desc Loads all new replies of a post since last replies fetched
 * @query lastReplyId
 * @return Reply public data JSON
 */
module.exports = async (req, res) => {
  // validate lastReplyId
  if(!mongoose.Types.ObjectId.isValid(req.query.lastReplyId)) return res.sendStatus(404) // unknown

  // Prepare replies
  let replies = await Post.find({
    _id: {
      $gt: req.query.lastReplyId,
      $in: req.targetPost.replies
    }
  }).sort('-dateCreated')

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