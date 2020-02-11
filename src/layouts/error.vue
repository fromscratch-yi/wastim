<template lang="pug">
  div.error_wrap
    header
      p.logo
        nuxt-link(:to="localePath('index')")
          img(src="~assets/images/logo.png" alt="WasTim" width="140")
    main
      .inner
        h1 {{ error.statusCode }}
        p(v-if="error.statusCode === 404") Not Found
        p(v-else) An error has occurred
        router-link(to="/" class="button is-rounded") Back To Home
      BgAnimation
</template>

<script>
import BgAnimation from '@/components/BgAnimation'
export default {
  components: {
    BgAnimation
  },
  props: ['error']
}
</script>
<style lang="scss" scoped>
.error_wrap {
  height: 100vh;
  header {
    background: #fff;
    box-shadow: 0 -2px 5px #c7c7c7;
    border-bottom: 2px solid #fbad7d;
    padding: 10px 15px;
    p.logo {
      margin: 0 auto;
      width: 120px;
      text-align: center;
    }

  }
  main ul {
    height: 100%;
    background: linear-gradient(135deg,#f6d365,#fda085);
  }
  .inner {
    position: fixed;
    top: 30%;
    left: 50%;
    width: 80%;
    max-width: 400px;
    padding: 40px 20px;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    text-align: center;
    background: #fff;
    border-radius: 20px;
    h1 {
      font-size: 60px;
      margin-bottom: 10px;
      color: #666;
    }
    p {
      font-size: 40px;
      margin-bottom: 20px;
      color: #666;
    }
    a {
      display: block;
      text-decoration: none;
      width: 60%;
      margin: 20px auto 0;
      padding: 20px 30px;
      text-align: center;
      font-size: 18px;
      border-radius: 60px;
      background: linear-gradient(120deg, #fcac7e, #f8c56e);
      box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }
  }
}
</style>
