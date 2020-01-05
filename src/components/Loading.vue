<template lang="pug">
  .loading_wrap
    .loading
      .circle.circle1
      .circle.circle2
</template>

<style lang="scss" scoped>
.loading_wrap {
  background: #fff;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10;
}
.loading, .loading * {
  box-sizing: border-box;
}
.loading {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 10;
  .circle {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: calc(60px / 10) solid transparent;
  }
  .circle.circle1 {
    border-top-color: #f6d365;
    animation: loading-animation 1s infinite;
  }
  .circle.circle2 {
    border-bottom-color: #fda085;
    animation: loading-animation 1s infinite alternate;
  }
}
@keyframes loading-animation {
  0% {
    transform: rotate(0deg);

  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
