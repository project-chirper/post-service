/**
 * @desc Toggle likes a post
 * @return 200
 */
module.exports = async (req, res, next) => {
  let likedIndex = req.targetPost.likedBy.indexOf(req.user)
  likedIndex >= 0 ? req.targetPost.likedBy.splice(likedIndex, 1) : req.targetPost.likedBy.push(req.user)
  try {
    await req.targetPost.save()
  } catch (err) {
    next(err)
  }
  return res.sendStatus(200)
}