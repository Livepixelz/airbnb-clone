<template>
  <div>
    <span v-for="home in homesList" :key="home.objectID">
      {{ home.title }}:
      <button class="button" @click="deleteHome(home.objectID)">
        Delete</button
      ><br />
    </span>
    <h2 class="text-xl bold">Add a Home</h2>
    <form @submit.prevent="onSubmit" class="form">
      Images: <br />
      <ImageUploader @file-uploaded="addImageUrl($event, 0)" />
      <ImageUploader @file-uploaded="addImageUrl($event, 1)" />
      <ImageUploader @file-uploaded="addImageUrl($event, 2)" />
      <ImageUploader @file-uploaded="addImageUrl($event, 3)" />
      <ImageUploader @file-uploaded="addImageUrl($event, 4)" />
      Title: <br />
      <input type="text" v-model="home.title" class="w-60" /><br />
      Description: <br />
      <textarea v-model="home.description" class="w-104"></textarea><br />
      Note: <br />
      <textarea v-model="home.note" class="w-104"></textarea><br />
      Features: <br />
      <input type="text" v-model="home.features[0]" class="w-26" />
      <input type="text" v-model="home.features[1]" class="w-26" />
      <input type="text" v-model="home.features[2]" class="w-26" />
      <input type="text" v-model="home.features[3]" class="w-26" />
      <input type="text" v-model="home.features[4]" class="w-26" /><br />
      Price Per Night: <br />
      <input type="number" v-model="home.pricePerNight" class="w-14" /><br />
      Guests / Rooms / Beds / Baths: <br />
      <input type="number" v-model="home.guests" class="w-14" />
      <input type="number" v-model="home.bedrooms" class="w-14" />
      <input type="number" v-model="home.beds" class="w-14" />
      <input type="number" v-model="home.bathrooms" class="w-14" /><br />

      <input
        type="text"
        ref="locationSelector"
        autocomplete="off"
        placeholder="Select a location"
        @changed="changed"
      />
      <br />
      Address:
      <input type="text" v-model="home.location.address" class="w-60" /><br />
      City:
      <input type="text" v-model="home.location.city" class="w-26" /><br />
      State:
      <input type="text" v-model="home.location.state" class="w-26" /><br />
      PostalCode:
      <input
        type="text"
        v-model="home.location.postalCode"
        class="w-26"
      /><br />
      Country:
      <input type="text" v-model="home.location.country" class="w-26" /><br />
      <DatePicker
        v-for="(range, index) in home.availabilityRanges"
        :key="index"
        v-model="home.availabilityRanges[index]"
        timezone="UTC"
        :modelConfig="{ timeAdjust: '00:00:00' }"
        is-range
      >
        <template v-slot="{ inputValue, inputEvents }">
          <input :value="inputValue.start" v-on="inputEvents.start" />
          to
          <input :value="inputValue.end" v-on="inputEvents.end" />
        </template> </DatePicker
      ><br />
      <button class="border px-4 py-2 border-gray-400">Add</button>
    </form>
  </div>
</template>
<script>
import { unWrap } from '~/utils/fetchUtils'
export default {
  data() {
    return {
      homesList: [],
      home: {
        title: '',
        description: '',
        note: '',
        pricePerNight: '',
        guests: '',
        bedrooms: '',
        beds: '',
        bathrooms: '',
        features: ['', '', '', '', ''],
        location: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        _geoloc: {
          lat: '',
          lng: ''
        },
        images: ['', '', '', '', ''],
        availabilityRanges: [
          {
            start: '',
            end: ''
          },
          {
            start: '',
            end: ''
          }
        ]
      }
    }
  },
  methods: {
    async deleteHome(homeId) {
      await fetch(`/api/homes/${homeId}`, {
        method: 'DELETE'
      })
      const index = this.homesList.findIndex(obj => obj.objectID === homeId)
      this.homesList.splice(index, 1)
    },
    async setHomesList() {
      const response = await unWrap(await fetch('/api/homes/user/'))
      this.homesList = response.json
    },
    changed(event) {
      const address = event.detail

      if (!address.geometry) return
      const addressInfos = address.address_components
      const streetNumber = this.getAddressInfo(addressInfos, 'street_number')
      const route = this.getAddressInfo(addressInfos, 'route')

      this.home.location.address = `${
        streetNumber ? streetNumber + ' ' : ''
      }${route}`
      this.home.location.city = this.getAddressInfo(addressInfos, 'locality')
      this.home.location.state =
        this.getAddressInfo(addressInfos, 'administrative_area_level_2') ||
        this.getAddressInfo(addressInfos, 'administrative_area_level_1')
      this.home.location.postalCode = this.getAddressInfo(
        addressInfos,
        'postal_code'
      )
      this.home.location.country = this.getAddressInfo(addressInfos, 'country')
      this.home._geoloc.lat = address.geometry.location.lat()
      this.home._geoloc.lng = address.geometry.location.lng()
    },
    addImageUrl(imageURL, index) {
      this.home.images[index] = imageURL
    },
    getAddressInfo(infos, type) {
      return infos.find(info => info.types.includes(type))?.long_name ?? ''
    },
    async onSubmit() {
      const response = await unWrap(
        await fetch('/api/homes', {
          method: 'POST',
          body: JSON.stringify(this.home),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      this.homesList.push({
        objectID: response.json.homeId,
        title: this.home.title
      })
    }
  },
  mounted() {
    this.$maps.makeAutoComplete(this.$refs.locationSelector, ['address'])
    this.setHomesList()
  }
}
</script>
<style scoped>
.form input,
.form textarea {
  @apply p-1 m-1 bg-gray-200;
}
.form .uploaded-images {
  @apply flex;
}
.form .uploaded-image {
  @apply w-40;
  @apply h-40;
  @apply object-cover;
}
</style>
