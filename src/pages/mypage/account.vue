<template lang="pug">
  section.container
    div.my_nav_wrap
      div.mv_inner
        h1 {{ this.$t('account.title') }}
        p.icon: img(v-if="user.icon" :src="user.icon" :alt="user.name + ' icon'")
        p.name {{ user.name }}
        p.uid 【ID : {{ uid }}】
      BgAnimation
    p.setting_txt {{ this.$t('account.setting') }}
    div.locale_wrap
      p: nuxt-link(:to="switchLocalePath('en')") EN
      p: nuxt-link(:to="switchLocalePath('ja')") JA
    button.logout(type="button" @click='doLogout') {{ this.$t('account.logout') }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BgAnimation from '@/components/BgAnimation'

export default {
  components: {
    BgAnimation
  },
  layout: 'mypage',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ])
  },
  methods: {
    ...mapActions('modules/user', [
      'logout'
    ]),
    doLogout () {
      this.logout()
      this.$router.push(this.localePath('index'))
    }
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
    .my_nav_wrap {
      position: relative;
      padding: 50px 0 60px;
      text-align: center;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      .mv_inner {
        position: relative;
        z-index: 4;
        h1 {
          margin-bottom: 35px;
          font-size: 18px;
          color: #333;
        }
        .icon {
          text-align: center;
          img {
            display: inline-block;
            width: 100px;
            border: 2px solid #fff;
            border-radius: 50%;
          }
        }
        .name {
          margin: 15px 0 8px;
        }
      }
      .circles {
        z-index: 1;
      }
    }
    .setting_txt {
      margin: 30px auto 10px;
      text-align: center;
    }
    .locale_wrap {
      display: flex;
      margin: 0 auto 40px;
      max-width: 260px;
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
    .logout {
      display: block;
      width: 60%;
      margin: 20px auto 0;
      padding: 15px 30px;
      text-align: center;
      font-size: 18px;
      border-radius: 60px;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      text-shadow: 3px 2px 10px #f18348;
      color: #fff;
    }
  }
</style>
