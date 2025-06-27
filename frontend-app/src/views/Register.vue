<template>
  <div class="wrapper">
    <div style="margin: 150px auto; background-color: #fff; width: 350px; height: 440px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>Register</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="first_name">
          <el-input placeholder="Please enter your first name" size="medium" prefix-icon="el-icon-user" v-model="user.first_name"></el-input>
        </el-form-item>
        <el-form-item prop="last_name">
          <el-input placeholder="Please enter your last name" size="medium" prefix-icon="el-icon-user" v-model="user.last_name"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input placeholder="Please enter your username" size="medium" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="Enter password" size="medium" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input placeholder="Repeat your password" size="medium" prefix-icon="el-icon-lock" show-password v-model="user.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item style="margin: 5px 0; text-align: right">
          <el-button type="primary" size="small" autocomplete="off" @click="register">Register</el-button>
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/login')">Back to login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      user: {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        first_name: [
          { required: true, message: 'Please enter your first name', trigger: 'blur' },
        ],
        last_name: [
          { required: true, message: 'Please enter your last name', trigger: 'blur' },
        ],
        username: [
          { required: true, message: 'Please enter your username', trigger: 'blur' },
          { min: 3, max: 10, message: 'The user name is between 3 and 10 characters long', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Enter password', trigger: 'blur' },
          { min: 6, max: 20, message: 'Passwords are between 6 and 20 characters long', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Repeat your password', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== this.user.password) {
                callback(new Error('Password is not the same'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    register() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          this.request.post("/users", JSON.stringify(this.user)).then(res => {
            if (res.status === 201) {
              this.$router.push('/login');  // 注册成功后跳转到登录页面
            } else {
              this.$message.error(res.data.error_message || 'Register failed');
            }
          }).catch(err => {
            this.$message.error(err.response.data.error_message || 'Register failed, please try again later');
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
  background-image: linear-gradient(to bottom right, #4169E1 , #87CEFA);
  overflow: hidden;
}
</style>
