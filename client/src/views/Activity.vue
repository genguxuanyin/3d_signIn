<template>
  <div class="activity">
    <HeadNav :data="headData" :clickMenu="clickMenu"></HeadNav>
    <div class="container">
      <router-view></router-view>
    </div>
    <div class="audio">
      <audio ref="bgm" :src="bgmUrl" loop autoplay>Your browser does not support the audio element.</audio>
    </div>
    <div ref="code" class="code" v-if="isShowCode">
      <div class="title">扫一扫，去签到</div>
      <div class="img" :style="{ backgroundImage: 'url('+codeUrl+')'}"></div>
    </div>
    <vue-danmaku
      ref="danmaku"
      class="danmaku"
      :danmus="danmus"
      :config="config"
      @inited="onInit"
      @mouseIn="onMouseIn"
      @mouseOut="onMouseOut"
    ></vue-danmaku>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav";
import { getActivitiesById as _getActivitiesById } from "../api/index";
import vueDanmaku from "vue-danmaku";

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
      },
      bgmUrl: "../audio/1.mp3",
      codeUrl: "../images/code.png",
      isShowCode: true,
      LimitDrag:null,
      danmus: [
        {icon:"../images/1.jpg",message:"1超长弹幕测试超长弹幕测试超长弹幕测试超长弹幕测试end"},
        {icon:"../images/2.jpg",message:"2短弹幕测试"},
        {icon:"../images/3.jpg",message:"3超长弹幕测试"},
        {icon:"../images/4.jpg",message:"4超长弹幕测试超长弹幕测试超长弹幕测试2"},
        {icon:"../images/5.jpg",message:"5今天是个好日子"},
        {icon:"../images/6.jpg",message:"6danmaku最高！"},
        {icon:"../images/7.jpg",message:"7哔哩哔哩，干杯~"},
        {icon:"../images/8.jpg",message:"8宽度"},
        {icon:"../images/10.jpg",message:"9窄"}
      ],
      danmu: "",
      config: {
        channels: 5,
        loop: false,
        speed: 40,
        fontSize: 80
      },
      isShowDanmaku: true
    };
  },
  components: { HeadNav, vueDanmaku },
  created() {
    this.getActivitiesById(this.$route.params.id);
    this.initLimitDrag();
    this.danmus = this.danmus.map((item, index, arr) => {
      return `<span style='background-color:#ffffff;font-weight: lighter;color:#000000;box-sizing: border-box;border-radius:37px;padding:6px 20px 6px 20px;font-size:50px;display: flex;align-items: center;'><img src=${item.icon} style="width:50px;height:50px;border-radius:50%"/>${item.message}</span>`;
    });
  },
  mounted(){
    let code = new this.LimitDrag(this.$refs.code);
    code.init();
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
    },
    clickMenu(index) {
      switch (index) {
        case 1:
          this.$router.push({ path: "/home" });
          break;
        case 2:
          let bgm = this.$refs.bgm;
          if (bgm.paused) {
            bgm.play();
          } else {
            bgm.pause();
          }
          break;
        case 3:
          this.isShowCode = !this.isShowCode;
          break;
        case 4:
          if (this.isShowDanmaku) {
            this.$refs.danmaku.hide();
          } else {
            this.$refs.danmaku.show();
          }
          this.isShowDanmaku = !this.isShowDanmaku;
          break;
        case 6:
          this.screenView();
          break;
      }
    },
    screenView(e) {
      if (
        window.outerHeigth == screen.heigth &&
        window.outerWidth == screen.width
      ) {
        this.headData.menus[6].title = "退出";
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      } else {
        this.headData.menus[6].title = "全屏";
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },
    onInit() {
      this.$refs.danmaku.play();
    },
    onMouseIn() {
      // this.$refs.danmaku.pause();
    },
    onMouseOut() {
      // this.$refs.danmaku.play();
    },
    addDanmu() {
      if (!this.danmu) return;
      this.$refs.danmaku.add(this.danmu);
      this.danmu = "";
    },
    initLimitDrag() {
      var inherit = (function() {
        var F = function() {};
        return function(Target, Origin) {
          F.prototype = Origin.prototype;
          Target.prototype = new F();
          Target.prototype.constructor = Target;
          Target.prototype.uber = Origin.prototype;
        };
      })();

      //方法一
      var DealUserEventHandler = function() {};
      DealUserEventHandler.prototype = {
        addAllUserEventHandler: function() {
          for (var event in this.userEventHandlerBox) {
            this.userEventHandlerBox[event].func = this[
              this.userEventHandlerBox[event].funcName
            ].bind(this);
            this.userEventHandlerBox[event].element.addEventListener(
              event,
              this.userEventHandlerBox[event].func,
              false
            );
          }
        },
        removeAllUserEventHandler: function() {
          for (var event in this.userEventHandlerBox) {
            if (this.userEventHandlerBox[event].func) {
              this.userEventHandlerBox[event].element.removeEventListener(
                event,
                this.userEventHandlerBox[event].func,
                false
              );
              this.userEventHandlerBox[event].func = null;
            }
          }
        }
      };

      var Drag = function (elem) {
        this.elem = elem;
        this.disX = 0;
        this.disY = 0;
      }

      inherit(Drag, DealUserEventHandler);

      Drag.prototype.init = function() {
        this.elem.addEventListener(
          "mousedown",
          this.mouseDown.bind(this),
          false
        );
      };
      Drag.prototype.mouseDown = function(ev) {
        var oEvent = ev || event;
        this.disX = oEvent.clientX - this.elem.offsetLeft;
        this.disY = oEvent.clientY - this.elem.offsetTop;
        this.userEventHandlerBox = {
          mousemove: {
            element: document,
            event: "mousemove",
            funcName: "mouseMove"
          },
          mouseup: {
            element: document,
            event: "mouseup",
            funcName: "mouseUp"
          }
        };
        this.addAllUserEventHandler();
        oEvent.preventDefault();
      };
      Drag.prototype.mouseMove = function(ev) {
        var oEvent = ev || event;
        this.elem.style.left = oEvent.clientX - this.disX + "px";
        this.elem.style.top = oEvent.clientY - this.disY + "px";
      };
      Drag.prototype.mouseUp = function(ev) {
        this.removeAllUserEventHandler();
      };

      this.LimitDrag = function (elem) {
        Drag.call(this, elem);
      }
      inherit(this.LimitDrag, Drag);

      this.LimitDrag.prototype.mouseMove = function(e) {
        var l = e.clientX - this.disX;
        var t = e.clientY - this.disY;
        var clientWidth = document.documentElement.clientWidth;
        var clientHeight = document.documentElement.clientHeight;
        if (l < 0) {
          l = 0;
        } else if (l > clientWidth - this.elem.offsetWidth) {
          l = clientWidth - this.elem.offsetWidth;
        }
        if (t < 0) {
          t = 0;
        } else if (t > clientHeight - this.elem.offsetHeight) {
          t = clientHeight - this.elem.offsetHeight;
        }
        this.elem.style.left = l + "px";
        this.elem.style.top = t + "px";
      };
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
.audio {
  display: none;
}
.code {
  position: fixed;
  height: 10rem /* 200/20 */;
  width: 8rem /* 160/20 */;
  bottom: 1rem /* 20/20 */;
  left: 1rem /* 20/20 */;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0 0 0.05rem /* 1/20 */ #c2c2c2;
  cursor: move;
  z-index: 1;
}
.code .title {
  height: 2rem /* 40/20 */;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem /* 16/20 */;
  border-bottom: 1px solid #ccc;
}
.code .img {
  height: 8rem /* 160/20 */;
  width: 8rem /* 160/20 */;
  /* background-image: url(../assets/code.png); */
  background-repeat: no-repeat;
  background-size: 90% 90%;
  -moz-background-size: 90% 90%;
  background-position: center center;
}
.danmaku {
  position: fixed;
  top: 71px;
  width: 100%;
  height: calc(100% - 71px);
  z-index: 0;
  /* background: linear-gradient(45deg, #5ac381, #20568b); */
}
</style>