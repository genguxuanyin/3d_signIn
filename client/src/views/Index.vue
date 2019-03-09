<template>
  <div class="index">
    <HeadNav :data="headData"></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav";
import LeftMenu from "../components/LeftMenu";

export default {
  name: "index",
  data(){
    return {
      headData:{
        logo:'../../images/logo.png',
        title:'滴答空间后台管理系统',
        isShowPresonalInfo:true
      }
    }
  },
  components: {
    HeadNav,
    LeftMenu
  }
};
</script>
<style scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer {
  position: relative;
  top: 0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>