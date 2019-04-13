<template>
    <div class="chart">
        <Header 
            v-if="targetUser"
            :is-left='true'
            :title='targetUser.name'
            btn_icon='ellipsis-h'>
        </Header>
        <div class="container" v-if="targetUser && user">
          <div class="content_wrap" 
                v-for="(item, index) in messageList" :key="index">
                <div class="left_msg" v-if="item.source == 'other'">
                    <img :src="targetUser.avatar" alt="">
                    <span>{{item.msg}}</span>
                </div>
                <div class="right_msg" v-if="item.source == 'self'">
                    <span>{{item.msg}}</span>
                    <img :src="user.avatar" alt="">
                </div>
            </div>
        </div>
        <div class="footer_wrap">
            <input type="text" v-model="msgValue">
            <button :disabled='msgValue == ""' @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
import Header from "../../components/Header";
import WSocket from "../../sorket";

export default {
  name: "chart",
  data() {
    return {
      targetUser: null,
      msgValue: "",
      messageList: []
    };
  },
  components: {
    Header
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  mounted() {
    WSocket.init(
      {
        user: this.user
      },
      message => {
        // 收到消息的回调
        this.messageList.push({
          msg: message.msg,
          source: "other"
        });
        this.saveMsg();
      },
      error => {
        console.log(error);
      }
    );
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.targetUser = {name:'我要上墙'};//to.params.user;
      vm.getMessges();
    });
  },
  methods: {
    getMessges() {
      // 请求当前user的所有聊天数据
      /* this.$axios(`/api/profile/msg/${this.user.id}`).then(res => {
        // 过滤与当前目标对象的聊天数据
        let result = res.data.filter(data => {
          return data.target._id == this.targetUser._id;
        });
        if (result.length > 0) this.messageList = result[0].message;
      }); */
    },
    sendMessage() {
      // 消息对象
      const msgObj = {
        target: this.targetUser._id, // 目标对象id
        current: this.user.id, // 用户id
        msg: this.msgValue // 消息内容
      };
      WSocket.send(msgObj); // 通过websorket发送消息
      // 本地客户端显示
      this.messageList.push({
        msg: this.msgValue,
        source: "self"
      });
      this.saveMsg();
    },
    saveMsg() {
      // 保存消息
      this.$axios
        .post("/api/profile/addmsg", {
          target: {
            avatar: this.targetUser.avatar,
            name: this.targetUser.name,
            _id: this.targetUser._id
          },
          count: 0,
          message: this.messageList,
          user_id: this.user.id
        })
        .then(res => {
          // 消息保存成功 清空输入框
          this.msgValue = "";
        });
    }
  }
};
</script>
<style scoped>
.chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container {
  width: 100%;
  height: calc(100% - 100px);
  box-sizing: border-box;
  background-color: #f1f1f1;
  margin-top: 50px;
  padding: 8px;
  overflow-y: scroll;
}
.footer_wrap {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-top: 1px solid #d9d9d9;
  position: absolute;
  bottom: 0;
  padding: 8px;
  background-color: #fafafa;
}
.footer_wrap input {
  width: 70%;
  height: 30px;
  outline: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.footer_wrap button {
  width: 20%;
  height: 34px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-left: 8px;
  outline: none;
  background-color: #f1f1f1;
}
.footer_wrap button[disabled] {
  background-color: #d9d9d9;
  cursor: not-allowed;
  pointer-events: none;
}
.left_msg {
  justify-content: flex-start;
}
.right_msg {
  justify-content: flex-end;
}
.left_msg,
.right_msg {
  width: 100%;
  display: flex;
  margin: 5px 0;
}
.content_wrap img {
  width: 3rem;
  height: 3rem;
}
.content_wrap span {
  display: inline-block;
  max-width: 65%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin: 0 5px;
  padding: 8px;
  box-sizing: border-box;
  word-break: break-all;
}
.left_msg span {
  background-color: #fff;
}
.right_msg span {
  background-color: #0fce0d;
}
</style>

