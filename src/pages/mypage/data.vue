<template lang="pug">
  section.container
    div(v-if="user")
      form.search_form_wrap(:action="localePath('mypage-data')" method="GET")
        label.form_wrap: input(type="month" v-model="month" name="month")
        .btn_wrap
          button.search_btn(type="submit" v-bind:disabled="!month") {{ $t('search') }}
      MonthData(v-if="queryMonth" v-bind:argData="dateObj")
      p.search_attention(v-else) {{ $t('search-attention') }}
</template>

<script>
import { mapGetters } from 'vuex'
import MonthData from '@/components/MonthData'

export default {
  components: {
    MonthData
  },
  layout: 'mypage',
  data () {
    return {
      month: '',
      queryMonth: '',
      dateObj: ''
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'uid',
      'user'
    ]),
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 2019 }, (value, index) => 2020 + index)
    }
  },
  mounted () {
    this.queryMonth = this.$route.query.month
    console.log('test', this.$route.query.month)
    if (this.queryMonth) {
      this.month = this.queryMonth
      this.dateObj = new Date(this.queryMonth + '-01')
    }
  },
  head () {
    return {
      title: this.$t('title.mypage-data'),
      bodyAttrs: {
        class: 'data_search'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .search_form_wrap {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    max-width: 900px;
    margin: 0 auto;
    label {
      position: relative;
      display: inline-block;
      width: calc(80% - 23px);
      height: 36px;
      padding: 5px;
      border: 1px solid #cacaca;
      border-radius: 5px;
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
    .btn_wrap {
      width: 20%;
      margin-left: auto;
      text-align: center;
      button {
        width: 100%;
        padding: 13px 5px;
        font-size: 16px;
        color: #fff;
        border-radius: 3px;
        background: linear-gradient(120deg, #f7ca6b, #fda085);
        text-shadow: 3px 2px 10px #f19378;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }
      button:disabled {
        background: #cccccc;
        text-shadow: none;
        pointer-events: none;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
      }
    }
  }
  .search_attention {
    margin-top: 10px;
    padding: 0 15px;
    font-size: 16px;
    line-height: 1.5;
    max-width: 900px;
    margin: 0 auto;
  }
</style>
