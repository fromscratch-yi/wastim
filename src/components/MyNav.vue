<template lang="pug">
  nav.my_nav_wrap
    ul.navigation
      li: nuxt-link(:to="localePath('mypage')")
        TopSvg
        //- span Top
      li: nuxt-link(:to="localePath('mypage-data')")
        DataSvg
        //- span Data
      li.add_btn
        input#add_check(type="checkbox")
        label(for="add_check"): span ＋
        div.add_form
          ul
            li テスト
            li テスト
            li テスト
            li テスト
      li: nuxt-link(:to="localePath('mypage-account')")
        AccountSvg
        //- span Account
      li: nuxt-link(:to="localePath('mypage-setting')")
        SettingSvg
        //- span Setting
</template>

<script>
import TopSvg from '@/assets/images/top.svg?inline'
import DataSvg from '@/assets/images/data.svg?inline'
import AccountSvg from '@/assets/images/account.svg?inline'
import SettingSvg from '@/assets/images/setting.svg?inline'
export default {
  components: {
    TopSvg,
    DataSvg,
    AccountSvg,
    SettingSvg
  }
}
</script>

<style lang="scss" scoped>
  .my_nav_wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    z-index: 8;
    ul.navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 -2px 10px #c7c7c7;
      li {
        width: calc(100% / 5.5);
        text-align: center;
        a, a:visited, a:link {
          color: rgb(3, 168, 58);
          text-decoration: none;
        }
        a {
          display: block;
          padding: 10px 5px;
          text-align: center;
          font-size: 13px;
          transition: all  0.5s ease;
          svg {
            max-width: 100%;
            width: 25px !important;
            height: auto !important;
            transition: all  0.5s ease;
            fill: #f6d365;
          }
          span {
            display: block;
            margin-top: 3px;
            font-size: 11px;
          }
        }
        a.nuxt-link-exact-active {
          background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
          pointer-events: none;
          color: #333;
          svg {
            fill: #fff;
          }
        }
      }
      li.add_btn {
        position: relative;
        width: calc(100% - ((100% / 5.5) * 4));
        label {
          position: absolute;
          top: -40px;
          left: 50%;
          -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
          cursor: pointer;
          margin: auto;
          border-radius: 50%;
          background: #fda085;
          padding: 8px;
          z-index: 10;
          box-shadow: 0 -2px 10px #c7c7c7;
          transition: all  0.5s ease;
          span {
            display:inline-block;
            transition: all 1.5s ease;
            font-weight: bold;
            line-height: 40px;
            color: #fff;
            font-size: 40px;
          }
        }
        #add_check {
          display: none;
        }
        #add_check:checked+label {
          box-shadow: none;
          background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
          span {
            transform:rotateZ(135deg);
          }
        }
        #add_check:checked+label+.add_form {
          bottom: 0%;
        }
        .add_form {
          position: fixed;
          box-sizing: border-box;
          box-shadow: 0 -2px 10px #c7c7c7;
          width: 100%;
          height: 100%;
          background: #fff;
          color: #fff;
          padding: 20px;
          bottom: -110%;
          left: 0;
          right: 0;
          transition: bottom 1s;
        }
      }
      li:last-child {
        border-right: none;
      }
    }
  }
</style>
