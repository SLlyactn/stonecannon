<template>
  <div style="padding-bottom: 20px; width: 100%; max-width: none;">
    <!-- 搜索框 -->
    <div style="margin: 10px 0; padding: 20px; background-color: #fff; border-radius: 10px">
      <div style="padding: 10px 0; font-size: 28px; color: #67C23A">Space</div>
      <el-input v-model="searchText" placeholder="Please enter username or post content" style="width: 80%" size="mid"></el-input>
      <el-button type="primary" size="mid" @click="searchPosts">Search</el-button>
    </div>

    <!-- 帖子展示区域，使用网格布局 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); grid-gap: 20px; padding: 20px; background-color: #fff; border-radius: 20px">
      <el-card v-for="post in posts" :key="post.post_id" style="margin-bottom: 10px;">
        <div style="display: flex; flex-direction: column">
          <!-- 帖子头部信息 -->
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>
              <p style="color: #888;font-size: 16px">{{ formatDate(post.date_published) }}</p>
              <span style="font-size: 18px; font-weight: bold">{{ post.first_name }} {{ post.last_name }}</span>

            </div>

          </div>
          <!-- 帖子内容 -->
          <div style="padding-top: 10px; word-break: break-word;">{{ post.text }}</div>
          <!-- 点赞和取消点赞功能 -->
          <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center">
            <div>
              <el-button
                  v-if="!post.liked"
                  @click="likePost(post.post_id)"
                  type="primary" size="small">Like</el-button>
              <el-button
                  v-else
                  @click="unlikePost(post.post_id)"
                  type="danger" size="small">Cancle</el-button>
            </div>
            <el-button
                v-if="!post.followed"
                type="success"
                @click="followUser(post.author_id)"
                size="mini">Follow</el-button>
            <el-button
                v-else
                type="danger"
                @click="unfollowUser(post.author_id)"
                size="mini">Unfollow</el-button>
            <div>{{ post.like_count }} likes</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
      <div>Total {{ total }} items</div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "FrontHome",
  data() {
    return {
      posts: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      searchText: "",
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    };
  },
  created() {
    this.loadPosts();
  },
  methods: {
    // 加载帖子
    loadPosts() {
      this.request.get("/Allposts", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchText: this.searchText
        },
        headers: {
          'Authorization': `Bearer ${this.user.token}`  // 使用 Bearer token 进行身份验证
        }
      }).then(res => {
        this.posts = res.records;
        this.total = res.total;
      }).catch(err => {
        this.$message.error("Failed to load posts, please try again.");
      });
    },


    // 搜索帖子
    searchPosts() {
      this.pageNum = 1;
      this.loadPosts();
    },

    // 点赞帖子
    likePost(postId) {

      this.request.post(`/posts/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${this.user.token}`
        }
      }).then(() => {

        this.loadPosts();
      }).catch(err => {
        this.$message.error("Failed to like the post.");
      });
    },

    // 取消点赞帖子
    unlikePost(postId) {
      this.request.delete(`/posts/${postId}/like`, {
        headers: {
          'Authorization': `Bearer ${this.user.token}`
        }
      }).then(() => {

        this.loadPosts();
      }).catch(err => {
        this.$message.error("Failed to unlike the post.");
      });
    },

    // 关注用户
    followUser(userId) {

      this.request.post(`/users/${userId}/follow`, {}, {
        headers: {
          'Authorization': `Bearer ${this.user.token}`
        }
      }).then(() => {

        this.loadPosts();
      }).catch(err => {
        this.$message.error(err.response.data.error_message);
      });
    },
// 取消关注用户
    unfollowUser(userId) {
      this.request.delete(`/users/${userId}/follow`, {
        headers: {
          'Authorization': `Bearer ${this.user.token}`
        }
      }).then(() => {

        this.loadPosts();
      }).catch(err => {
        this.$message.error("Failed to unfollow the user.");
      });
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 确保月份是两位数
      const day = String(date.getDate()).padStart(2, '0'); // 确保日期是两位数
      const hours = String(date.getHours()).padStart(2, '0'); // 确保小时是两位数
      const minutes = String(date.getMinutes()).padStart(2, '0'); // 确保分钟是两位数
      const seconds = String(date.getSeconds()).padStart(2, '0'); // 确保秒是两位数

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },


    // 分页控制
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadPosts();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadPosts();
    }
  }
}
</script>

<style scoped>
/* 自定义样式可以根据需求设计 */
</style>
