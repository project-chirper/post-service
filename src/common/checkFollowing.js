const axios = require('axios')

/**
 * @desc Checks if a user is following another user or not
 * @param userId user id 
 * @param targetUserId target user id
 * @returns True if user is following target user, false if not
 */
module.exports = async (userId, targetUserId) => {
  try {
    let response = await axios({
      url: `http://api-gateway:3001/api/user/${userId}/following/${targetUserId}`,
      method: 'get',
      responseType: 'json'
    })
    return response.data // Return user data
  } catch (err) {
    return false
  }
}