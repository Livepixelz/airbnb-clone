<template>
  <div>
    <div v-for="home in homes" :key="home.objectID">
      <nuxt-link :to="`/home/${home.objectID}`">
        <HomeCard :home="home" style="float:left;margin:10px" />
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ $dataApi, error }) {
    return {
      homes: (await $dataApi.getHomes()).json.hits
    }
  },
  head() {
    return {
      title: 'Homepage',
      meta: [
        {
          name: 'description',
          content: 'This is a homepage!',
          hide: 'description'
        }
      ]
    }
  }
}
</script>
