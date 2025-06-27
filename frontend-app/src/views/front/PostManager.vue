<template>
  <div style="padding-bottom: 20px; min-height: calc(100vh - 60px)">
    <!-- 弹框触发按钮 -->
    <el-button type="primary" size="mid" @click="dialogPublishVisible = true">Create a new post</el-button>

    <!-- 发布新帖子的弹框 -->
    <el-dialog title="Post a new post" :visible.sync="dialogPublishVisible" width="30%">
      <el-input v-model="newPost.text" placeholder="Enter the content of the new post"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPublishVisible = false">Cancel</el-button>
        <el-button @click="clearInput">Save draft</el-button>
        <el-button type="primary" @click="publishPost">Post</el-button>
      </span>
    </el-dialog>

    <!-- 帖子列表 -->
    <div style="margin: 10px 0">
      <el-card v-for="item in tableData" :key="item.post_id" style="margin: 10px 0">
        <div style="display: flex">
          <div style="flex: 1">
            <div style="border-bottom: 1px solid #ddd; width: 100%; padding-bottom: 10px">
              <span style="font-size: 24px">{{ item.text }}</span>
            </div>
            <div style="line-height: 30px">
              <div><b style="margin-right: 10px">Post in：</b>{{ formatDate(item.date_published) }}</div>
            </div>
          </div>

          <!-- 帖子操作 -->
          <div style="padding-left: 20px">
            <el-button @click="editPost(item)" type="text">Edit</el-button>
            <el-button @click="deletePost(item.post_id)" type="text" style="color: red">Delete</el-button>
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

    <!-- 编辑帖子对话框 -->
    <el-dialog title="Edit帖子" :visible.sync="dialogFormVisible" width="30%">
      <el-input v-model="editPostData.text" placeholder="Edit post content"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updatePost">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PostPage",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      newPost: {
        text: ""
      },
      editPostData: {},
      dialogFormVisible: false,
      dialogPublishVisible: false, // 控制发布新帖子的弹框显示
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    };
  },
  created() {
    this.loadPosts();
  },
  methods: {
    // 加载帖子列表
    loadPosts() {
      const user = JSON.parse(localStorage.getItem("user")); // 获取用户信息
      this.request.get(`/users/${user.user_id}/posts`, {
        params: {
          pageNum: this.pageNum,  // 当前页数
          pageSize: this.pageSize // 每页显示的记录数
        }
      }).then(res => {
        this.tableData = res.records;
        this.total = res.total;
      })
    },
    // 发布新帖子
    publishPost() {
      if (!this.newPost.text) {
        this.$message.error("Please enter the content before Posting!");
        return;
      }
      this.newPost.user_id = this.user.user_id;
      this.request.post("/posts/publish", JSON.stringify(this.newPost), {
        headers: {
          'Authorization': `Bearer ${this.user.token}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.newPost.text = "";
        this.loadPosts();
        this.dialogPublishVisible = false; // 关闭弹框
      }).catch(err => {
        this.$message.error("Publishing failed, please try again later!");
      });
    },
    // 清除输入框内容
    clearInput() {
      if (!this.newPost.text) {
        this.$message.error("Please enter the content before Posting!");
        return;
      }

      this.newPost.user_id = this.user.user_id;
      const token = localStorage.getItem('token');
      this.request.post("/posts", JSON.stringify(this.newPost), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.newPost.text = "";
        this.loadPosts();
        this.dialogPublishVisible = false; // 关闭弹框
      }).catch(err => {
        this.$message.error("Publishing failed, please try again later!");
      });
    },
    // 删除帖子
    deletePost(postId) {
      this.$confirm("Are you sure you want to delete this post?", "Tips", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning"
      }).then(() => {
        this.request.delete(`/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${this.user.token}`
          }
        }).then(() => {

          this.loadPosts();
        });
      }).catch(() => {
        this.$message.info("Undeleted");
      });
    },
    // 编辑帖子
    editPost(item) {
      this.editPostData = { ...item };
      this.dialogFormVisible = true;
    },
    // 更新帖子
    updatePost() {
      const postId = this.editPostData.post_id;
      const token = localStorage.getItem("token");

      this.request.patch(`/posts/${postId}`, { text: this.editPostData.text }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(() => {

        this.dialogFormVisible = false;
        this.loadPosts();
      }).catch(err => {
        this.$message.error("Update failed, please try again later.");
      });
    },
    formatDate(timestamp) {
      if (!timestamp) {
        return '';  // 如果时间是空，返回空字符串
      }
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadPosts();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadPosts();
    }
  }
};
</script>

<style>
/* 样式略 */
</style>
