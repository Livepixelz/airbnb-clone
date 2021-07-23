import { unWrap, getErrorResponse } from '../utils/fetchUtils'

export default function({ $config }, inject) {
  const apiRootUrl = `https://${$config.algolia.appId}-dsn.algolia.net/1/indexes`
  const headers = {
    'X-Algolia-API-Key': $config.algolia.apiKey,
    'X-Algolia-Application-Id': $config.algolia.appId
  }

  inject('dataApi', {
    getHomes,
    getHome,
    getReviewsByHomeId,
    getUserByHomeId,
    getHomesByLocation
  })

  async function getHome(homeId) {
    try {
      return unWrap(
        await fetch(`${apiRootUrl}/homes/${homeId}`, {
          headers
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getReviewsByHomeId(homeId) {
    try {
      return unWrap(
        await fetch(`${apiRootUrl}/reviews/query`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            filters: `homeId:${homeId}`,
            hitsPerPage: 6,
            attributesToHighlight: []
          })
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getUserByHomeId(homeId) {
    try {
      return unWrap(
        await fetch(`${apiRootUrl}/users/query`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            filters: `homeId:${homeId}`,
            attributesToHighlight: []
          })
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomesByLocation(
    lat,
    lng,
    start,
    end,
    radiusInMeters = 1500 * 15
  ) {
    const days = []
    for (let day = start; day <= end; day += 86400) {
      days.push(`availability:${day}`)
    }
    try {
      return unWrap(
        await fetch(`${apiRootUrl}/homes/query`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            aroundLatLng: `${lat},${lng}`,
            aroundRadius: radiusInMeters,
            hitsPerPage: 10,
            filters: days.join(' AND '),
            attributesToHighlight: []
          })
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomes() {
    try {
      return unWrap(
        await fetch(`${apiRootUrl}/homes/query`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            hitsPerPage: 3,
            attributesToHighlight: []
          })
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }
}
