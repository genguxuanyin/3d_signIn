<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        mode="vertical"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff"
        class="el-menu-vertical-demo"
      >
        <template v-for="item in items">
          <el-submenu v-if="item.children" :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex">
              <el-menu-item :index="citem.path">
                <span slot="title">{{citem.name}}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
          <router-link v-else :to="item.path" :index="item.path" :key="item.path" v-show="!item.limits || (item.limits && item.limits.length && item.limits.includes(user.identity))">
            <el-menu-item :index="item.path">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data() {
    return {
      items: [
        {
          icon: "el-icon-tickets",
          name: "首页",
          path: "home"
        },
        {
          icon: "el-icon-menu",
          name: "用户管理",
          path: "manageUser",
          limits:['manager']
        },
        {
          icon: "el-icon-menu",
          name: "活动管理",
          path: "manageActivity",
          limits:['manager']
        },
        {
          icon: "el-icon-edit-outline",
          name: "我的活动",
          path: "myActivity"
        },
        {
          icon: "el-icon-star-on",
          name: "管理",
          path: "manage",
          children: [
            {
              path: "manageSignIn",
              name: "签到"
            },
            {
              path: "manageDanmaku",
              name: "留言"
            },
            {
              path: "manageWin",
              name: "抽奖"
            },
            {
              path: "manageGame",
              name: "游戏"
            }
          ]
        }
      ]
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
