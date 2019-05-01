const mongoose = require('mongoose'),
      Post = mongoose.model('Post')

/**
 * @desc Middleware that loads a post document using :post_id param on routes
 * @param post_id id of post
 * @return req.targetPost -> Post document
 */
module.exports = (select) => {
  return async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.post_id)) return res.sendStatus(404)
    req.targetPost = await Post.findById(req.params.post_id, select)
    if (!req.targetPost) return res.sendStatus(404) // Post not found 404
    next()
  }
} 