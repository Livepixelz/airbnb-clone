<template>
  <div class="app-container">
    <PropertyGallery :images="home.images" />
    <PropertyDetails :home="home" />
    <PropertyDescription :home="home" />
    <PropertyMap :home="home" />
    <PropertyReviews v-if="reviews" :reviews="reviews" />
    <PropertyHost v-if="user" :user="user" />
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: this.home.title
    }
  },
  async asyncData({ params, $dataApi, error }) {
    const responses = await Promise.all([
      $dataApi.getHome(params.id),
      $dataApi.getReviewsByHomeId(params.id),
      $dataApi.getUserByHomeId(params.id)
    ])

    const errorReponse = responses.find(response => !response.ok)
    if (errorReponse) {
      return error({
        statusCode: userResponse.status,
        message: userResponse.statusText
      })
    }
    console.log(responses)
    return {
      home: responses[0].json,
      reviews: responses[1].json.hits,
      user: responses[2].json.hits[0]
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>
