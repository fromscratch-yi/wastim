<template lang="pug">
  Loading(v-if="loading")
  .contents(v-else-if="user")
    .mypage_wrap(v-if="user.gender && user.year && user.month && user.day")
      nuxt
      my-nav
    .signup_wrap(v-else)
      .inner
        h1.logo: img(src="~assets/images/logo.png" alt="Wastim")
        p.signup_txt 〜{{ this.$t('signup.txt') }}〜
        p.label {{ this.$t('signup.name') }}
        .form_wrap.name
          p {{ user.name }}
        p.label {{ this.$t('signup.birthday') }}
        .form_wrap.birthday
          .select_wrap
            select(name="year" v-model="year" @change="changeForm")
              option(value="" disabled selected) yyyy
              option(v-for="n in years" :value="n") {{ n }}
          p /
          .select_wrap
            select(name="month" v-model="month" @change="changeForm")
              option(value="" disabled selected) m
              option(v-for="n in 12" :value="n") {{ ('0' + n).slice(-2) }}
          p.before_day /
          .select_wrap
            select(name="month" v-model="day" @change="changeForm")
              option(value="" disabled selected) d
              option(v-for="n in 31" :value="n") {{ ('0' + n).slice(-2) }}
        p.label {{ this.$t('signup.gender') }}
        .form_wrap.gender
          label(for="man")
            input#man(type="radio" name="gender" value="man" v-model="gender" @change="changeForm")
            | {{ this.$t('signup.man') }}
          label(for="woman")
            input#woman(type="radio" name="gender" value="woman" v-model="gender" @change="changeForm")
            | {{ this.$t('signup.woman') }}
        .submit_wrap
          button(type="submit" @click="signUp(user)" v-bind:disabled="!formDone") {{ this.$t('signup.register') }}
          .error_wrap(v-if="error") {{ this.$t('error.' + error) }}
      .area
        BgAnimation
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import MyNav from '@/components/MyNav'
import BgAnimation from '@/components/BgAnimation'
import firebase from '@/plugins/firebase'
import { db } from '@/plugins/firebase.js'

export default {
  components: {
    Loading,
    MyNav,
    BgAnimation
  },
  data () {
    return {
      loading: true,
      gender: '',
      year: '',
      month: '',
      day: '',
      formDone: '',
      error: ''
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'isAuthenticated',
      'user'
    ]),
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1970 }, (value, index) => 1971 + index)
    }
  },
  beforeCreate () {
    if (!this.isAuthenticated) {
      this.loading = true
      // ここでローディングのインジケータアニメーションを表示すると良い
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.login(user)
          this.loading = false
        } else {
          this.$router.push(this.localePath('index'))
        }
      })
    }
  },
  methods: {
    ...mapActions('modules/user', [
      'login'
    ]),
    changeForm () {
      this.error = ''
      this.validate()
      if (this.error) {
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
          year: this.year,
          month: this.month,
          day: this.day,
          gender: this.gender
        })
        await window.location.reload()
      }
    },
    validate () {
      if (!this.year || !this.month || !this.day) {
        this.error = 'empty-birthday'
      } else if (!this.gender) {
        this.error = 'empty-gender'
      } else if (!(this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.day).slice(-2)).match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}(\s-\s[0-9]{4}-[0-9]{2}-[0-9]{2}|\s[0-9]{2}:[0-9]{2})?$/)) {
        this.error = 'invalid-birthday'
      } else if (this.gender === 'man' || this.gender === 'woman') {
        this.error = ''
      } else {
        this.error = 'invalid-gender'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .contents {
    background: #ffffff;
    flex: 1;
    padding-bottom: 80px;
  }
  .signup_wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(120deg,#f6d365,#fda085);
    background: -webkit-linear-gradient(120deg,#f6d365,#fda085);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .inner {
      max-width: 450px;
      position: absolute;
      top: 5%;
      right: 0;
      left: 0;
      width: calc(85% - 40px);
      padding: 30px 20px;
      margin: auto;
      background: #fff;
      box-shadow: 2px 2px 7px #676767bd;
      border-radius: 5px;
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
        display: flex;
        align-items: center;
        .select_wrap {
          position: relative;
          select {
            font: 400 11px system-ui;
            font-size: 16px;
            -webkit-appearance: none;
            -ms-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: none;
            background-color: #fff;
          }
        }
        p {
          margin: 0 5px;
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
                    transition:         transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
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
          width: 60%;
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
</style>
