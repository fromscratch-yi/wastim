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

      ul.tab_list
        li(@click="changeTab('total')" :class="{'active': isActive === 'total'}") 総合
        li(@click="changeTab('taget_detail')" :class="{'active': isActive === 'taget_detail'}") 項目別
        li(@click="changeTab('date_detail')" :class="{'active': isActive === 'date_detail'}") 詳細
      .tab_inner_wrap
        .tab_inner#total(v-if="isActive === 'total'")
          .score_wrap(:class="todayScoreLabel")
            doughnut-chart.chart(:chart-data="doughnutChart" :options="doughnutOptions" :styles="{height: '150px', position: 'relative'}")
            .data_wrap
              p.date {{ dateObj.getFullYear() + ' / ' + dateObj.getMonth() + 1. }}
              p.score_data
                span.my_score {{ totalScore }}
                span.slash /
                span  100
                span.parsent %
        .tab_inner#taget_detail(v-if="isActive === 'taget_detail'")
          .radar_wrap
            radar-chart.chart(:chart-data="radarChart" :options="radarOptions" :styles="{height: '250px', position: 'relative'}")
            table.target_tbl
              tbody
                tr(v-for="(category, index) in user.targetCategories")
                  th {{ $t('signup.target-categories.' + category) }}
                  td(:class="getScoreLevel(radarDataValues[index])")
                    div(v-if="radarDataValues[index] || radarDataValues[index] === 0")
                      span.icon
                        GoodSvg(v-if="getScoreLevel(radarDataValues[index]) == 'good'")
                        SosoSvg(v-else-if="getScoreLevel(radarDataValues[index]) == 'soso'")
                        BadSvg(v-else-if="getScoreLevel(radarDataValues[index]) == 'bad'")
                        offSvg(v-else-if="getScoreLevel(radarDataValues[index]) == 'off'")
                      span.score {{ radarDataValues[index] }}
                      span.parsent %
                    span(v-else) {{ $t('no-data') }}

        .tab_inner#date_detail(v-if="isActive === 'date_detail'")
          line-chart.chart(:chart-data="lineChart" :options="lineOptions" :styles="{height: '250px', position: 'relative'}")
</template>

<script>
import { mapGetters } from 'vuex'
import AddForm from '@/components/AddForm'
import GoodSvg from '@/assets/images/good.svg?inline'
import BadSvg from '@/assets/images/bad.svg?inline'
import SosoSvg from '@/assets/images/soso.svg?inline'
import { db } from '@/plugins/firebase.js'

