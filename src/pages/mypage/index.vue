<template lang="pug">
  section.container
    div(v-if="user")
      p User ID: {{ uid }}
      p Current User: {{ user.name }}
      img(v-if="user.icon" :src="user.icon" alt="")
      p All DB User {{ allusers }}
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
