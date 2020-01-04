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
export default {
  middleware: 'authenticated',
  methods: {
    ...mapActions('modules/user', [
      'logout'
    ]),
    async doLogout () {
      await this.logout()
      this.$router.push('/')
    }
  }
}
</script>