export default {
  components: {
    AddForm,
    GoodSvg,
    BadSvg,
    SosoSvg
  },
  layout: 'mypage',
  data () {
    return {
      isNoData: false,
      isFormOpen: false,
      dateObj: new Date(),
      totalScore: 0,
      monthData: [],
      targetCategories: [],
      categoryScores: {},
      isActive: 'total',
      todayScoreLabel: '',
      doughnutDataValues: [],
      radarDataValues: [],
      lineDataValues: [],
      lineDataList: {},
      chartColors: ['#facf59', '#c1c1c1'],
      chartLabels: ['#facf59', '#c1c1c1'],
      doughnutOptions: {
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
      },
      radarOptions: {
        maintainAspectRatio: false,
        scale: {
          ticks: {
            suggestedMin: 0,
            stepSize: 10
          }
        },
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
      },
      lineOptions: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              suggestedMax: 2,
              suggestedMin: 0,
              stepSize: 1,
              callback (value, index, values) {
                let label = ''
                switch (value) {
                  case 2:
                    label = 'Good'
                    break
                  case 1:
                    label = 'SoSo'
                    break
                  case 0:
                    label = 'Bad'
                    break
                  default:
                    break
                }
                return label
              }
            }
          }]
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        },
        legend: {
          display: true
        },
        tooltips: {
          callbacks: {
            label (tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || ''
              if (label) {
                label += ': '
              }
              switch (tooltipItem.yLabel) {
                case 2:
                  label += 'Good'
                  break
                case 1:
                  label += 'SoSo'
                  break
                case 0:
                  label += 'Bad'
                  break
                default:
                  break
              }
              return label
            }
          }
        }
      }
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
      return yeasterday.getFullYear() + '-' + yeasterday.getMonth() + 1 + '-' + yeasterday.getDate()
    },
    doughnutChart () {
      return {
        datasets: [
          {
            data: this.doughnutDataValues,
            backgroundColor: this.chartColors,
            borderWidth: 0
          }
        ],
        labels: this.chartLabels
      }
    },
    radarChart () {
      return {
        datasets: [
          {
            data: this.radarDataValues,
            backgroundColor: 'rgba(252, 168, 128, 0.5)',
            borderColor: '#fca880',
            borderWidth: 1
          }
        ],
        labels: this.targetCategories
      }
    },
    lineChart () {
      return this.lineDataList
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

    await db.collection(this.user.uid + '-daily').where('date', '>=', this.getThisMonthStart()).where('date', '<=', this.getThisMonthEnd()).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let count = 0
        let total = 0
        for (const key of this.user.targetCategories) {
          if (key in doc.data()) {
            if (doc.data()[key] && doc.data()[key] !== 'off') {
              if (!this.categoryScores[key]) {
                this.categoryScores[key] = {
                  count: 1,
                  score: 0
                }
              } else {
                this.categoryScores[key].count += 1
              }
              count++
              switch (doc.data()[key]) {
                case 'good':
                  total += 2
                  this.categoryScores[key].score += 2
                  break
                case 'soso':
                  total += 1
                  this.categoryScores[key].score += 1
                  break
                default:
                  break
              }
            }
          }
        }
        const maxScore = count * 2
        const totalScore = Math.round(total / maxScore * 100)
        const monthData = doc.data()
        this.totalScore += totalScore
        monthData.totalScore = totalScore
        this.monthData.push(monthData)
      })
    })
    console.log(this.categoryScores)
    console.log(this.monthData)
    this.totalScore = Math.round(this.totalScore / this.monthData.length)
    this.doughnutData()
    this.radarData()
    this.lineData()
  },
  methods: {
    getThisMonthStart () {
      return this.dateObj.getFullYear() + '-' + this.dateObj.getMonth() + 1 + '-1'
    },
    getThisMonthEnd () {
      const endDateObj = new Date(this.dateObj.getFullYear(), this.dateObj.getMonth() + 1, 0)
      return endDateObj.getFullYear() + '-' + (endDateObj.getMonth() + 1) + '-' + endDateObj.getDate()
    },
    registerNo () {
      this.isNoData = false
    },
    registerYes () {
      this.isFormOpen = true
    },
    changeTab (keyword) {
      this.isActive = keyword
    },
    doughnutData () {
      const data = []
      data.push(this.totalScore)
      data.push(100 - this.totalScore)
      this.doughnutDataValues = data
      if (this.totalScore >= 80) {
        this.chartColors = ['#ff487c', '#d1d1d1']
        this.todayScoreLabel = 'good'
      } else if (this.totalScore > 45 && this.totalScore < 80) {
        this.chartColors = ['#fab777', '#d1d1d1']
        this.todayScoreLabel = 'soso'
      } else {
        this.chartColors = ['#07c8c1', '#d1d1d1']
        this.todayScoreLabel = 'bad'
      }
    },
    radarData () {
      const dataList = []
      for (const category of this.user.targetCategories) {
        this.targetCategories.push(this.$t('signup.target-categories.' + category))
        if (this.categoryScores[category]) {
          dataList.push(Math.round(this.categoryScores[category].score / (this.categoryScores[category].count * 2) * 100))
        } else {
          dataList.push(null)
        }
      }
      this.radarDataValues = dataList
    },
    lineData () {
      this.lineDataList = {
        labels: ['8/1', '8/2', '8/3', '8/4', '8/5', '8/6', '8/7'],
        datasets: [
          {
            label: '育児',
            data: [1, 2, 2, 0, 1, 0, 0, 1],
            borderWidth: 2,
            borderColor: 'rgba(255,0,0,1)',
            backgroundColor: 'rgba(0,0,0,0)'
          },
          {
            label: '仕事',
            data: [2, 2, 0, 0, null, 2, 2, 1],
            borderWidth: 2,
            borderColor: 'rgba(0,0,255,1)',
            backgroundColor: 'rgba(0,0,0,0)'
          }
        ]
      }
    },
    getScoreLevel (score) {
      console.log(score)
      let scoreLabel = ''
      if (score >= 80) {
        scoreLabel = 'good'
      } else if (score > 45 && score < 80) {
        scoreLabel = 'soso'
      } else {
        scoreLabel = 'bad'
      }
      return scoreLabel
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

  .tab_inner_wrap {
    .tab_inner {
      padding: 20px 15px;
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
      .radar_wrap {
        .target_tbl {
          width: calc(100% - 15px);
          max-width: 800px;
          margin: 20px auto 0;
          tr {
            border-bottom: 1px solid #d1d1d1;
            th, td {
              padding: 8px 8px 3px;
              text-align: left;
              line-height: 1.5;
            }
            th {
              white-space: nowrap;
              padding-right: 15px;
            }
            td div {
              display: flex;
              align-items: center;
              span.icon {
                display: block;
                width: 25px;
                margin-right: 10px;
                svg {
                  max-width: 100%;
                  width: 100%;
                  margin: 0px 0 -5px;
                }
              }
              span.score {
                font-size: 20px;
              }
              span.parsent {
                margin: 3px 0 0 3px;
              }
            }
            td.good svg {
              fill: #ff487c;
            }
            td.soso svg {
              fill: #ff7334;
            }
            td.bad svg {
              fill: #07c8c1;
            }
          }
        }
      }
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
