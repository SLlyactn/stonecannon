<template>
  <div class="wrapper">
    <el-card class="user-card">
      <h3 class="title">My Info</h3>
      <el-form label-width="100px" size="small" class="user-form">
        <el-form-item label="Username">
          <el-input v-model="form.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="First Name">
          <el-input v-model="form.first_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="form.last_name" disabled autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <!-- Tabs for Followers and Following -->
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="Your Follow" name="following">
          <div class="scrollable-list" @scroll="handleScroll('following')">
            <el-table :data="followingList" style="width: 100%">

              <el-table-column prop="username" label="Username"></el-table-column>
              <el-table-column prop="first_name" label="First Name"></el-table-column>
              <el-table-column prop="last_name" label="Last Name"></el-table-column>
              <el-table-column label="Unfo">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="unfollowUser(scope.row.user_id)">Unfollow</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Your Fans" name="followers">
          <div class="scrollable-list" @scroll="handleScroll('followers')">
            <el-table :data="followersList" style="width: 100%">
              <el-table-column prop="username" label="Username"></el-table-column>
              <el-table-column prop="first_name" label="First Name"></el-table-column>
              <el-table-column prop="last_name" label="Last Name"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Person",
  data() {
    return {
      form: {},
      activeTab: "following", // 当前激活的标签
      followingList: [], // 关注列表
      followersList: [], // 粉丝列表
      followingPage: 1, // 当前关注列表的页码
      followersPage: 1, // 当前粉丝列表的页码
      loadingMoreFollowing: false, // 是否正在加载更多关注
      loadingMoreFollowers: false, // 是否正在加载更多粉丝
    };
  },
  created() {
    this.form = { ...localStorage.getItem("userinfo") ? JSON.parse(localStorage.getItem("userinfo")) : {} };
    this.loadFollowing();
    this.loadFollowers();
  },
  methods: {
    loadFollowing() {
      const user = JSON.parse(localStorage.getItem("user")); // 获取用户信息
      if (this.loadingMoreFollowing) return; // 防止重复加载
      this.loadingMoreFollowing = true;
      this.request.get(`/users/${user.user_id}/following`, {
        params: { page: this.followingPage },
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }).then(res => {
        this.followingList = [...this.followingList, ...res];
        this.followingPage++; // 页码递增
        this.loadingMoreFollowing = false;
      }).catch(err => {
        this.$message.error("Failed to obtain the attention list. Procedure");
        this.loadingMoreFollowing = false;
      });
    },
    loadFollowers() {
      const user = JSON.parse(localStorage.getItem("user")); // 获取用户信息
      if (this.loadingMoreFollowers) return; // 防止重复加载
      this.loadingMoreFollowers = true;

      this.request.get(`/users/${user.user_id}/followers`, {
        params: { page: this.followersPage },
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }).then(res => {
        this.followersList = [...this.followersList, ...res];
        this.followersPage++; // 页码递增
        this.loadingMoreFollowers = false;
      }).catch(err => {
        this.$message.error("Failed to get the fan list");
        this.loadingMoreFollowers = false;
      });
    },
    unfollowUser(user_id) {
      const user = JSON.parse(localStorage.getItem("user"));
      this.request.delete(`/users/${user_id}/follow`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }).then(() => {
        this.$message.success("Unfollow success");

        // 移除取消关注的用户从 followingList
        this.followingList = this.followingList.filter(user => user.user_id !== user_id);

      }).catch(err => {
        this.$message.error("Unfollow failed");
      });
    },

    handleScroll(type) {
      const container = type === 'following'
          ? this.$el.querySelector('.scrollable-list.following')
          : this.$el.querySelector('.scrollable-list.followers');

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        // 当滚动到底部时加载更多
        type === 'following' ? this.loadFollowing() : this.loadFollowers();
      }
    },
    handleTabClick(tab) {
      this.activeTab = tab.name;
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  overflow: hidden;
}

.user-card {
  width: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}

.title {
  text-align: center;
  font-size: 24px;
  color: #1E90FF;
  margin-bottom: 20px;
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 20px;
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
}

</style>
