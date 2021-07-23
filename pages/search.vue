<template>
  <div class="app-search-results-page">
    <div class="app-search-results">
      <div class="app-search-results-listing">
        <h2 class="app-title">Stays in {{ label }}</h2>
        <nuxt-link
          :to="`/home/${home.objectID}`"
          v-for="home in homes"
          :key="home.objectID"
        >
          <HomeRow
            class="app-house"
            :home="home"
            @mouseover.native="highlightMarker(home.objectID, true)"
            @mouseout.native="highlightMarker(home.objectID, false)"
          />
        </nuxt-link>
      </div>
      <div class="app-search-results-map">
        <div class="app-map" ref="map"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: `Homes around ${this.label}`
    }
  },
  async beforeRouteUpdate(to, from, next) {
    const response = await this.$dataApi.getHomesByLocation(
      to.query.lat,
      to.query.lng,
      to.query.start,
      to.query.end
    )
    if (!response.ok) {
      return error({
        statusCode: response.status,
        message: response.statusText
      })
    }
    this.homes = response.json.hits
    this.label = to.query.label
    this.lat = to.query.lat
    this.lng = to.query.lng
    this.updateMap()
    next()
  },
  async asyncData({ query, $dataApi, error }) {
    const response = await $dataApi.getHomesByLocation(
      query.lat,
      query.lng,
      query.start,
      query.end
    )
    if (!response.ok) {
      return error({
        statusCode: response.status,
        message: response.statusText
      })
    }
    return {
      homes: response.json.hits,
      label: query.label,
      lat: query.lat,
      lng: query.lng
    }
  },
  methods: {
    highlightMarker(homeId, isHighlighted) {
      const marker = document.querySelector(`.home-${homeId}`)
      if (marker) marker.classList.toggle('marker-highlight', isHighlighted)
    },
    updateMap() {
      this.$maps.showMap(
        this.$refs.map,
        this.lat,
        this.lng,
        this.getHomeMarkers()
      )
    },
    getHomeMarkers() {
      if (this.homes.length === 0) return null
      const coords = this.homes.map(home => {
        return {
          ...home._geoloc,
          pricePerNight: home.pricePerNight,
          id: home.objectID
        }
      })
      return coords
    }
  },
  mounted() {
    this.updateMap()
  }
}
</script>
<style>
.marker {
  background-color: #fff;
  border: 1px solid lightgray;
  font-weight: bold;
  border-radius: 20px;
  padding: 5px 8px;
}
.marker-highlight {
  color: #fff !important;
  background-color: #000;
  border-color: black;
}
</style>
