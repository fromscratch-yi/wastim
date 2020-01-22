<template lang="pug">
  div
    h3.score_register {{ this.$t('add-form.title') }}
    .add_contents
      transition-group.transition_wrap(tag="div" :name="transName")
        div.inner#docExist(v-if="docExist" key="docExist")
          p.label_txt {{ this.$t('add-form.label-exist') }}
          table.form_wrap
            tbody
              tr
                th {{ this.$t('add-form.confirm-date') }}
                td {{ date.replace('-', ' / ').replace('-', ' / ') }}
              tr
                th {{ this.$t('add-form.confirm-score') }}
                td {{ score }}
              tr
                th {{ this.$t('add-form.confirm-reason') }}
                td {{ getReasonName() }}

        div.inner#date(v-else-if="step === 1" key="step1")
          p.label_txt {{ this.$t('add-form.label-date') }}
          label.form_wrap: input(type="date" :max="dateObj.getFullYear() + '-' + dateObj.getMonth() + 1 + '-' + dateObj.getDate()" v-model="date" @change="stepValidate()")

        div.inner#score(v-else-if="step === 2" key="step2")
          p.label_txt {{ date.replace('-', '/').replace('-', '/') + this.$t('add-form.label-score') }}
          .form_wrap
            label(v-for="scoreName in scores" :key="scoreName" v-bind:for="scoreName" v-bind:class="scoreName")
              input(name="score" type="radio" :id="scoreName" :value="scoreName" v-model="score" @change="validAndNext()")
              GoodSvg(v-if="scoreName == 'good'")
              SosoSvg(v-if="scoreName == 'soso'")
              BadSvg(v-if="scoreName == 'bad'")
              p {{ scoreName }}

        div.inner#reason(v-else-if="step === 3" key="step3")
          p.label_txt {{ this.$t('add-form.label-reason') }}
          .form_wrap
            select(name="reason" v-model="reason" @change="validAndNext()")
              option(value="" disabled selected) {{ this.$t('add-form.select-init') }}
              option(v-for="(doc, idx) in scoreList" :key="doc.id" :value="doc.id" v-html="doc.name" :selected="{ 'selected': idx === 0 }")
              option(value="other") {{ this.$t('add-form.other') }}
              optgroup(label="")

        div.inner#detail(v-else-if="step === 4" key="step4")
          p.label_txt {{ this.$t('add-form.label-detail') }}
          p.form_wrap
           textarea(name="reason" rows="3" cols="60" maxlength="50" :placeholder="this.$t('add-form.placeholder')" v-model="detail" @change="stepValidate()")

        div.inner#confirm(v-else-if="step === 5" key="step5")
          p.label_txt {{ this.$t('add-form.label-confirm') }}
          table.form_wrap
            tbody
              tr
                th {{ this.$t('add-form.confirm-date') }}
                td {{ date.replace('-', ' / ').replace('-', ' / ') }}
              tr
                th {{ this.$t('add-form.confirm-score') }}
                td {{ score }}
              tr
                th {{ this.$t('add-form.confirm-reason') }}
                td {{ detail ? detail : getReasonName() }}

      div.button_wrap(v-if="!docExist")
        button.prev(v-if="step !== 1" type="button" @click="prev")
        button.next(v-if="step !== 5" type="button" v-bind:disabled="!isNext" @click="next")
        button.submit(v-if="step === 5" type="submit" v-bind:disabled="!isNext" @click="submit(user)")
      div.button_wrap(v-else)
        button.prev(type="button" @click="updateBack")
        button.next(type="button" @click="update")
</template>

