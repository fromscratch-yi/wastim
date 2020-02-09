<template lang="pug">
  section.page
    header
      .back_link(v-if="user"): nuxt-link(:to="localePath('mypage-setting')")
      .back_link(v-else): nuxt-link(:to="localePath('index')")
      p.logo: img(src="~assets/images/logo-wh.png" alt="WasTim" width="140")
    .contents
      h1 {{ $t('setting.privacy-policy') }}

      div.privacy_policy(v-html="$t('privacy-policy.inner')")

      p.end(v-html="$t('privacy-policy.end')")
      p.update(v-html="$t('privacy-policy.update-date')")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('modules/user', [
      'user'
    ])
  },
  head: {
    bodyAttrs: {
      class: 'privacy_policy'
    }
  }
}
</script>
<style lang="scss" scoped>
header {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  box-shadow: 0 -2px 5px #c7c7c7;
  border-bottom: 2px solid #fbad7d;
  background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  background: -webkit-linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  padding: 10px 15px;
  .back_link {
    position: absolute;
    top: 50%;
    left: 15px;
    margin-top: -10px;
    a {
      display: block;
      width: 12px;
      height: 12px;
      border: 4px solid;
      border-color: #fff #fff transparent transparent;
      -webkit-transform: rotate(-135deg);
      transform: rotate(-135deg);
    }
  }
  .logo {
    text-align: center;
    img {
      width: 110px;
    }
  }
}
.contents {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 15px;
  font-size: 14px;
  line-height: 1.5;
  h1 {
    margin: 10px 0 20px;
    text-align: center;
    font-size: 20px;
    color: #333;
  }
}
</style>
<style lang="scss">
.privacy_policy {
  h2 {
    padding: 0 5px 5px;
    border-bottom: 2px dashed #fbad7d;
    margin: 20px 0 15px;
    font-size: 18px;
    color: #333;
  }
  p, li {
    color: #444;
  }
  h2 + p {
    padding: 0 10px;
  }
  h3 + p {
    padding: 0 15px;
  }
  h3 {
    color: #333;
    font-size: 16px;
    padding: 0 10px;
  }
  ol {
    padding: 0 10px;
    li {
      margin-top: 15px;
      ol {
        margin: 0 15px;
        li {
          list-style: outside decimal;
          margin: 10px 0 0;
        }
      }
    }
  }
  p.end,
  p.update {
    text-align: right;
    margin: 15px 15px 10px 0;
  }
}
</style>
