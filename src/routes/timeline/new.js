const mongoose = require('mongoose'),
      axios = require('axios'),
      Post = mongoose.model('Post')

/**
 * @desc Loads all new posts since last sent post
 * @query lastPostId The ID of the last post
 * @return post public data JSON
 */
module.exports = async (req, res, next) => {
  // validate lastPostId
  if(!mongoose.Types.ObjectId.isValid(req.query.lastPostId)) return res.sendStatus(404)

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
  let posts = await Post.find({
    _id: { $gt: req.query.lastPostId },
    author: { $in: following }
  }).sort('-dateCreated')

  return res.json({
    count: posts.length,
    posts: await Promise.all(posts.map(async post => await post.publicData({ viewer: req.user })))
  })
}