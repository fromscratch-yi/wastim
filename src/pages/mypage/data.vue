<template lang="pug">
  section.container
    div(v-if="user")
      img(v-if="user.icon" :src="user.icon" :alt="user.name + ' icon'")
      p User ID: {{ uid }}
      p Name: {{ user.name }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'mypage',
  data () {
    return {
      allusers: []
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ])
  },
  head: {
    bodyAttrs: {
      class: 'my_account'
    }
  }
}
</script>
<style lang="scss" scoped>
  body {
    background-color: #fff;
  }
</style>
