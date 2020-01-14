<template lang="pug">
  Loading(v-if="loading")
  section.container(v-else)
    div.my_nav_wrap
      button.edit(type="button" @click="edit")
        img(src="~assets/images/edit.png" alt="" width="25" height="25")
      div.mv_inner
        h1 {{ this.$t('account.title') }}
        p.icon: img(v-if="user.icon" :src="user.icon" :alt="user.name + ' icon'")
        p.name {{ user.name }}
        p.uid 【ID : {{ uid }}】
      BgAnimation
    p.wrap_txt {{ this.$t('account.user-info') }}
    dl.user_info
      dt.label: BirthdaySvg
      dd
        p.txt {{ this.$t('signup.birthday') }}
        p {{ (user.birthday).replace('-', '/').replace('-', '/') }}
    dl.user_info
      dt.label: GenderSvg
      dd
        p.txt {{ this.$t('signup.gender') }}
        p {{ this.$t('signup.' + user.gender) }}
    button.logout(type="button" @click='doLogout') {{ this.$t('account.logout') }}

    .edit_wrap(v-if="isEdit")
      .inner
        button.close(type="button" @click="close"): img(src="~assets/images/close.png" alt="" width="25" height="25")
        p.label {{ this.$t('signup.birthday') }}
        .form_wrap.birthday
          label: input(type="date" min="1980-01-01" :max="date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()" v-model="birthday" v-init:birthday="user.birthday" @change="changeForm")
        p.label {{ this.$t('signup.gender') }}
        .form_wrap.gender
          label(for="man")
            input#man(type="radio" name="gender" value="man" v-model="gender" v-init:gender="user.gender" @change="changeForm")
            | {{ this.$t('signup.man') }}
          label(for="woman")
            input#woman(type="radio" name="gender" value="woman" v-model="gender" v-init:gender="user.gender" @change="changeForm")
            | {{ this.$t('signup.woman') }}
        .submit_wrap
          button(type="submit" @click="signUp(user)" v-bind:disabled="!formDone") {{ this.$t('signup.register') }}
          .error_wrap(v-if="error") {{ this.$t('error.' + error) }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import BgAnimation from '@/components/BgAnimation'
import BirthdaySvg from '@/assets/images/birthday.svg?inline'
import GenderSvg from '@/assets/images/gender.svg?inline'
import { db } from '@/plugins/firebase.js'

export default {
  components: {
    Loading,
    BgAnimation,
    BirthdaySvg,
    GenderSvg
  },
  directives: {
    init: {
      bind (el, binding, vnode) {
        vnode.context[binding.arg] = binding.value
      }
    }
  },
  layout: 'mypage',
  data () {
    return {
      loading: false,
      isEdit: false,
      date: new Date(),
      gender: '',
      birthday: '',
      formDone: '',
      error: ''
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
    },
    edit () {
      this.isEdit = true
    },
    close () {
      this.isEdit = false
    },
    changeForm () {
      this.error = ''
      if (this.validate()) {
        this.formDone = false
      } else {
        this.formDone = true
      }
    },
    async signUp (user) {
      this.loading = true
      this.error = this.validate()
      if (this.error) {
        this.formDone = false
        this.loading = false
      } else {
        await db.collection('users').doc(user.uid).update({
          birthday: this.birthday,
          gender: this.gender
        })
        await window.location.reload()
      }
    },
    validate () {
      let error = ''
      if (!this.birthday) {
        error = 'empty-birthday'
      } else if (!this.gender) {
        error = 'empty-gender'
      } else if (!this.birthday.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}(\s-\s[0-9]{4}-[0-9]{2}-[0-9]{2}|\s[0-9]{2}:[0-9]{2})?$/)) {
        error = 'invalid-birthday'
      } else if (this.gender === 'man' || this.gender === 'woman') {
        error = ''
      } else {
        error = 'invalid-gender'
      }
      return error
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
      padding: 40px 0 45px;
      text-align: center;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      .edit {
        position: absolute;
        right: 15px;
        top: 15px;
        z-index: 3;
        img {
          width: 25px;
          height: 25px;
        }
      }
      .mv_inner {
        position: relative;
        z-index: 4;
        h1 {
          margin-bottom: 30px;
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
    .wrap_txt {
      margin: 30px auto 10px;
      text-align: center;
    }
    .user_info {
      display: flex;
      align-items: center;
      max-width: 500px;
      width: calc(90% - 30px);
      margin: 0 auto 10px;
      border-bottom: 1px solid #ccc;
      padding: 5px 15px 10px;
      .label {
        padding: 10px;
        border-radius: 50%;
        box-shadow: 0 0 10px #e4e4e4;
        svg {
          max-width: 100%;
          width: 30px !important;
          height: auto !important;
          transition: all  0.5s ease;
          fill: #fda085;
        }
      }
      dd {
        margin-left: 25px;
        .txt {
          color: #999;
          margin-bottom: 4px;
          font-size: 14px;
        }
      }
    }
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
    .logout {
      display: block;
      max-width: 300px;
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
    .edit_wrap {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      background: #000000a6;
      z-index: 15;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      transition: all  1s ease;
      .inner {
        max-width: 450px;
        position: absolute;
        top: 10%;
        right: 0;
        left: 0;
        width: calc(85% - 40px);
        padding: 60px 20px 30px;
        margin: auto;
        background: #fff;
        box-shadow: 2px 2px 7px #676767bd;
        border-radius: 5px;
        .close {
          position: absolute;
          right: 12px;
          top: 12px;
          z-index: 3;
          img {
            width: 28px;
            height: 28px;
          }
        }
        h1.logo {
          width: 150px;
          text-align: center;
          margin: 0 auto;
        }
        p.signup_txt {
          text-align: center;
          font-size: 16px;
          margin: 8px 0 30px;
        }
        p.label {
          margin-bottom: 10px;
          color: #909090;
        }
        .form_wrap {
          padding: 5px 5px 8px;
          margin-bottom: 30px;
          border-bottom: 1px solid #cacaca;
        }
        .name {
          p {
            color: #6b6b6b;
          }
        }
        .birthday {
          label {
            position: relative;
            display: inline-block;
            width: calc(100% - 4px);
            height: 36px;
            input {
              position: relative;
              padding: 0 10px;
              width: 100%;
              height: 36px;
              border: 0;
              background: transparent;
              box-sizing: border-box;
              font-size: 16px;
              -webkit-appearance: none;
            }
            input::-webkit-calendar-picker-indicator {
                opacity: 0;
                width: 30px;
                -webkit-appearance: none;
            }
            input::-webkit-inner-spin-button{
              -webkit-appearance: none;
            }
            input::-webkit-clear-button{
              -webkit-appearance: none;
            }
          }
          label::before {
            position: absolute;
            content: "";
            top: 50%;
            right: 5px;
            width: 30px;
            height: 30px;
            margin-top: -15px;
            background-image: url("~assets/images/icon_calendar.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }
        }
        .gender {
          label {
            line-height: 135%;
            position: relative;
            margin: 0.5rem;
            cursor: pointer;
            input {
              position: relative;
              margin: 0 0.7rem 0 0;
              cursor: pointer;
            }
            input::before {
              position: absolute;
              z-index: 1;
              top: 0;
              left: 0.125rem;
              width: 0.75rem;
              height: 0.75rem;
              content: '';
              -webkit-transition: -webkit-transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
              transition: transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
              -webkit-transform: scale(0, 0);
              transform: scale(0, 0);
              border-radius: 50%;
              background: linear-gradient(120deg,#f6d365,#fda085);
              background: -webkit-linear-gradient(120deg,#f6d365,#fda085);
            }
            input:checked::before {
              -webkit-transform: scale(1, 1);
              transform: scale(1, 1);
            }
            input::after {
              position: absolute;
              top: -0.25rem;
              left: -0.125rem;
              width: 1rem;
              height: 1rem;
              content: '';
              border: 2px solid #f2f2f2;
              border-radius: 50%;
              background: #ffffff;
            }
          }
        }
        .submit_wrap {
          button {
            display: block;
            width: 85%;
            margin: 20px auto 0;
            padding: 15px 30px;
            text-align: center;
            font-size: 18px;
            border-radius: 60px;
            background: linear-gradient(120deg,#f6d365,#fda085);
            text-shadow: 3px 2px 10px #f18348;
            color: #fff;
            transition: all  0.5s ease;
          }
          button:disabled {
            background: #cccccc;
            text-shadow: none;
            pointer-events: none;
            transition: all  0.5s ease;
          }
          .error_wrap {
            margin: 15px 0 0;
            text-align: center;
            color: red;
            font-size: 13px;
          }
        }
      }
    }
  }
</style>
