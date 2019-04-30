const axios = require('axios')

/**
 * @desc Fetches user public data using user ID
 * @param userId user id to fetch
 * @param select projection
 * @returns User public data
 */
module.exports = async (userId, select = undefined) => {
  try {
    let response = await axios({
      url: `http://api-gateway:3001/user/${userId}${select ? `?select=${select}` : '' }`,
      method: 'get',
      responseType: 'json'
    })
    return response.data // Return user data
  } catch (err) {
    return false
  }
}