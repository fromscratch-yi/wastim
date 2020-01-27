import Vue from 'vue'
import { Doughnut, Radar, Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

Vue.component('doughnut-chart', {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})

Vue.component('radar-chart', {
  extends: Radar,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})

Vue.component('line-chart', {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
