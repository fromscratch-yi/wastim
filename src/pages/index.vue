<template lang="pug">
  Loading(v-if="loading")
  section.page(v-else)
    .inner
      header
        h1.logo Mu-Da
      ul.signin_wrap
        li
          button.signin_btn(@click.prevent="fbGoogleLogin")
            span.img_wrap: img(loading="lazy" src="~assets/images/google.svg" alt="Google" width="18" height="18")
            span.signin_txt Sign in with Google
        li
          button.signin_btn.facebook(@click.prevent="fbFacebookLogin")
            span.img_wrap: img(loading="lazy" src="~assets/images/facebook.svg" alt="Facebook" width="18" height="18")
            span.signin_txt Sign in with Facebook
        p(v-if="error") {{ error }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading.vue'
import firebase, { googleProvider, facebookProvider } from '@/plugins/firebase'

export default {
  components: {
    Loading
  },
  data () {
    return {
      error: '',
      loading: true
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
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
          this.$router.push('/mypage')
        } else {
          this.loading = false
        }
      })
    }
  },
  methods: {
    ...mapActions('modules/user', [
      'login'
    ]),
    async singIn (provider) {
      this.loading = true
      try {
        const { user } = await firebase.auth().signInWithRedirect(provider)
        await this.login(user)
        this.$router.push('/mypage')
      } catch (err) {
        this.error = err.message
        this.loading = false
      }
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

<style lang="scss" scoped>
.page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  .inner {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
header {
  padding: 10px 15px;
}
.signin_wrap {
  .signin_btn {
    display: table;
    direction: ltr;
    font-weight: 500;
    height: auto;
    line-height: normal;
    max-width: 220px;
    min-height: 40px;
    padding: 8px 16px;
    text-align: left;
    width: 100%;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    border-radius: 20px;
    margin: 15px auto 0;
    background: #fff;
    .img_wrap {
      display: table-cell;
      vertical-align: middle;
      img {
        display: inline-block;
        vertical-align: middle;
        height: 18px;
        width: 18px;
      }
    }
    .signin_txt {
      display: table-cell;
      font-size: 14px;
      padding-left: 16px;
      text-transform: none;
      vertical-align: middle;
      color: #757575;
    }
  }
  .signin_btn.facebook {
    background-color: #3b5998;
    .signin_txt {
      color: #fff;
    }
  }
}
</style>
