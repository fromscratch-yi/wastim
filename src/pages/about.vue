<template lang="pug">
  .container
    header
      p.logo
        nuxt-link(:to="localePath('index')"): img(src="~assets/images/logo.png" alt="WasTim" width="100")
      div.locale_wrap
        p: nuxt-link(:to="switchLocalePath('en')") EN
        p: nuxt-link(:to="switchLocalePath('ja')") JA
    .mv_wrap
      h1: img(src="~assets/images/logo-wh.png" alt="Wastim" width="140")
      p 日々の達成度を簡単記録。<br>意識改革をサポートする自己啓発アプリ。
      BgAnimation
    h2
      CanSvg
      span WasTimにできること
    ul.can_list
      li
        h3 3段階評価
        p.icon_wrap: EvaluationSvg
        p 自分にあった対象項目に対し、日々の達成度を「Good」「SoSo」「Bad」の3段階で簡単に評価できます。
      li
        h3 フィードバック
        p.icon_wrap: FeadbackSvg
        p 任意でその日の一言日記を入力でき、一日の振り返りや、メモとして活用可能です。
      li
        h3 達成度を分析
        p.icon_wrap: AnalyzeSvg
        p 今月の現時点での達成度分析から、過去、日別、月別、項目別など様々な分析が可能です。
      li
        h3 意識改革
        p.icon_wrap: GrowUpSvg
        p その日の登録後の達成度や、現在時点の平均達成度、また項目別の達成度の見える化による気づき・意識改革のきっかけ作りになります。
    h2
      HowSvg
      span WasTimの使い方
    .tutorial
      client-only
        swiper(:options="swiperOption")
          swiper-slide
            .slide_inner_wrap
              p.slide_txt: span まず、Googleアカウント、<br>またはFacebookアカウントで<br>簡単登録＆ログイン。
              p.img_wrap
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step1_ja.png" alt="")
                img(v-else src="~assets/images/step1_en.png" alt="")
          swiper-slide
            .slide_inner_wrap
              p.slide_txt: span アカウント情報と、<br>自分に合った評価項目を登録。
              p.img_wrap
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step2_ja.png" alt="")
                img(v-else src="~assets/images/step2_en.png" alt="")
          swiper-slide
            .slide_inner_wrap
              p.slide_txt: span ホームに追加することで、<br>簡単アクセス・操作性UP。
              p.img_wrap
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step3_ja.png" alt="")
                img(v-else src="~assets/images/step3_en.png" alt="")
          swiper-slide
            .slide_inner_wrap
              p.slide_txt: span シンプルな評価で、<br>その日の達成度を迷わず登録。
              p.img_wrap
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step4_ja.png" alt="")
                img(v-else src="~assets/images/step4_en.png" alt="")
          swiper-slide
            .slide_inner_wrap
              p.slide_txt: span １日の達成度を数値化し、<br>意識改革。
              p.img_wrap
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step5_ja.png" alt="")
                img(v-else src="~assets/images/step5_en.png" alt="")
          swiper-slide
            .slide_inner_wrap
              p.slide_txt: span 月ごとの総合評価と、<br>項目別・日別分析。
              p.img_wrap
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step6_ja.png" alt="")
                img(v-else src="~assets/images/step6_en.png" alt="")
          swiper-slide(v-if="!user")
            .slide_inner_wrap
              p.slide_txt: span 簡単＆無料登録でアプリ開始!
              p.img_wrap.last
                nuxt-link(:to="localePath('index')") ログイン画面へ
                img(v-if="$i18n.locale == 'ja'" src="~assets/images/step7_ja.png" alt="")
                img(v-else src="~assets/images/step7_en.png" alt="")
          .swiper-pagination(slot="pagination")
          .swiper-button-prev(slot="button-prev")
          .swiper-button-next(slot="button-next")
</template>