<script>
import { mapGetters } from 'vuex'
import GoodSvg from '@/assets/images/good.svg?inline'
import BadSvg from '@/assets/images/bad.svg?inline'
import SosoSvg from '@/assets/images/soso.svg?inline'
import { db } from '@/plugins/firebase.js'
export default {
  components: {
    GoodSvg,
    BadSvg,
    SosoSvg
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['argDate'],
  data () {
    return {
      step: 1,
      date: this.argDate,
      dateObj: new Date(),
      score: '',
      reason: '',
      detail: '',
      isNext: false,
      transName: 'next',
      scores: ['good', 'soso', 'bad'],
      scoreList: [],
      docExist: false,
      reasonName: ''
    }
  },
  transition: {
    name: 'next'
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ])
  },
  created () {
    this.stepValidate()
  },
  methods: {
    validAndNext () {
      this.isNext = false
      setTimeout(this.next, 300)
    },
    update () {
      this.docExist = false
      this.step++
    },
    updateBack () {
      this.transName = 'prev'
      this.docExist = false
    },
    prev () {
      this.isNext = false
      this.transName = 'prev'
      if (this.step === 5 && this.reason !== 'other') {
        this.step -= 2
      } else {
        this.step--
      }
      this.stepValidate()
    },
    next () {
      this.isNext = false
      this.docExist = false
      this.transName = 'next'
      if (this.step === 1) {
        db.collection('daily').doc(this.user.uid).collection('report').doc(this.date).get().then((doc) => {
          if (doc.exists) {
            this.date = doc.data().date
            this.score = doc.data().score
            this.reason = doc.data().reason
            this.docExist = true
          } else {
            this.score = ''
            this.reason = ''
            this.docExist = false
            this.step++
          }
        }).catch((error) => {
          console.error('Error getting document:', error)
        })
      } else if (this.step === 3 && this.reason !== 'other') {
        this.step += 2
      } else {
        if (this.step === 2) {
          this.reason = ''
          this.getScoreList()
        }
        this.step++
      }
      setTimeout(this.stepValidate, 700)
    },
    stepValidate () {
      this.isNext = false
      if (this.step !== 4 && this.step !== 5 && this.reason === 'other') {
        this.detail = ''
      }
      switch (this.step) {
        case 1:
          this.isNext = !!this.date
          break
        case 2:
          this.isNext = !!this.score
          break
        case 3:
          if (this.reason !== 'other') {
            this.detail = ''
          }
          this.isNext = !!this.reason
          break
        case 4:
          this.isNext = !!this.detail
          break
        case 5:
          this.isNext = this.date && this.score && this.reason && (this.reason !== 'other' || (this.reason === 'other' && this.detail))
          break
        default:
          this.isNext = false
          break
      }
    },
    getReasonName () {
      db.collection('users').doc(this.user.uid).collection(this.score).doc(this.reason).get().then((doc) => {
        if (doc.exists) {
          this.reasonName = doc.data().name
        }
      })
      return this.reasonName
    },
    async getScoreList () {
      this.scoreList = []
      await db.collection('users').doc(this.user.uid).collection(this.score).where('dispFlg', '==', true).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.scoreList.push({
              id: doc.id,
              name: doc.data().name
            })
          })
        })
    },
    async submit (user) {
      if (window.confirm(this.$t('add-form.confirm'))) {
        if (this.detail) {
          await db.collection('users').doc(user.uid).collection(this.score).add({
            name: this.detail,
            dispFlg: true
          }).then((docRef) => {
            console.log('Document written with ID: ', docRef.id)
            this.reason = docRef.id
          }).catch(function (error) {
            console.error('Error adding document1: ', error)
          })
        }
        await db.collection('daily').doc(user.uid).collection('report').doc(this.date).set({
          date: this.date,
          score: this.score,
          reason: this.reason
        }).then(function (docRef) {
          console.log('Document written with ID: ', docRef)
        }).catch(function (error) {
          console.error('Error adding document2: ', error)
        })
        await window.location.reload()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .score_register {
    text-align: center;
    font-size: 20px;
    padding: 20px 0;
    margin: 0 0 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    color: #fff;
    text-shadow: 3px 2px 10px #f1834861;
    background: linear-gradient(120deg,#f6d365,#fda085);
    background: -webkit-linear-gradient(120deg,#f6d365,#fda085);
  }
  .add_contents {
    padding: 0 15px;
    height: calc(100% - 115px);
  }
  .transition_wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .inner {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      .label_txt,
      .form_wrap {
        max-width: 450px;
        margin: 0 auto;
        text-align: left;
      }
      .label_txt {
        position: relative;
        padding-left: 20px;
        line-height: 1.5;
        font-size: 15px;
      }
      .label_txt::before {
        content: "";
        display: block;
        position: absolute;
        background: linear-gradient(120deg,#f6d365,#fda085);
        background: -webkit-linear-gradient(120deg,#f6d365,#fda085);
        width: 10px;
        height: 10px;
        top: 50%;
        left: 3px;
        margin-top: -5px;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
      }
      .form_wrap {
        margin: 15px auto 0;
      }
    }
    #date {
      label {
        position: relative;
        display: inline-block;
        width: calc(100% - 10px);
        height: 36px;
        padding: 5px;
        border-bottom: 1px solid #cacaca;
        input {
          position: relative;
          width: 100%;
          height: 36px;
          border: 0;
          background: transparent;
          box-sizing: border-box;
          font-size: 18px;
          -webkit-appearance: none;
          -ms-appearance: none;
          -moz-appearance: none;
          appearance: none;
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
    #score {
      .form_wrap {
        display: flex;
        justify-content: space-between;
        label {
          display: block;
          cursor: pointer;
          max-width: 60px;
          width: calc(100% / 3 - 10px);
          text-align: center;
          input {
            display: none;
          }
          svg {
            width: 100%;
            fill: #d1d1d1;
            transition: all  0.5s ease;
            + p {
              margin: 3px 0 0;
              font-size: 13px;
              transition: all  0.5s ease;
            }
          }
        }
        label.good input:checked + svg {
          fill: #ff487c;
          + p {
            color: #ff487c;
            font-weight: bold;
          }
        }
        label.soso input:checked + svg {
          fill: #ff7334;
          + p {
            color: #ff7334;
            font-weight: bold;
          }
        }
        label.bad input:checked + svg {
          fill: #07c8c1;
          + p {
            color: #07c8c1;
            font-weight: bold;
          }
        }
      }
    }
    #reason {
      .form_wrap {
        position: relative;
        width: 100%;
        select {
          width: 100%;
          background: #fff;
          padding: 5px 20px 5px 5px;
          border: 1px solid #d1d1d1;
          border-radius: 3px;
          font: 400 11px system-ui;
          font-size: 16px;
          -webkit-appearance: none;
          -ms-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
      }
      .form_wrap::after {
          position: absolute;
          content: '';
          top: 50%;
          right: 5px;
          z-index: 3;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          border-top: 7px solid #fda085;
          border-right: 5px solid transparent;
          border-left: 5px solid transparent;
          pointer-events: none;
      }

    }
    #detail {
      .form_wrap {
        textarea {
          padding: 5px;
          overflow: auto;
          border-radius: 3px;
          width: calc(100% - 14px);
          resize: none;
          -webkit-box-shadow: none;
          box-shadow: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          line-height: 1.5;
          border: 1px solid #d1d1d1;
          background: #fff;
          font-size: 16px;
        }
      }
    }
    #confirm, #docExist {
      table {
        width: 100%;
        tr {
          border-bottom: 1px solid #d1d1d1;
          th, td {
            padding: 10px 8px;
            text-align: left;
            line-height: 1.5;
          }
          th {
            white-space: nowrap;
          }
        }
      }
    }
  }
  .button_wrap {
    display: flex;
    max-width: 450px;
    margin: 15px auto 0;
    button {
      content: "";
      display: block;
      position: relative;
      width: 40px;
      height: 30px;
      border-radius: 20px;
      background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);
      text-shadow: 3px 2px 10px #ff9a9e;
      transition: all  0.5s ease;
    }
    button.submit {
      background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
      text-shadow: 3px 2px 10px #43e97b;
    }
    button::after {
      content: "";
      display: block;
      position: absolute;
      border-left: 3px solid #fff;
      border-bottom: 3px solid #fff;
    }
    button.next::after,
    button.prev::after {
      width: 7px;
      height: 7px;
      top: 50%;
      left: 50%;
    }
    button.next::after {
      -webkit-transform: translateY(-50%) translateX(-60%) rotate(-135deg);
      transform: translateY(-50%) translateX(-60%) rotate(-135deg);
    }
    button.prev::after {
      -webkit-transform: translateY(-50%) translateX(-40%) rotate(45deg);
      transform: translateY(-50%) translateX(-40%) rotate(45deg);
    }
    button.submit::after{
      width: 12px;
      height: 7px;
      -webkit-transform: translateY(-70%) translateX(80%) rotate(-45deg);
      transform: translateY(-70%) translateX(80%) rotate(-45deg);
    }
    button:disabled {
      background: #cccccc;
      background-image: linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%);
      text-shadow: none;
      pointer-events: none;
      transition: all  0.5s ease;
    }
    .prev {
      font-size: 18px;
    }
    .next,
    .submit {
      margin-left: auto;
    }
  }
  .v-enter-active {
    transition: opacity 1s;
  }
  .v-enter {
    opacity: 0;
  }
  .next-enter-active, .next-leave-active,
  .prev-enter-active, .prev-leave-active  {
    transition: all .8s ease-out;
  }
  .next-enter {
    transform: translateX(120%);
  }
  .next-enter-to {
    transform: translateX(0);
  }
  .next-leave {
    transform: translateX(0);
  }
  .next-leave-to {
    transform: translateX(-120%);
  }
  .prev-enter {
    transform: translateX(-120%);
  }
  .prev-enter-to {
    transform: translateX(0);
  }
  .prev-leave {
    transform: translateX(0);
  }
  .prev-leave-to {
    transform: translateX(120%);
  }
</style>
