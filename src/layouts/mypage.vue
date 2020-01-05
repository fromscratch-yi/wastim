<template lang="pug">
  .contents
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
  beforeCreate () {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await this.login(user)
      } else {
        this.$router.push('/')
      }
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
