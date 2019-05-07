const mongoose = require('mongoose'),
      Post = mongoose.model('Post')

/**
 * @desc Fetches posts from specific author
 * @param user_id User's id
 * @query amount Amount of posts to fetch (limit)
 * @query offset Current page (skip = amount*offset)
 * @return JSON of post public data
 */
module.exports = async (req, res, next) => {
  // Validate user id
  if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) res.sendStatus(404) // User ID invalid
  // Normalize options
  let options = {
    amount: req.query.amount ? parseInt(req.query.amount) : 10, // default 10
    offset: req.query.offset ? parseInt(req.query.offset) : 0 // default 0
  }
  // Validate options
  if (options.amount <= 0 || options.amount > 20) return res.sendStatus(401) // Unauthorized
  if (options.offset < 0) return res.sendStatus(404) // Page not found 404

  // Find posts
  let posts = await Post.find({ author: req.params.user_id }).skip(options.offset * options.amount).limit(options.amount)

  // Return posts
  return res.json({
    count: posts.length,
    author: posts[0] ? (await posts[0].publicData()).author : undefined,
    posts: await Promise.all(posts.map(async post => { 
      let publicPost = await post.publicData({ viewer: req.user })
      delete publicPost.author
      return publicPost
    }))
  })
}