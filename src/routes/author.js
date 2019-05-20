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
  console.log("hi")

  // Validate user id
  if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) return res.sendStatus(404) // User ID invalid
  // Validate firstPostId
  if (req.query.firstPostId && !mongoose.Types.ObjectId.isValid(req.query.firstPostId)) return res.sendStatus(422)
  
  // Normalize options
  let options = {
    amount: req.query.amount ? parseInt(req.query.amount) : 10, // default 10
    offset: req.query.offset ? parseInt(req.query.offset) : 0 // default 0
  }
  // Validate options
  if (options.amount <= 0 || options.amount > 25 | options.offset < 0) return res.sendStatus(422) //Unprocessable Entity

  // Prepare query
  let query = { author: req.params.user_id }
  if (req.query.firstPostId) query._id = { $lte: req.query.firstPostId } // add first post id

  // Find posts
  let posts = await Post.find(query).skip(options.offset * options.amount).limit(options.amount).sort('-dateCreated')

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