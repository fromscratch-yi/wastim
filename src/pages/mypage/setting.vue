<template lang="pug">
  Loading(v-if="loading")
  section.container.setting_wrap(v-else)
    div(v-if="user")
      h1.page_ttl
        SettingSvg
        span Setting
      ul.link_wrap
        li: nuxt-link(:to="localePath('mypage')") サービスについて
        li: nuxt-link(:to="localePath('mypage')") 利用規約
        li: nuxt-link(:to="localePath('mypage-data')") プライバシーポリシー
      dl.lang_wrap
        dt 言語
        dd
          .btn_wrap.locale_wrap
            p: nuxt-link(:to="switchLocalePath('en')") EN
            p: nuxt-link(:to="switchLocalePath('ja')") JA
      dl.data_setting_wrap
        dt データ初期化
        dd
          p.explain_txt 日別のスコア情報をすべてリセットします。この操作後のデータ復元はできません。
          button.reset(type="button" @click="deleteReport(user)") Reset
        dt データ削除
        dd
          p.explain_txt アカウント情報を含むすべてのデータを削除します。この操作後のデータ復元はできません。
          button.delete(type="button" @click="deleteUser(user)") Delete
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import SettingSvg from '@/assets/images/setting.svg?inline'
import firebase from '@/plugins/firebase'
import { db } from '@/plugins/firebase.js'

export default {
  components: {
    Loading,
    SettingSvg
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
    async deleteReport (user) {
      this.loading = true
      if (!window.confirm(this.$t('setting.delete-confirm'))) {
        this.loading = false
      } else {
        await db.collection(user.uid + '-daily').where('date', '>', '').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.loading = true
            db.collection(user.uid + '-daily').doc(doc.id).delete().then(() => {
              this.loading = false
              console.log('Document successfully daily deleted')
            }).catch(function (error) {
              console.error('Error removing document: ', error)
            })
          })
        })
        this.loading = false
      }
    },
    async deleteUser (user) {
      this.loading = true
      if (!window.confirm(this.$t('setting.delete-confirm'))) {
        this.loading = false
      } else {
        await db.collection(user.uid + '-daily').where('date', '>', '').get().then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            await db.collection(user.uid + '-daily').doc(doc.id).delete().then(function () {
              console.log('Document successfully daily deleted')
            }).catch(function (error) {
              console.error('Error removing document: ', error)
            })
          })
        })
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
      class: 'setting_body'
    }
  }
}
</script>
<style lang="scss">
  body.setting_body {
    background: #f3f3f3;
    min-height: 100vh;
    .contents {
      background: none;
    }
  }
</style>
<style lang="scss" scoped>
  .setting_wrap {
    background: #f3f3f3;
    font-size: 14px;
    .page_ttl {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 18px 15px;
      font-size: 18px;
      text-align: center;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      color: #fff;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        fill: #fff;
        width: 18px !important;
        height: 18px !important;
        margin-right: 5px;
      }
    }
    .link_wrap {
      background: #fff;
      li {
        border-bottom: 1px solid #f3f3f3;
        a {
          position: relative;
          display: block;
          padding: 20px;
          text-decoration: none;
          color: #333;
        }
        a::after {
          display: block;
          position: absolute;
          top: 50%;
          right: 20px;
          width: 10px;
          height: 10px;
          margin: -5px 0 0;
          border-top: 2px solid #aaa;
          border-right: 2px solid #aaa;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          box-sizing: border-box;
          content: "";
        }
      }
    }
    .lang_wrap {
      margin-top: 15px;
      background: #fff;
      display: flex;
      align-items: center;
      dt {
        padding: 20px;
      }
      dd {
        margin-left: auto;
        padding-right: 15px;
        .btn_wrap {
          display: flex;
          p {
            width: 100%;
            text-align: center;
            a {
              display: block;
              padding: 7px 15px;
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
    }
    .data_setting_wrap {
      dt {
        margin: 20px 0 0;
        font-size: 13px;
        font-weight: bold;
        padding: 0 0 5px 15px;
      }
      dd {
        display: flex;
        padding: 20px;
        background: #fff;
        font-size: 13px;
        .explain_txt {
          width: 70%;
          font-size: 13px;
          margin-right: 20px;
          line-height: 1.3;
        }
        button {
          width: calc(30% - 20px);
          background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);
          text-shadow: 3px 2px 10px #ff9a9e;
          margin: 5px 0;
          border-radius: 15px;
          color: #fff;
          font-size: 16px;
        }
        button.reset {
          background-image: linear-gradient(to right, #b1edfa 0%, #a9c9f9 100%);
          text-shadow: 3px 2px 10px #aacdf9;
        }
        button.delete {
          background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);
          text-shadow: 3px 2px 10px #ff9a9e;
        }
      }
    }
  }
</style>
