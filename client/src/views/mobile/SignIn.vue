<template>
  <div class="signIn">
    <div class="manage_tip">
      <span class="title">滴答空间后台管理系统</span>
    </div>
    <el-input v-model="signInUser.name" placeholder="姓名"></el-input>
    <el-input v-model="signInUser.phone" placeholder="手机号"></el-input>
    <el-button
      type="primary"
      nativeType="submit"
      @click.prevent="submitForm()"
      class="signIn_btn"
    >签 到</el-button>
  </div>
</template>
<script>
export default {
  name: "signIn",
  data() {
    return {
      signInUser: {
        name: "",
        phone: ""
      }
    };
  },
  components: {}
};
</script>

<style scoped>
.signIn {
  width: 100%;
  height: 100%;
  background: url(../../assets/showcase.png) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 1rem /* 20/20 */;
}
.manage_tip {
  padding-top: 5rem /* 100/20 */;
  padding-bottom: 1rem /* 20/20 */;
  width: 100%;
  text-align: center;
}
.manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.signIn_btn {
  width: 100%;
}
</style>