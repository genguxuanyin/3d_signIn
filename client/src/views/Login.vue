<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">滴答空间后台管理系统</span>
      </div>
      <el-form
        :model="loginUser"
        :rules="rules"
        ref="loginForm"
        class="loginForm"
        label-width="60px"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="loginUser.account" placeholder="用户名/手机号/邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginUser.password" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            nativeType="submit"
            @click.prevent="submitForm('loginForm')"
            @submit.prevent="submitForm('loginForm')"
            class="submit_btn"
          >登 录</el-button>
        </el-form-item>
        <div class="tiparea">
          <p>还没有账号？现在
            <router-link to="/register">注册</router-link>
          </p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import { login, getUserInfoById } from "../api/index";

export default {
  name: "login",
  data() {
    return {
      loginUser: {
        account: "",
        password: ""
      },
      rules: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          login(this.loginUser)
            .then(res => {
              // 登录成功
              const { token } = res.data;
              localStorage.setItem("eleToken", token);
              // 解析token
              const decode = jwt_decode(token);
              getUserInfoById(decode.id)
                .then(res => {
                  // 存储数据
                  this.$store.dispatch(
                    "setIsAutnenticated",
                    !this.isEmpty(res.data)
                  );
                  this.$store.dispatch("setUser", res.data);
                  // 页面跳转
                  this.$router.push("/index");
                })
                .catch(err => {
                  this.$message({
                    message: "登录失败,请重新登录",
                    type: "error"
                  });
                });
            })
            .catch(err => {
              this.$message({
                message: err.response.data,
                type: "error"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: calc(50% - 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>


