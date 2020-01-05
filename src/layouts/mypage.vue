<template lang="pug">
  div
    Loading(v-if="loading")
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
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading.vue'
import firebase from '~/plugins/firebase'

export default {
  components: {
    Loading
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'isAuthenticated'
    ])
  },
  beforeCreate () {
    if (!this.isAuthenticated) {
      this.loading = true
      // ここでローディングのインジケータアニメーションを表示すると良い
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.login(user)
          this.loading = false
        } else {
          this.$router.push('/')
        }
      })
    }
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
