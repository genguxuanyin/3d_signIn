<template>
  <div class="home">
    <div class="threeContainer">
      <ModelSVG :cameraPosition="cameraPosition" :src="src"></ModelSVG>
    </div>
  </div>
</template>
<script>
import ModelSVG from "../../components/three/model-svg";
export default {
  name: "activityHome",
  data() {
    return {
      cameraPosition: { x: 0, y: 0, z: 5000 },
      src: "../../svg/2.svg"
    };
  },
  components: {
    ModelSVG
  }
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: url(../../assets/showcase.png) no-repeat;
  background-size: 100% 100%;
}
.threeContainer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
</style>