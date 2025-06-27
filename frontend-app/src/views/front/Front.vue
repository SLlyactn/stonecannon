<template>
  <div style="background: #F0F8FF">
<!--    头部-->
    <div style="display: flex; background-color: #fff; height: 60px; line-height: 60px; border-bottom: 1px solid #eee">
      <div style="width: 240px; display: flex; padding-left: 30px;margin-left: 400px">

        <div style="flex: 1; font-size: 20px; color: #1E90FF; font-weight: bold"></div>
      </div>
      <div style="flex: 1">

        <el-menu :default-active="'1'" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/front/home">Home</el-menu-item>
          <el-menu-item index="/front/postManager">Post</el-menu-item>
          <el-menu-item index="/front/postdraft">DraftBox</el-menu-item>
          <el-menu-item index="/front/feedManagement">History</el-menu-item>
          <el-menu-item index="/front/person">Me</el-menu-item>
        </el-menu>
      </div>
      <div style="width: 160px">
        <div v-if="!user.token" style="text-align: right; padding-right: 30px">
          <el-button @click="$router.push('/login')">Login</el-button>
          <el-button @click="$router.push('/register')">Register</el-button>
        </div>
        <div v-else>
          <el-dropdown style="width: 150px; cursor: pointer; text-align: right">
            <div style="display: inline-block">

              <span>{{ this.username }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <span style="text-decoration: none" @click="logout">Logout</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div style="margin: 0 auto;">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "Front",
  data() {
    return {
      username:'',
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {
    this.getUserInfo(); // 个人信息
  },
  methods: {

    getUserInfo() {
      if (!this.user.token) {
        this.$message.error("Login token not found, please log in again.");
        return;
      }

      // 发起 GET 请求，并传递 token 作为 Authorization 请求头
      this.request.get(`/users/${this.user.user_id}`, {
        headers: {
          'Authorization': `Bearer ${this.user.token}`,  // 正确的 Authorization 头，格式为 Bearer <token>
          'Content-Type': 'application/json'   // 确保请求头为 JSON 类型
        }
      })
          .then(res => {
            this.username=res.first_name+res.last_name;
            localStorage.setItem("userinfo", JSON.stringify(res || {}));
          })
          .catch(err => {
            //alert(err)
            console.error('Error fetching user info:', err);
            // 捕获错误并处理
            if (err.response && err.response.data && err.response.data.error_message) {
              this.$message.error(err.response.data.error_message);
            } else {
              this.$message.error('Failed to retrieve user information, please try again later.');
            }
          });
    },

    logout() {
      // 获取 user 对象
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      // 检查 user 对象是否存在，并从中提取 token
      if (!user || !user.token) {
        this.$message.error("Token not found, please log in again.");
        return;
      }

      // 发送退出请求
      this.request.post("/logout", {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`  // 使用 Bearer token
        }
      }).then(res => {
        if (res.status === 200) {
          // 清除 localStorage 中的用户信息和 token
          localStorage.removeItem('user');

          // 调用 Vuex 的 logout 方法
          this.$store.commit("logout");

          // 提示退出成功
          this.$message.success("Logout Successful");

          // 跳转到登录页
          this.$router.push('/login');
        }
      }).catch(err => {
        console.error('Logout error:', err);
        this.$message.error(err.response?.data?.error_message || '服务器错误');
      });
    }


  }
}

</script>

<style>
.item{
  display: inline-block;
  width: 100px;

  text-align: center;
  cursor: pointer
}
.item a {
  color: 	#1E90FF;
}
.item:hover{
  background-color: 	LightPink;
}
</style>
