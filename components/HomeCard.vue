<template>
  <div>
    <nuxt-img
      v-if="home.images[0]"
      provider="cloudinary"
      width="200"
      height="150"
      :src="home.images[0]"
    />
    <br />
    {{ home.title }} <br />
    {{ home.location.address }} {{ home.location.city }}
    {{ home.location.state }} <br />
    {{ home.guests }} guests <br />
    {{ home.pricePerNight }} / night <br />
  </div>
</template>
<script>
export default {
  props: {
    home: {
      type: Object,
      required: true
    }
  }
}
</script>
