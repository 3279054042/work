<template>
  <div class="system-container">
    <h2 class="title">系统管理</h2>

    <div class="module-list">
      <div class="module-card" @click="goPage('user')">
        <h3>用户管理</h3>
        <p>管理系统用户信息</p >
      </div>

      <div class="module-card" @click="goPage('role')">
        <h3>角色管理</h3>
        <p>管理不同的用户角色</p >
      </div>

      <div class="module-card" @click="goPage('log')">
        <h3>系统日志</h3>
        <p>查看系统操作记录</p >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goPage = (page) => {
  alert("你点击了：" + page);
};
</script>

<style scoped>
.system-container {
  padding: 20px;
}

.title {
  font-size: 26px;
  margin-bottom: 20px;
}

.module-list {
  display: flex;
  gap: 20px;
}

.module-card {
  width: 200px;
  height: 120px;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: 0.2s;
}

.module-card:hover {
  background: #f5f7fa;
  box-shadow: 0 2px 8px #ccc;
}

.module-card h3 {
  margin: 0;
  font-size: 18px;
}

.module-card p {
  margin-top: 8px;
  color: #666;
}
</style>