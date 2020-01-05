<template lang="pug">
  div
    .loading_wrap(v-if="loading") Loading...
    .contents(v-else)
      header
        p.logo Mu-Da
        nav
          nuxt-link(to="/") Home
          button(type="button" @click='doLogout') Logout
      div
        nuxt
</template>

<script>
import { mapActions } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
  data () {
    return {
      loading: true
    }
  },
  beforeCreate () {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.login(user)
      } else {
        this.$router.push('/')
      }
      this.loading = false
    })
  },
  methods: {
    ...mapActions('modules/user', [
      'logout',
      'login'
    ]),
    async doLogout () {
      await this.logout()
      this.$router.push('/')
    }
  }
}
</script>
