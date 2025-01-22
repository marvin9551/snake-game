<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，页面未找到</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 404页面不需要特殊的逻辑
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f0f0f0;
}

h1 {
  font-size: 6em;
  margin: 0;
  color: #333;
}

p {
  font-size: 1.5em;
  margin: 1em 0;
  color: #666;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #45a049;
}
</style>