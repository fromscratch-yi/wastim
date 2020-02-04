<template lang="pug">
  div
    h3.score_register {{ $t('add-form.title') }}
    .add_contents
      transition-group.transition_wrap(tag="div" :name="transName")
        div.inner#docExist(v-if="docExist" key="docExist")
          p.label_txt {{ $t('add-form.label-exist') }}
          table.form_wrap
            tbody
              tr
                th {{ $t('add-form.confirm-date') }}
                td {{ date.replace('-', ' / ').replace('-', ' / ') }}
              tr(v-for="(category, index) in user.targetCategories")
                th {{ $t('signup.target-categories.' + category) }}
                td
                  span(v-if="!categories[category]") -
                  span(v-if="categories[category]" :class="categories[category]")
                    GoodSvg(v-if="categories[category] == 'good'")
                    SosoSvg(v-else-if="categories[category] == 'soso'")
                    BadSvg(v-else-if="categories[category] == 'bad'")
                    offSvg(v-else-if="categories[category] == 'off'")
                  p(v-if="categories[category]") （{{ categories[category] }}）
              tr
                th {{ $t('add-form.confirm-diary') }}
                td {{ diary }}

        div.inner#date(v-if="!scoreResult && !docExist && step === 1" key="step1")
          p.label_txt {{ $t('add-form.label-date') }}
          label.form_wrap: input(type="date" :max="dateObj.getFullYear() + '-' + ('00' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('00' + dateObj.getDate()).slice(-2)" v-model="date" @change="stepValidate()")

        div.inner.score(v-for="(category, index) in user.targetCategories" :id="category" v-if="!scoreResult && !docExist && step === index + 2" :key="'step' + (index + 2)")
          p.label_txt
            span.c_name {{ $t('signup.target-categories.' + category) }}
            | {{ $t('add-form.label-score') }}
          .form_wrap.score_wrap(:class="category + '_wrap'")
            label(v-for="scoreName in scores" :key="scoreName" v-bind:for="category + '_' +scoreName" v-bind:class="scoreName")
              input(type="radio" :name="category" :id="category + '_' +scoreName" :value="scoreName" v-model="categories[category]" @change="validAndNext()")
              GoodSvg(v-if="scoreName == 'good'")
              SosoSvg(v-else-if="scoreName == 'soso'")
              BadSvg(v-else-if="scoreName == 'bad'")
              p {{ scoreName }}
            label.off(v-if="category === 'work'" v-bind:for="category + '_off'")
              input(type="radio" :name="category" :id="category + '_off'" value="off" v-model="categories[category]" @change="validAndNext()")
              offSvg
              p day off

        div.inner#diary(v-if="!scoreResult && !docExist && step === user.targetCategories.length + 2" :key="'step' + user.targetCategories.length + 2")
          p.label_txt {{ $t('add-form.label-diary') }}
          p.form_wrap
           textarea(name="diary" rows="6" cols="80" maxlength="150" :placeholder="$t('add-form.placeholder')" v-model="diary" @change="stepValidate()")

        div.inner#confirm(v-if="!scoreResult && !docExist && step === user.targetCategories.length + 3" :key="'step' + user.targetCategories.length + 3")
          p.label_txt {{ $t('add-form.label-confirm') }}
          table.form_wrap
            tbody
              tr
                th {{ $t('add-form.confirm-date') }}
                td {{ date.replace('-', ' / ').replace('-', ' / ') }}
              tr(v-for="(category, index) in user.targetCategories")
                th {{ $t('signup.target-categories.' + category) }}
                td
                  span(:class="categories[category]")
                    GoodSvg(v-if="categories[category] == 'good'")
                    SosoSvg(v-else-if="categories[category] == 'soso'")
                    BadSvg(v-else-if="categories[category] == 'bad'")
                    offSvg(v-else-if="categories[category] == 'off'")
                  p （{{ categories[category] }}）
              tr
                th {{ $t('add-form.confirm-diary') }}
                td {{ diary }}

        div.inner#result(v-if="scoreResult" key="result")
          p.label_txt {{ $t('add-form.label-result') }}
          .score_wrap(:class="todayScoreLabel")
            doughnut-chart(:chart-data="chartData" :options="chartOptions" :styles="{height: '150px', position: 'relative'}")
            .data_wrap
              p.date {{ date.replace('-', ' / ').replace('-', ' / ') }}
              p.score_data
                span.my_score {{ todayScore }}
                span.slash /
                span  100
                span.parsent %

      div.button_wrap(v-if="!scoreResult && !docExist")
        button.prev(v-if="step !== 1" type="button" @click="prev")
        button.next(v-if="step !== user.targetCategories.length + 3" type="button" v-bind:disabled="!isNext" @click="next")
        button.submit(v-if="step === user.targetCategories.length + 3" type="submit" v-bind:disabled="!isNext" @click="submit(user)")
      div.button_wrap(v-else-if="!scoreResult")
        button.prev(type="button" @click="updateBack")
        button.next(type="button" @click="update")
      div.close_btn_wrap(v-else)
        button.reload(type="button" @click="reload()") {{ $t('add-form.done') }}
