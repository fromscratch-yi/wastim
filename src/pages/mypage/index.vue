<template lang="pug">
  section.container
    div(v-if="user")
      h1 Home
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
  }
}
</script>
