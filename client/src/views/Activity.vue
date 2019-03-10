<template>
  <div class="activity">
    <HeadNav :data="headData"></HeadNav>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav";
import { getActivitiesById as _getActivitiesById } from "../api/index";

export default {
  name: "activity",
  data() {
    return {
      activity: {},
      headData: {
        logo: "../../images/logo.png",
        title: "云南智巢科技有限责任公司年会",
        isShowPresonalInfo: true,
        menus: [
          {
            icon: "fa-server",
            title: "首页",
            isSelected: false
          },
          {
            icon: "fa-server",
            title: "管理",
            isSelected: false
          },
          {
            icon: "fa-music",
            title: "音乐",
            isSelected: false
          },
          {
            icon: "fa-qrcode",
            title: "二维码",
            isSelected: false
          },
          {
            icon: "fa-whatsapp",
            title: "弹幕",
            isSelected: false
          },
          {
            icon: "fa-cubes",
            title: "应用",
            isSelected: false
          },
          {
            icon: "fa-compass",
            title: "全屏",
            isSelected: false
          },
          {
            icon: "fa-cog",
            title: "设置",
            isSelected: false
          }
        ]
      }
    };
  },
  components: { HeadNav },
  created() {
    this.getActivitiesById(this.$route.params.id);
  },
  methods: {
    getActivitiesById(id) {
      // 获取表格数据
      _getActivitiesById(id)
        .then(res => {
          if (res.data.length >= 0 && res.data[0].account === this.user.name) {
            this.activity = res.data[0];
            this.headData.title = this.activity.name;
          } else {
          }
        })
        .catch(err => {
          if (err.response.status == 404) {
            this.$message({
              message: err.response.data,
              type: "error"
            });
          }
        });
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>
<style scoped>
.activity {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container {
  position: relative;
  top: 0;
  width: 100%;
  height: calc(100% - 71px);
}
</style>