<template>
  <div class="signIn">
    <div class="logo">
      <img src="../../assets/bg.jpg" alt="my login image">
    </div>
    <!-- 姓名 -->
    <InputGroup v-model="name" placeholder="姓名" :error="errors.name"/>
    <!-- 手机号 -->
    <InputGroup type="number" v-model="phone" placeholder="手机号" :error="errors.phone"/>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <button :disabled="isClick" @click="handleLogin">签到</button>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import InputGroup from "../../components/InputGroup";
import { signIn, getSignInUserInfoById } from "../../api/index";
export default {
  name: "signIn",
  data() {
    return {
      phone: "",
      name: "",
      errors: {}
    };
  },
  computed: {
    isClick() {
      if (!this.phone || !this.name) return true;
      else return false;
    }
  },
  methods: {
    handleLogin() {
      if (this.validatePhone()) {
        // 取消错误提醒
        this.errors = {};
        // 发送请求
        signIn({
          name: this.name,
          phone: this.phone,
          wechatId: "abc-7854-dfdf-464afef-fdfd",
          activityId: this.$route.params.id
        })
          .then(res => {
            // 签到成功
            const { token } = res.data;
            localStorage.setItem("eleSignInToken", token);
            // 解析token
            const decode = jwt_decode(token);
            getSignInUserInfoById(decode.id)
              .then(res => {
                // 存储数据
                this.$store.dispatch(
                  "setIsSignInAutnenticated",
                  !this.isEmpty(res.data)
                );
                this.$store.dispatch("setSignInUser", res.data);
                // 页面跳转
                this.$router.push("/mHome");
              })
              .catch(err => {
                this.$message({
                  message: "登录失败,请重新登录",
                  type: "error"
                });
              });
          })
          .catch(err => {
            // 返回错误信息
            this.errors = {
              phone: err.response.data
            };
          });
      }
    },
    validatePhone() {
      // 验证手机号码
      if (!this.phone) {
        this.errors = {
          phone: "手机号码不能为空"
        };
        return false;
      } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
        this.errors = {
          phone: "请填写正确的手机号码"
        };
        return false;
      } else {
        this.errors = {};
        return true;
      }
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  },
  components: {
    InputGroup
  }
};
</script>

<style scoped>
.signIn {
  width: 100%;
  height: 100%;
  padding: 4rem /* 80/20 */ 1.5rem /* 30/20 */ 0 1.5rem /* 30/20 */;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  text-align: center;
}
.logo img {
  width: 5rem /* 100/20 */;
  border-radius: 0.5rem /* 10/20 */;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 1rem /* 20/20 */;
}
.login_des {
  color: #aaa;
  line-height: 1.1rem /* 22/20 */;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 2.3rem /* 46/20 */;
  background-color: #48ca38;
  border-radius: 0.2rem /* 4/20 */;
  color: white;
  font-size: 0.7rem /* 14/20 */;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>
