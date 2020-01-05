<template lang="pug">
  .loading_wrap(v-if="loading") Loading...
  section(v-else)
    header
      h1.logo Mu-Da
    .signin_wrap
      button(@click.prevent="fbGoogleLogin") Google Login
      button(@click.prevent="fbFacebookLogin") Facebook Login
      p(v-if="error") {{ error }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import firebase, { googleProvider, facebookProvider } from '~/plugins/firebase'

export default {
  data () {
    return {
      error: '',
      loading: true
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid'
    ])
  },
  beforeCreate () {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.login(user.uid)
        this.$router.push('/mypage')
      }
      this.loading = false
    })
  },
  methods: {
    ...mapActions('modules/user', [
      'login'
    ]),
    async singIn (provider) {
      try {
        const { user } = await firebase.auth().signInWithPopup(provider)
        await this.login(user)
      } catch (err) {
        this.error = err.message
      }
      this.$router.push('/mypage')
    },
    fbGoogleLogin () {
      this.singIn(googleProvider)
    },
    fbFacebookLogin () {
      this.singIn(facebookProvider)
    }
  }
}
</script>

<style>

</style>
