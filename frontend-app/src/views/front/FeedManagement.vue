<template>
  <div class="timeline-container">
    <!-- 动态时间线 -->
    <el-timeline>
      <el-timeline-item
          v-for="item in feedItems"
          :key="item.id"
          :timestamp="formatDate(item.date_published)"
          placement="top"
      >
        <!-- 根据动态类型渲染不同内容 -->
        <el-card>
          <template v-if="item.type === 'post'">
            <!-- 发布帖子 -->
            <div class="post-header" style="display: flex; align-items: center; font-size: 14px;">
  <span class="post-author" style="font-weight: bold; color: #333;">
    {{ item.first_name }} {{ item.last_name }}
  </span>
              <span style="color: #bd7474; margin-left: 5px;">Posted：</span>
            </div>
            <div class="post-content">
              {{ item.text }}
            </div>
          </template>

          <template v-else-if="item.type === 'like'">
            <!-- 点赞动态 -->
            <div class="post-header" style="display: flex; align-items: center; font-size: 14px;">
  <span class="post-author" style="font-weight: bold; color: #333;">
    {{ item.first_name }} {{ item.last_name }}
  </span>
              <span style="color: #bd7474; margin-left: 5px;">Like this post：</span>
            </div>

            <div class="post-content">
              {{ item.text }}
            </div>
          </template>

          <template v-else-if="item.type === 'follow'">
            <!-- 关注动态 -->
            <div class="post-header">
              <span class="post-author">{{ item.first_name }} {{ item.last_name }}</span> Follows {{ item.target_name }}
            </div>
          </template>
        </el-card>
      </el-timeline-item>
    </el-timeline>

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
  name: "TimelineFeed",
  data() {
    return {
      feedItems: [],  // 动态数据
      total: 0,  // 动态总数
      pageNum: 1,
      pageSize: 100,
      searchText: "",
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}  // 当前用户信息
    };
  },
  created() {

    this.loadFeed();
  },
  methods: {
    // 加载动态数据

    loadFeed() {
      this.request.get("/feed", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      }).then(res => {
        this.feedItems = res.records;
        this.total = res.total;
      })
    },


    // 格式化日期
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${hours}:${minutes}:${seconds}`;
    },

    // 分页控制
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadFeed();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadFeed();
    }
  }
}
</script>

<style scoped>
.timeline-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  text-align: center;
}

.post-header {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
}

.post-content {
  margin: 10px 0;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  text-align: center;
  margin-top: 20px;
}


</style>