<script>
import { mapGetters } from 'vuex'
import BgAnimation from '@/components/BgAnimation'
import EvaluationSvg from '@/assets/images/evaluation.svg?inline'
import FeadbackSvg from '@/assets/images/feadback.svg?inline'
import AnalyzeSvg from '@/assets/images/analyze.svg?inline'
import GrowUpSvg from '@/assets/images/growup.svg?inline'
import CanSvg from '@/assets/images/can_icon.svg?inline'
import HowSvg from '@/assets/images/how_icon.svg?inline'
export default {
  components: {
    BgAnimation,
    EvaluationSvg,
    FeadbackSvg,
    AnalyzeSvg,
    GrowUpSvg,
    CanSvg,
    HowSvg
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  computed: {
    ...mapGetters('modules/user', [
      'user'
    ])
  }
}
</script>
<style lang="scss">
$pc: 1024px; // PC
$tab: 767px; // タブレット
$sp: 480px;  // スマホ

@mixin pc {
  @media (max-width: ($pc)) {
    @content;
  }
}
@mixin tab {
  @media (max-width: ($tab)) {
    @content;
  }
}
@mixin sp {
  @media (max-width: ($sp)) {
    @content;
  }
}
header {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  box-shadow: 0 -2px 5px #c7c7c7;
  display: flex;
  align-items: center;
  padding: 10px;
  background: #fff;
  border-bottom: 3px solid #fba880;
  .logo {
    max-width: 50%;
    width: 100px;
  }
  .locale_wrap {
    display: flex;
    margin: 0 0 0 auto;
    width: 110px;
    p {
      width: 100%;
      text-align: center;
      a {
        display: block;
        padding: 8px 5px;
        background: #fff;
        border: 2px solid #fda085;
        text-decoration: none;
        font-weight: bold;
        color: #fff;
        font-size: 13px;
      }
      a:link, a:visited {
        color: #fda085;
      }
      a.nuxt-link-exact-active {
        background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
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
}
.mv_wrap {
  position: relative;
  padding: 70px 20px 65px;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  z-index: -1;
  margin-bottom: 20px;
  h1 {
    max-width: 335px;
    width: 100%;
    margin: 0 auto;
    font-size: 50px;
    text-align: center;
    img {
      -webkit-filter: drop-shadow(0px 3px 10px rgba(224, 136, 92, 0.8));
      filter: drop-shadow(0px 0px 10px rgba(224, 136, 92, 0.8));
    }
  }
  p {
    max-width: 335px;
    color: rgb(73, 73, 73);
    -webkit-filter: drop-shadow(0px 3px 10px rgba(224, 136, 92, 0.8));
    filter: drop-shadow(0px 0px 10px rgba(224, 136, 92, 0.8));
    margin: 15px auto 0;
    padding-left: 10px;
    line-height: 1.5;
    font-size: 16px;
  }
}
h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: center;
  max-width: 600px;
  width: calc(90% - 30px);
  margin: 0 auto;
  font-weight: 400;
  text-align: center;
  padding: 20px 15px 10px;
  border-bottom: 2px dashed #ffc551;
  svg {
    width: 30px;
    padding-right: 10px;
    fill: #ffc551;
  }
  span {
    font-size: 22px;
  }
}
.can_list {
  display: flex;
  flex-wrap: wrap;
  align-items: top;
  li {
    width: calc(100% / 4 - 30px);
    padding: 20px 15px;
    @include tab {
      width: calc(100% / 2 - 40px);
      padding: 20px 20px 25px;
    };
    @include sp {
      width: calc(100% - 50px);
      padding: 20px 40px 30px;
    };
    text-align: center;
    min-width: 130px;
    font-size: 14px;
    line-height: 1.5;
    list-style: none;
    .icon_wrap {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      box-shadow: 0px 3px 10px rgba(0,0,0,.2);
      margin: 13px auto;
      text-align: center;
      svg {
        position: absolute;
        width: 55% !important;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        fill: #fda085;
      }
    }
    p {
      text-align: left;
      font-size: 14px;
    }
  }
}
.tutorial {
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  .swiper-container {
    height: 490px;
    width: 100%;
    .swiper-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      transition-property: -webkit-transform;
      transition-property: transform;
      transition-property: transform,-webkit-transform;
      box-sizing: content-box;
      .swiper-slide {
        position: relative;
        flex-shrink: 0;
        text-align: center;
        font-size: 16px;
        line-height: 1.5;
        font-weight: bold;
        // background-color: rgb(248, 248, 248);
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        display: flex;
        .slide_inner_wrap {
          position: relative;
          width: calc(100% - 30px);
          height: calc(100% - 40px);
          max-width: 400px;
          margin: 0 auto;
          padding: 20px 15px;
          p.slide_txt {
            position: relative;
            width: 100%;
            height: 85px;
            text-align: center;
            margin-bottom: 20px;
            color: #fff;
            text-shadow: 2px 2px 10px #ffac4b;
            span {
              width: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translateY(-50%) translateX(-50%);
              font-size: 18px;
            }
          }
          .img_wrap {
            position: absolute;
            width: 100%;
            top: 125px;
            right: 50%;
            margin-right: -50%;
            text-align: center;
            img {
              width: 250px;
            }
            a {
              display: block;
              text-decoration: none;
              width: 60%;
              margin: 0 auto 20px;
              padding: 15px 30px;
              text-align: center;
              font-size: 18px;
              border-radius: 60px;
              background: linear-gradient(120deg, #fcaa80, #ff9171);
              text-shadow: 3px 2px 10px #f18348;
              box-shadow: 0px 5px 15px rgba(154, 133, 108, 0.45);
              color: #fff;
            }
          }
          .img_wrap.last {
            top: 100px;
          }
        }
      }
    }
    .swiper-button-next, .swiper-button-prev {
      position: absolute;
      top: 50%;
      width: 20px;
      height: 22px;
      margin-top: -11px;
      z-index: 1;
      cursor: pointer;
      background-size: 20px 22px;
      background-position: 50%;
      background-repeat: no-repeat;
    }
    .swiper-button-next, .swiper-container-rtl .swiper-button-prev {
      width: 15px;
      height: 15px;
      border: 4px solid;
      border-color: #fff #fff transparent transparent;
      transform: rotate(45deg);
      right: 15px;
      left: auto;
    }
    .swiper-button-prev, .swiper-container-rtl .swiper-button-next {
        width: 15px;
        height: 15px;
        border: 4px solid;
        border-color:  transparent transparent #fff #fff;
        transform: rotate(45deg);
        left: 15px;
        right: auto;
    }
    .swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {
      opacity: 0;
      cursor: auto;
      pointer-events: none;
    }
    .swiper-pagination-progressbar {
      position: absolute;
      text-align: center;
      transition: opacity .3s;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      z-index: 3;
      width: 100%;
      height: 4px;
      left: 0;
      top: 0;
      background: rgb(206, 206, 206);
      .swiper-pagination-progressbar-fill {
        background: #fab07b;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        -webkit-transform: scale(0);
        transform: scale(0);
        -webkit-transform-origin: left top;
        transform-origin: left top
      }
    }
  }
}
</style>