</template>

<script>
import { mapGetters } from 'vuex'
import GoodSvg from '@/assets/images/good.svg?inline'
import BadSvg from '@/assets/images/bad.svg?inline'
import SosoSvg from '@/assets/images/soso.svg?inline'
import offSvg from '@/assets/images/off.svg?inline'
import { db } from '@/plugins/firebase.js'
export default {
  components: {
    GoodSvg,
    BadSvg,
    SosoSvg,
    offSvg
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['argDate'],
  data () {
    return {
      step: 1,
      date: this.argDate,
      dateObj: new Date(),
      diary: '',
      isNext: false,
      transName: 'next',
      scores: ['good', 'soso', 'bad'],
      scoreList: [],
      docExist: false,
      todayScore: 0,
      todayScoreLabel: '',
      scoreResult: false,
      categories: {
        housework: '',
        childcare: '',
        work: '',
        skillup: '',
        diet: '',
        exercise: ''
      },
      chartDataValues: [],
      chartColors: ['#fab777', '#dcdcdc'],
      chartOptions: {
        cutoutPercentage: 75,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    }
  },
  transition: {
    name: 'next'
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ]),
    chartData () {
      return {
        datasets: [
          {
            data: this.chartDataValues,
            backgroundColor: this.chartColors,
            borderWidth: 0
          }
        ]
      }
    }
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
      this.step--
      this.stepValidate()
    },
    next () {
      this.isNext = false
      this.docExist = false
      this.transName = 'next'
      if (this.step === 1) {
        db.collection(this.user.uid + '-daily').doc(this.date).get().then((doc) => {
          if (doc.exists) {
            this.date = doc.data().date
            this.categories = {
              housework: doc.data().housework,
              childcare: doc.data().childcare,
              work: doc.data().work,
              skillup: doc.data().skillup,
              diet: doc.data().diet,
              exercise: doc.data().exercise
            }
            this.diary = doc.data().diary
            this.docExist = true
          } else {
            this.categories = {
              housework: '',
              childcare: '',
              work: '',
              skillup: '',
              diet: '',
              exercise: ''
            }
            this.diary = ''
            this.docExist = false
            this.step++
          }
        }).catch((error) => {
          console.error('Error getting document:', error)
        })
      } else {
        this.step++
      }
      setTimeout(this.stepValidate, 700)
    },
    stepValidate () {
      this.isNext = false
      if (this.step === 1) {
        this.isNext = !!this.date
      } else if (this.step >= 2 && this.step < this.user.targetCategories.length + 2) {
        if (!this.categories[this.user.targetCategories[this.step - 2]]) {
          this.isNext = false
        } else {
          this.isNext = true
        }
      } else if (this.step === this.user.targetCategories.length + 2) {
        this.isNext = true
      } else if (this.step === this.user.targetCategories.length + 3) {
        this.isNext = true
      } else {
        this.isNext = false
        this.step = 1
      }
    },
    getTodayScore () {
      let count = 0
      let total = 0
      for (const key of this.user.targetCategories) {
        if (this.categories[key] && this.categories[key] !== 'off') {
          count++
          switch (this.categories[key]) {
            case 'good':
              total += 2
              break
            case 'soso':
              total += 1
              break
            default:
              break
          }
        }
      }
      const maxScore = count * 2
      const totalScore = Math.round(total / maxScore * 100)
      const graphArray = []
      graphArray.push(totalScore)
      graphArray.push(100 - totalScore)
      this.chartDataValues = graphArray
      if (totalScore >= 80) {
        this.chartColors = ['#ff487c', '#d1d1d1']
        this.todayScoreLabel = 'good'
      } else if (totalScore > 45 && totalScore < 80) {
        this.chartColors = ['#fab777', '#d1d1d1']
        this.todayScoreLabel = 'soso'
      } else {
        this.chartColors = ['#07c8c1', '#d1d1d1']
        this.todayScoreLabel = 'bad'
      }
      this.todayScore = totalScore
    },
    reload () {
      window.location.reload()
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
        const regData = {
          date: this.date,
          housework: this.categories.housework,
          childcare: this.categories.childcare,
          work: this.categories.work,
          skillup: this.categories.skillup,
          diet: this.categories.diet,
          exercise: this.categories.exercise,
          diary: this.diary
        }
        await db.collection(user.uid + '-daily').doc(this.date).set(regData).then(function (docRef) {
          console.log('Document written with ID: ', docRef)
        }).catch(function (error) {
          console.error('Error adding document2: ', error)
        })
        this.scoreResult = true
        this.getTodayScore()
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
        .c_name {
          font-weight: bold;
        }
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
    .score {
      .category {
        margin-bottom: 25px;
      }
      .category:last-child {
        margin: 0;
      }
      .form_wrap {
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        margin: 30px auto 0;
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
        label.off input:checked + svg {
          fill: #3bca26;
          + p {
            color: #3bca26;
            font-weight: bold;
          }
        }
      }
      .form_wrap.work_wrap {
        padding: 0;
      }
    }
    #diary {
      .form_wrap {
        padding: 0 10px;
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
        width: calc(100% - 10px);
        tr {
          border-bottom: 1px solid #d1d1d1;
          th, td {
            padding: 10px 8px;
            text-align: left;
            line-height: 1.5;
          }
          th {
            white-space: nowrap;
            padding-right: 15px;
          }
          td {
            display: flex;
            align-items: center;
            span {
              display: block;
              width: 25px;
              svg {
                max-width: 100%;
                width: 100%;
                margin: 0px 0 -5px;
              }
            }
            span.good svg {
              fill: #ff487c;
            }
            span.soso svg {
              fill: #ff7334;
            }
            span.bad svg {
              fill: #07c8c1;
            }
            span.off svg {
              fill: #3bca26;
            }
          }
        }
      }
    }
    #result {
      .label_txt {
          margin: 0 0 15px;
      }
      .score_wrap {
        position: relative;
        width: calc(100% - 15px);
        margin: 0 auto;
        border-bottom: 2px solid #f8c86d;
        .data_wrap {
          position: absolute;
          left: 50%;
          bottom: 10px;
          transform: translateX(-50%);
          text-align: center;
          p.date {
            font-size: 16px;
          }
          p.score_data {
            margin-top: 10px;
            font-size: 20px;
            .my_score {
              font-weight: bold;
              font-size: 45px;
            }
            .parsent {
              font-size: 12px;
            }
          }
        }
      }
      .score_wrap.good {
        border-bottom: 2px solid #ff487c;
        p.score_data .my_score {
          color: #ff487c;
        }
      }
      .score_wrap.soso {
        border-bottom: 2px solid #f8c86d;
        p.score_data .my_score {
          color: #f8c86d;
        }
      }
      .score_wrap.bad {
        border-bottom: 2px solid #07c8c1;
        p.score_data .my_score {
          color: #07c8c1;
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
  .close_btn_wrap {
    max-width: 450px;
    width: 50%;
    margin: -5px auto 0;
    button {
      width: 100%;
      background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);
      text-shadow: 3px 2px 10px #fb7d82;
      color: #fff;
      font-size: 18px;
      padding: 8px 0;
      border-radius: 20px;
      font-weight: bold;
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
