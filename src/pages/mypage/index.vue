<template lang="pug">
  section.container
    div(v-if="user")
      div.no_data(v-if="isNoData" v-bind:class="{ active: isNoData }")
        div.no_data_confirm.add_form(v-if="!isFormOpen")
          h3.score_register {{ $t('add-form.title') }}
          div.inner
            p.question_txt(v-html="$t('add-form.yesterday')")
            div.button_wrap
              button.no(type="button" @click="registerNo") {{ $t('add-form.no') }}
              button.yes(type="button" @click="registerYes") {{ $t('add-form.yes') }}
        .add_form(v-else)
          addForm.add_form_inner(v-bind:argDate="yesterday")
          button.close_btn(type="button" @click="registerNo"): img(src="~assets/images/close_wh.png" alt="" width="25" height="25")
        div.add_bg
      MonthData(v-bind:argData="new Date()")
</template>

<script>
import { mapGetters } from 'vuex'
import AddForm from '@/components/AddForm'
import MonthData from '@/components/MonthData'
import GoodSvg from '@/assets/images/good.svg?inline'
import BadSvg from '@/assets/images/bad.svg?inline'
import SosoSvg from '@/assets/images/soso.svg?inline'
import OffSvg from '@/assets/images/off.svg?inline'
import TotalSvg from '@/assets/images/by_total.svg?inline'
import ItemSvg from '@/assets/images/by_item.svg?inline'
import DailySvg from '@/assets/images/by_daily.svg?inline'
import { db } from '@/plugins/firebase.js'
import Meta from '~/assets/mixins/meta'

export default {
  components: {
    AddForm,
    MonthData,
    GoodSvg,
    BadSvg,
    SosoSvg,
    OffSvg,
    TotalSvg,
    ItemSvg,
    DailySvg
  },
  layout: 'mypage',
  mixins: [Meta],
  data () {
    return {
      meta: {
        title: this.$t('title.mypage-top'),
        description: this.$t('mypage-description'),
        type: 'article',
        url: this.$route.fullPath,
        image: 'ogp' + this.$i18n.locale + '.gif',
        lang: this.$i18n.locale
      },
      isNoData: false,
      isFormOpen: false,
      dateObj: new Date()
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ]),
    yesterday () {
      const yeasterday = this.dateObj
      yeasterday.setDate(yeasterday.getDate() - 1)
      return yeasterday.getFullYear() + '-' + ('00' + (yeasterday.getMonth() + 1)).slice(-2) + '-' + ('00' + yeasterday.getDate()).slice(-2)
    }
  },
  async mounted () {
    await db.collection(this.user.uid + '-daily').doc(this.yesterday).get().then((doc) => {
      if (doc.exists) {
        this.isNoData = false
      } else {
        this.isNoData = true
      }
    }).catch((error) => {
      console.error('Error getting document:', error)
    })
  },
  methods: {
    registerNo () {
      this.isNoData = false
    },
    registerYes () {
      this.isFormOpen = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .no_data {
    z-index: 20;
    .add_form {
      position: fixed;
      box-sizing: border-box;
      border-radius: 20px;
      width: 95%;
      max-width: 500px;
      height: 400px;
      max-height: 95%;
      background: #fff;
      color: #333;
      padding: 0 0 35px;
      top: 50%;
      left: 50%;
      transition: bottom 1s;
      z-index: 15;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
    }
    .add_form_inner {
      width: 100%;
      height: 100%;
    }
    .no_data_confirm {
      height: auto;
      padding: 0 0 25px;
      .score_register {
        text-align: center;
        font-size: 20px;
        padding: 20px 0;
        margin: 0 0 30px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        color: #fff;
        text-shadow: 3px 2px 10px #f1834861;
        background: linear-gradient(120deg,#f6d365,#fda085);
        background: -webkit-linear-gradient(120deg,#f6d365,#fda085);
      }
      .inner {
        padding: 0 15px;
        .question_txt {
          margin: 0 0 30px;
          line-height: 1.6;
        }
        .button_wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          button {
            width: 47%;
            padding: 15px 30px;
            text-align: center;
            font-size: 18px;
            border-radius: 50px;
            background: linear-gradient(120deg, #f9d5da, #ffb1ca);
            text-shadow: 3px 2px 10px #e09aab;
            color: #fff;
          }
          button.no {
            background: linear-gradient(120deg, #c1d5f5, #aedcf1);
            text-shadow: 3px 2px 10px #7ba8ec;
          }
        }
      }
    }
    .add_bg {
      display: none;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: -99;
      background: rgba(51, 51, 51, 0.3);
      animation: fadeOut 1s ease 0s 1 normal;
      -webkit-animation: fadeOut 1s ease 0s 1 normal;
    }
    .close_btn {
      display: none;
    }
  }
  .no_data.active {
    .add_bg {
      display: block;
      z-index: 10;
      animation: fadeIn 1s ease 0s 1 normal;
      -webkit-animation: fadeIn 1s ease 0s 1 normal;
    }
    .close_btn {
      display: block;
      width: 25px;
      height: 25px;
      position: absolute;
      top: 5%;
      right: 18px;
    }
  }
  @keyframes fadeIn {
    0% {opacity: 0}
    100% {opacity: 1}
  }

  @-webkit-keyframes fadeIn {
    0% {opacity: 0}
    100% {opacity: 1}
  }
  @keyframes fadeOut {
    100% {opacity: 0}
    0% {opacity: 1}
  }

  @-webkit-keyframes fadeOut {
    100% {opacity: 0}
    100% {opacity: 1}
  }
</style>
