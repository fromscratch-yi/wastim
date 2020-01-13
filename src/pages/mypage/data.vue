<template lang="pug">
  section.container
    div(v-if="user")
      h1 Data
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
