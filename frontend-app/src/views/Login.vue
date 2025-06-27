<template>
  <div class="wrapper">
    <div style="margin: 150px auto; background-color: #fff; width: 350px; height: 340px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>Login</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: center">
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">Register</el-button>
          <el-button type="primary" size="small" autocomplete="off" @click="login">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {resetRouter, setRoutes} from "@/router";

export default {
  name: "Login",
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: 'Username', trigger: 'blur'},

        ],
        password: [
          {required: true, message: 'Password', trigger: 'blur'},

        ],
      }
    }
  },
  created() {
    // 重置路由
    resetRouter();
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          console.log('Logging in with:', JSON.stringify(this.user));
          // 确保发送的是 JSON 数据
          this.request.post("/login", JSON.stringify(this.user), {
            headers: {
              'Content-Type': 'application/json'  // 确保请求头为 JSON 类型
            }
          }).then(res => {
            // 只判断 token 是否存在
            if (res.token) {
              // 存储 token 和用户信息
              localStorage.setItem("token", res.token);
              // 根据实际情况存储用户信息（如果后端返回用户信息）
              localStorage.setItem("user", JSON.stringify(res || {}));
              // 检查是否成功存储
              console.log('Token and user info stored in localStorage');
              // 调试 setRoutes 和页面跳转
              console.log('Setting routes...');
              setRoutes();
              console.log('Redirecting to /front/home');
              this.$router.push("/front/home");
            } else {
              this.$message.error(res.error_message || 'Login Failed');  // 显示来自后端的错误信息
            }
          }).catch(err => {
            console.error('Login error:', err);
            // 捕获错误，显示具体的错误信息
            this.$message.error(err.response.data.error_message || 'The request failed. Please try again later');
          });
        }
      });
    }







  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #bcc5e0, #87CEFA);
  overflow: hidden;
}
</style>
