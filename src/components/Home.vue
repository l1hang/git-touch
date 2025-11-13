<template>
    <div class="home">
    <GridDistortion
      imageSrc="https://picsum.photos/1920/1080"
      :grid="7"
      :mouse="0.2"
      :strength="0.15"
      :relaxation="0.9"
      class-name="custom-class"
    />
    <div class="btn">
      <el-button  type="info" round @click="turnToSocial">个人简介</el-button>
    </div>
  </div>
</template>

<script>
import GridDistortion from './GridDistortion.vue';
export default {
  components: {
    GridDistortion
  },
  data() {
    return {

    }
  },
  created() {},
  mounted() {},
  methods: {
    turnToSocial() {
      this.$router.push('/social');
    }
  }

}
</script>

<style lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 2;
  .btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }
}
</style>
