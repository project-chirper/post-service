const mongoose = require('mongoose'),
      Post = mongoose.model('Post'),
      PostReply = mongoose.model('PostReply')

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

  return res.json(await PostReply.formatReplies(replies, req.user))
}