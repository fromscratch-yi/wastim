<template lang="pug">
  Loading(v-if="loading")
  section.container(v-else)
    div(v-if="user")
      h1 Setting
      p.wrap_txt {{ $t('setting.lang') }}
      div.locale_wrap
        p: nuxt-link(:to="switchLocalePath('en')") EN
        p: nuxt-link(:to="switchLocalePath('ja')") JA
      p.wrap_txt データ削除
      button(type="button" @click="deleteUser(user)") データ削除
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import firebase from '@/plugins/firebase'
import { db } from '@/plugins/firebase.js'

export default {
  components: {
    Loading
  },
  layout: 'mypage',
  data () {
    return {
      loading: false,
      allusers: []
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
    async deleteUser (user) {
      this.loading = true
      if (!window.confirm(this.$t('setting.delete-confirm'))) {
        this.loading = false
      } else {
        await db.collection('users').doc(user.uid).delete().then(function () {
          console.log('Document successfully deleted')
        }).catch(function (error) {
          console.error('Error removing document: ', error)
        })
        const currentUser = firebase.auth().currentUser
        currentUser.delete().then(function () {
          console.log('User successfully deleted')
        }).catch(function (error) {
          console.log('Error removeing user: ', error)
        })
        await this.logout()
        await this.$router.push(this.localePath('index'))
      }
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
