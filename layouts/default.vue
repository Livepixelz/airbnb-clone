<template>
  <div class="app">
    <header class="app-header">
      <div class="app-logo">
        <nuxt-link to="/">
          <img src="/images/logo.svg" />
        </nuxt-link>
      </div>
      <div class="app-search">
        <input
          type="text"
          ref="citySearch"
          @changed="changed"
          placeholder="Enter your address"
        />
        <client-only>
          <template #placeholder>
            <input placeholder="Check In" class="datepicker" />
            <span class="-ml-6 mr-2">to</span>
            <input placeholder="Check Out" class="datepicker" />
          </template>
          <DatePicker
            v-model="range"
            timezone="UTC"
            :modelConfig="{ timeAdjust: '00:00:00' }"
            is-range
          >
            <template v-slot="{ inputValue, inputEvents }">
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="datepicker"
              />
              <span class="-ml-6 mr-2">to</span>
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="datepicker"
              />
            </template>
          </DatePicker>
        </client-only>

        <button @click="search"><img src="/images/icons/search.svg" /></button>
      </div>
      <div class="app-user-menu">
        <template v-if="isLoggedIn">
          <img src="/images/icons/house.svg" alt="" />
          <div class="name">Host</div>
          <img :src="user.profileUrl" class="avatar" />
        </template>
        <div id="googleButton" v-show="!isLoggedIn" class="ml-8"></div>
      </div>
    </header>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: {
        lat: 0,
        lng: 0,
        label: ''
      },
      range: {
        start: new Date(),
        end: new Date()
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn
    }
  },
  methods: {
    changed(event) {
      const place = event.detail
      if (!place.geometry) return
      this.location.label = this.$refs.citySearch.value
      this.location.lat = place.geometry.location.lat()
      this.location.lng = place.geometry.location.lng()
    },
    search() {
      if (!this.location.label) return
      this.$router.push({
        name: 'search',
        query: {
          ...this.location,
          start: this.range.start.getTime() / 1000,
          end: this.range.end.getTime() / 1000
        }
      })
    }
  },
  mounted() {
    this.$maps.makeAutoComplete(this.$refs.citySearch)
  }
}
</script>
