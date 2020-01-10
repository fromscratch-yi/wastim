<template lang="pug">
  Loading(v-if="loading")
  section.page(v-else)
    .inner
      header
        div.locale_wrap
          p: nuxt-link(:to="switchLocalePath('en')") EN
          p: nuxt-link(:to="switchLocalePath('ja')") JA
      .mv
        h1.logo Wastim
        p.explain(v-html="this.$t('explain')")
      ul.signin_wrap
        li
          button.signin_btn(@click.prevent="fbGoogleLogin")
            span.img_wrap: img(loading="lazy" src="~assets/images/google.svg" alt="Google" width="20" height="20")
            span.signin_txt Sign in with Google
        li
          button.signin_btn.facebook(@click.prevent="fbFacebookLogin")
            span.img_wrap: img(loading="lazy" src="~assets/images/facebook.svg" alt="Facebook" width="20" height="20")
            span.signin_txt Sign in with Facebook
      .error_wrap: p.txt(v-if="error" v-html="error")
    .area
      BgAnimation
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading.vue'
import BgAnimation from '@/components/BgAnimation'
import firebase, { googleProvider, facebookProvider } from '@/plugins/firebase'

export default {
  components: {
    Loading,
    BgAnimation
  },
  data () {
    return {
      error: null,
      loading: true
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'isAuthenticated'
    ])
  },
  async beforeCreate () {
    if (!this.isAuthenticated) {
      this.loading = true
      await firebase.auth().getRedirectResult().then(async (result) => {
        if (result.user) {
          await this.login(result.user)
          this.$router.push(this.localePath('mypage'))
        }
      }).catch((error) => {
        this.error = this.$t('error.' + error.code)
      })
      await firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await this.login(user)
          this.$router.push(this.localePath('mypage'))
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
        await firebase.auth().signInWithRedirect(provider)
      } catch (error) {
        this.error = this.$t('error.' + error.code)
        this.loading = false
      }
    },
    fbGoogleLogin () {
      this.singIn(googleProvider)
    },
    fbFacebookLogin () {
      this.singIn(facebookProvider)
    }
  },
  head: {
    bodyAttrs: {
      class: 'top'
    }
  }
}
</script>
<style lang="scss">
body.top {
  background: -moz-linear-gradient(top, #f6d365, #fda085);
  background: -webkit-linear-gradient(top, #f6d365, #fda085);
  background: linear-gradient(to bottom, #f6d365, #fda085);
  background-color: #f6d365;
}
</style>
<style lang="scss" scoped>
.page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  background: -webkit-linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  .inner {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
.mv {
  padding: 10px 15px;
}
.signin_wrap {
  .signin_btn {
    display: table;
        direction: ltr;
    font-weight: 500;
    height: auto;
    line-height: normal;
    max-width: 260px;
    min-height: 40px;
    padding: 15px 30px;
    text-align: left;
    width: 100%;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    border-radius: 40px;
    margin: 15px auto 0;
    background: #fff;
    .img_wrap {
      display: table-cell;
      vertical-align: middle;
      img {
        display: inline-block;
        vertical-align: middle;
        height: 20px;
        width: 20px;
      }
    }
    .signin_txt {
      display: table-cell;
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
.error_wrap {
  max-width: 400px;
  margin: 20px auto;
  padding: 0 15px;
  text-align: center;
  .txt {
    display: inline-block;
    color: #e80000;
    font-size: 0.82rem;
    line-height: 1.2;
  }
}
</style>
