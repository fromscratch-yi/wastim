<template lang="pug">
  Loading(v-if="loading")
  section.container(v-else)
    div.my_nav_wrap
      button.edit(type="button" @click="edit")
        img(src="~assets/images/edit.png" alt="" width="25" height="25")
      div.mv_inner
        h1 {{ $t('account.title') }}
        p.icon: img(v-if="user.icon" :src="user.icon" :alt="user.name + ' icon'")
        p.name {{ user.name }}
      BgAnimation
    .user_info_wrap
      dl.user_info
        dt.label: BirthdaySvg
        dd
          p.txt {{ $t('signup.birthday') }}
          p {{ user.year }} / {{ ('0' + user.month).slice(-2) }} / {{ ('0' + user.day).slice(-2) }}
      dl.user_info
        dt.label: GenderSvg
        dd
          p.txt {{ $t('signup.gender') }}
          p {{ $t('signup.' + user.gender) }}
      dl.user_info
        dt.label: CheckSvg
        dd
          p.txt {{ $t('signup.target') }}
          p.target_list
            span.target_txt(v-for="(category, index) in user.targetCategories" :key="category") {{ $t('signup.target-categories.' + category) }}
              span 、
    button.logout(type="button" @click='doLogout') {{ $t('account.logout') }}

    .edit_wrap(v-if="isEdit")
      .inner
        button.close(type="button" @click="close"): img(src="~assets/images/close.png" alt="" width="25" height="25")
        p.label {{ $t('signup.birthday') }}
        .form_wrap.birthday
          .select_wrap
            select(name="year" v-model="year" v-init:year="user.year" @change="changeForm")
              option(v-for="n in years" :value="n") {{ n }}
          p /
          .select_wrap
            select(name="month" v-model="month" v-init:month="user.month" @change="changeForm")
              option(v-for="n in 12" :value="n") {{ ('0' + n).slice(-2) }}
          p.before_day /
          .select_wrap
            select(name="day" v-model="day" v-init:day="user.day" @change="changeForm")
              option(v-for="n in 31" :value="n") {{ ('0' + n).slice(-2) }}
        p.label {{ $t('signup.gender') }}
        .form_wrap.gender
          input#man(type="radio" name="gender" value="man" v-model="gender" v-init:gender="user.gender" @change="changeForm")
          label(for="man") {{ $t('signup.man') }}
          input#woman(type="radio" name="gender" value="woman" v-model="gender" v-init:gender="user.gender" @change="changeForm")
          label(for="woman") {{ $t('signup.woman') }}
        p.label {{ $t('signup.target') }}
        .form_wrap.target_categories
          label(for="housework")
            input#housework(type="checkbox" name="target_categories" value="housework" v-model="targetCategories" v-init:targetCategories="user.targetCategories" @change="changeForm")
            | {{ $t('signup.target-categories.housework') }}
          label(for="childcare")
            input#childcare(type="checkbox" name="target_categories" value="childcare" v-model="targetCategories" v-init:targetCategories="user.targetCategories" @change="changeForm")
            | {{ $t('signup.target-categories.childcare') }}
          label(for="work")
            input#work(type="checkbox" name="target_categories" value="work" v-model="targetCategories" v-init:targetCategories="user.targetCategories" @change="changeForm")
            | {{ $t('signup.target-categories.work') }}
          label(for="skillup")
            input#skillup(type="checkbox" name="target_categories" value="skillup" v-model="targetCategories" v-init:targetCategories="user.targetCategories" @change="changeForm")
            | {{ $t('signup.target-categories.skillup') }}
          label(for="diet")
            input#diet(type="checkbox" name="target_categories" value="diet" v-model="targetCategories" v-init:targetCategories="user.targetCategories" @change="changeForm")
            | {{ $t('signup.target-categories.diet') }}
          label(for="exercise")
            input#exercise(type="checkbox" name="target_categories" value="exercise" v-model="targetCategories" v-init:targetCategories="user.targetCategories" @change="changeForm")
            | {{ $t('signup.target-categories.exercise') }}
        .submit_wrap
          button(type="submit" @click="signUp(user)" v-bind:disabled="!formDone") {{ $t('signup.register') }}
          .error_wrap(v-if="error") {{ $t('error.' + error) }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import BgAnimation from '@/components/BgAnimation'
import BirthdaySvg from '@/assets/images/birthday.svg?inline'
import GenderSvg from '@/assets/images/gender.svg?inline'
import CheckSvg from '@/assets/images/check_list.svg?inline'
import { db } from '@/plugins/firebase.js'

export default {
  components: {
    Loading,
    BgAnimation,
    BirthdaySvg,
    GenderSvg,
    CheckSvg
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
      gender: '',
      targetCategories: [],
      year: 1970,
      month: 1,
      day: 1,
      formDone: '',
      error: ''
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ]),
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1970 }, (value, index) => 1971 + index)
    }
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
          gender: this.gender,
          targetCategories: this.targetCategories
        })
        await window.location.reload()
      }
    },
    validate () {
      if (!this.year || !this.month || !this.day) {
        this.error = 'empty-birthday'
      } else if (!this.gender) {
        this.error = 'empty-gender'
      } else if (this.targetCategories.length === 0) {
        this.error = 'empty-target-categories'
      } else if (!(this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.day).slice(-2)).match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}(\s-\s[0-9]{4}-[0-9]{2}-[0-9]{2}|\s[0-9]{2}:[0-9]{2})?$/)) {
        this.error = 'invalid-birthday'
      } else if (this.gender === 'man' || this.gender === 'woman') {
        this.error = ''
      } else {
        this.error = 'invalid-gender'
      }
    }
  },
  head () {
    return {
      title: this.$t('title.mypage-account'),
      bodyAttrs: {
        class: 'my_account'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    .my_nav_wrap {
      position: relative;
      padding: 25px 0 30px;
      text-align: center;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      .edit {
        position: absolute;
        right: 15px;
        top: 15px;
        z-index: 6;
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
            background-color: #fff;
          }
        }
        .name {
          margin: 15px 0 8px;
          font-size: 18px;
        }
      }
      .circles {
        z-index: 1;
      }
    }
    .user_info_wrap {
      margin-top: 20px;
      .user_info {
        display: flex;
        align-items: center;
        max-width: 500px;
        width: calc(90% - 30px);
        margin: 10px auto 0;
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
          .target_list .target_txt {
            display: inline-block;
            font-size: 14px;
            margin: 5px 0 5px 0;
          }
          .target_list .target_txt:last-child span {
            display: none;
          }
        }
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
        top: 7%;
        right: 0;
        left: 0;
        width: calc(90% - 40px);
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
          display: flex;
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
          input {
            display: none;
          }
          label {
            line-height: 135%;
            position: relative;
            margin: 0.5rem;
            padding-left: 1.5rem;
            cursor: pointer;
          }
          label::before {
            position: absolute;
            z-index: 1;
            top: 0.25rem;
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
          input:checked + label::before {
            -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
          }
          label::after {
            position: absolute;
            top: 0rem;
            left: -0.125rem;
            width: 1rem;
            height: 1rem;
            content: '';
            border: 2px solid #f2f2f2;
            border-radius: 50%;
            background: #ffffff;
          }
        }
        .target_categories {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 5px 0 8px;
          label {
            width: calc(50% - 1rem);
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
