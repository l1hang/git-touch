<template>
  <div  class="person">
    <Lightning
      :hue="210"
      :x-offset="0"
      :speed="1"
      :intensity="1"
      :size="2"
      class="w-full h-full"
    />
    <div class="text">
      <h1>闪电特效背景</h1>
    </div>
  </div>
</template>

<script>
import Lightning from "./Lightning.vue";
export default {
  name: 'TestMobile',
  components: {
    Lightning
  }
}
</script>

<style scoped lang="scss">
.person {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
    h1 {
      color: rgb(15, 189, 189, 0.8);
      font-size: 2rem;
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
}
</style>
