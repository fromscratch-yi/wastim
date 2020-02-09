<template lang="pug">
  Loading(v-if="loading")
  section.page(v-else)
    .inner
      .signin_wrap
        .logo_wrap
          p.logo: img(src="~assets/images/logo.png" alt="WasTim")
          div.locale_wrap
            p: nuxt-link(:to="switchLocalePath('en')") EN
            p: nuxt-link(:to="switchLocalePath('ja')") JA
        p.signin_ttl 〜 <span>Sign Up</span> &amp; <span class="in_txt">Sign In</span> 〜
        ul.signin_list
          li
            button.signin_btn(@click.prevent="fbGoogleLogin")
              span.img_wrap: img(loading="lazy" src="~assets/images/google.svg" alt="Google" width="20" height="20")
              span.signin_txt Sign in with Google
          li
            button.signin_btn.facebook(@click.prevent="fbFacebookLogin")
              span.img_wrap: img(loading="lazy" src="~assets/images/facebook.svg" alt="Facebook" width="20" height="20")
              span.signin_txt Sign in with Facebook
        .error_wrap: p.txt(v-if="error" v-html="error")
        p.attention {{ $t('signin-attention') }}
        ul.link_wrap
          li.about
            nuxt-link(:to="localePath('about')") {{ $t('setting.about') }}
          li.term_of_service
            nuxt-link(:to="localePath('term_of_service')") {{ $t('setting.term-of-service') }}
          li.privacy_policy
            nuxt-link(:to="localePath('privacy_policy')") {{ $t('setting.privacy-policy') }}
    .area
      BgAnimation
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading.vue'
import BgAnimation from '@/components/BgAnimation'
import firebase, { googleProvider, facebookProvider } from '@/plugins/firebase'
import Meta from '~/assets/mixins/meta'

export default {
  components: {
    Loading,
    BgAnimation
  },
  mixins: [Meta],
  data () {
    return {
      meta: {
        title: this.$t('title.top'),
        description: this.$t('top-description'),
        type: 'article',
        url: this.$route.fullPath,
        image: 'ogp' + this.$i18n.locale + '.gif',
        lang: this.$i18n.locale,
        bodyClass: 'top'
      },
      error: null,
      loading: true
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user',
      'isAuthenticated'
    ])
  },
  async beforeCreate () {
    if (!this.isAuthenticated) {
      this.loading = true
      await firebase.auth().getRedirectResult().then(async (result) => {
        if (result.user) {
          await this.login(result.user)
          await this.$router.push(this.localePath('mypage'))
        }
      }).catch((error) => {
        this.error = this.$t('error.' + error.code)
      })
      await firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await this.login(user)
          let path = this.localePath('mypage')
          if (this.user.lang === 'en') {
            path = '/en/mypage'
          }
          await this.$router.push(path)
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
  head () {
    return {
      title: this.$t('title.top'),
      meta: [
        { hid: 'description', name: 'description', content: this.$t('top-description') }
      ],
      bodyAttrs: {
        class: 'top'
      }
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
.signin_wrap {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  margin: auto;
  max-width: 550px;
  width: calc(93% - 40px);
  background: #fff;
  padding: 30px 20px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
  text-align: center;
  .logo_wrap {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px dashed #fda085;
    margin-bottom: 35px;
    background: #fff;
    .logo {
      max-width: 50%;
      width: 180px;
    }
    .locale_wrap {
      display: flex;
      margin: 0 0 0 auto;
      width: 110px;
      p {
        width: 100%;
        text-align: center;
        a {
          display: block;
          padding: 8px 5px;
          background: #fff;
          border: 2px solid #fda085;
          text-decoration: none;
          font-weight: bold;
          color: #fff;
          font-size: 13px;
        }
        a:link, a:visited {
          color: #fda085;
        }
        a.nuxt-link-exact-active {
          background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
          color: #fff;
        }
      }
      P:first-child a {
        border-top-left-radius : 60px;
        -webkit-border-top-left-radius: 60px;
        -moz-border-radius-topleft: 60px;
        border-bottom-left-radius : 60px;
        -webkit-border-bottom-left-radius: 60px;
        -moz-border-radius-bottomleft: 60px;
        border-right: none;
      }
      p:last-child a {
        border-top-right-radius : 60px;
        -webkit-border-top-right-radius: 60px;
        -moz-border-radius-topright: 60px;
        border-bottom-right-radius : 60px;
        -webkit-border-bottom-right-radius: 60px;
        -moz-border-radius-bottomright: 60px;
        border-left: none;
      }
    }
  }
  .signin_ttl {
    margin: 30px 0 20px;
    text-align: center;
    font-size: 18px;
    color: #999;
    span {
      color: #fda085;
      font-size: 20px;
      font-weight: bold;
    }
    span.in_txt {
      color: #f8c86d;
    }
  }
  .signin_list {
    .signin_btn {
      display: table;
      direction: ltr;
      font-weight: 500;
      height: auto;
      line-height: normal;
      max-width: 300px;
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
  .attention {
    font-size: 12px;
    color: #636363;
    line-height: 1.3;
    text-align: center;
  }
  .link_wrap {
    text-align: center;
    display: inline-block;
    margin: 25px auto 0;
    li {
      display: flex;
      align-items: center;
      margin: 0 0 15px;
      a {
        color: rgb(94, 94, 94);
      }
    }
    li::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      margin-right: 6px;
      border: 2px solid;
      border-color: #565656 #565656 transparent transparent;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}
</style>
