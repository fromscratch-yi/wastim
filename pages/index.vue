<template lang="pug">
  section
    header
      h1.logo Mu-Da
    .signin_wrap
      button(@click.prevent="fbGoogleLogin") Google Login
      button(@click.prevent="fbFacebookLogin") Facebook Login
      p(v-if="error") {{ error }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import firebase, { googleProvider, facebookProvider } from '@/plugins/firebase'

export default {
  data () {
    return {
      error: ''
    }
  },
  middleware: ['handleLogin'],
  computed: {
    ...mapGetters('modules/user', [
      'uid'
    ])
  },
  methods: {
    ...mapActions('modules/user', [
      'login'
    ]),
    async fbGoogleLogin () {
      try {
        const { user } = await firebase.auth().signInWithPopup(googleProvider)
        await this.login(user)
      } catch (err) {
        this.error = err.message
      }
      this.$router.push('/mypage')
    },
    async fbFacebookLogin () {
      try {
        const { user } = await firebase.auth().signInWithPopup(facebookProvider)
        await this.login(user)
      } catch (err) {
        this.error = err.message
      }
      this.$router.push('/mypage')
    }
  }
}

</script>

<style>

</style>
