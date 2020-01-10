<template lang="pug">
  section.container
    div.my_nav_wrap
      div.mv_inner
        h1 {{ this.$t('account.title') }}
        p.icon: img(v-if="user.icon" :src="user.icon" :alt="user.name + ' icon'")
        p.name {{ user.name }}
        p.uid 【ID : {{ uid }}】
      BgAnimation
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
      padding: 40px 0 50px;
      text-align: center;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      .mv_inner {
        position: relative;
        z-index: 4;
        h1 {
          margin-bottom: 40px;
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
    }
  }
</style>
