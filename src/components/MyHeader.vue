<template lang="pug">
  header.my_header
    p.logo: img(src="~assets/images/logo.png" alt="WasTim")
</template>

<script>

</script>

<style lang="scss" scoped>
  .my_header {
    .logo {
      padding: 10px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      img {
        width: 150px;
      }
    }
  }
</style>
