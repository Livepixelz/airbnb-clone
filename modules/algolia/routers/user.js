import fetch from 'node-fetch'
import { unWrap, getErrorResponse } from '../../../utils/fetchUtils'
import { sendJSON } from '../../helpers'

export default apis => {
  return async function getUserRoute(req, res, next) {
    console.log(req.url)
    const { identity } = req
    const userData = await apis.user.getById(identity)

    if (userData.status === 200) {
      sendJSON(userData.json, res)
      return
    }
    const payload = makerUserPayload(identity)
    apis.user.create(identity, payload)
    sendJSON(payload, res)
    next()
  }

  function makerUserPayload(identity) {
    return {
      name: identity.name,
      email: identity.email,
      image: identity.image,
      homeId: [],
      reviewCount: 0,
      description: '',
      joined: new Date().toISOString()
    }
  }
}
