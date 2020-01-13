<template lang="pug">
  section.container
    div(v-if="user")
      h1 Setting
      p.wrap_txt {{ this.$t('setting.lang') }}
      div.locale_wrap
        p: nuxt-link(:to="switchLocalePath('en')") EN
        p: nuxt-link(:to="switchLocalePath('ja')") JA
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
  },
  head: {
    bodyAttrs: {
      class: 'my_account'
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    .locale_wrap {
      display: flex;
      margin: 0 auto 40px;
      max-width: 300px;
      width: 60%;
      p {
        width: 100%;
        text-align: center;
        a {
          display: block;
          padding: 15px 5px;
          background: #fff;
          border: 2px solid #fda085;
          text-decoration: none;
          font-weight: bold;
          color: #fff;
        }
        a:link, a:visited {
          color: #fda085;
        }
        a.nuxt-link-exact-active {
          background: #fda085;
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
</style>
