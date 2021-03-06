const axios = require('axios')

/**
 * @desc Checks if a user is following another user, OR return list of people user is following
 * @param userId user id 
 * @param targetUserId target user id
 * @returns True if user is following target user, false if not
 */
module.exports = async (userId, targetUserId = false) => {
  try {
    let response = await axios({
      url: `http://api-gateway:3001/api/user/${userId}/following${ targetUserId ? '/'+targetUserId : '' }`,
      method: 'get',
      responseType: 'json'
    })
    return response.data // Return user data
  } catch (err) {
    if(targetUserId) return false; else throw new Error(err)
  }
}