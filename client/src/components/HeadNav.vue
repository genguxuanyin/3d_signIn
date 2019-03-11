<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="8" class="logo-container">
        <img :src="data.logo" class="logo" alt>
        <span class="title">{{data.title}}</span>
      </el-col>
      <template v-if="data.menus&&data.menus.length>0">
        <el-col :span="1" v-for="(item,index) in data.menus" :key="index">
          <div class="menu-container" @click="clickMenu(index)">
            <i :class="'fa fa-margin fa-2x '+item.icon" class="logo"></i>
            <span class="title">{{item.title}}</span>
          </div>
        </el-col>
      </template>
      <el-col :span="6" class="user">
        <div class="userinfo" v-if="data.isShowPresonalInfo">
          <img
            v-if="user.avatar"
            :src="user.avatar.startsWith('//www.gravatar.com')?user.avatar:baseUrl+user.avatar"
            class="avatar"
            alt
          >
          <div class="welcome">
            <p class="name comename">欢迎</p>
            <p class="name avatarname">{{user.name}}</p>
          </div>
          <span class="username">
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </header>
</template>
<script>
export default {
  name: "head-nav",
  data() {
    return {
      
    };
  },
  props: {
    data: Object,
    clickMenu: {
        type: Function,
        default: ()=>{}
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    setDialogInfo(cmditem) {
      if (!cmditem) {
        this.$message("菜单选项缺少command属性");
        return;
      }
      switch (cmditem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    showInfoList() {
      // 个人信息
      this.$router.push("/personalInfo");
    },
    logout() {
      // 清除token
      localStorage.removeItem("eleToken");
      this.$store.dispatch("clearCurrentState");

      // 页面跳转
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.username {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
.menu-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor:pointer;
}
.menu-container .logo{
  width: 2rem /* 40/20 */;
  height: 2rem /* 40/20 */;
}
.menu-container .title{
  line-height: 2rem /* 40/20 */;
  font-size: .9rem /* 18/20 */;
}
.menu-container:hover .title{
  font-size: .95rem /* 19/20 */;
  font-weight: 600;
  color: #409eff;
}
</style>
