<template>
  <div class="app">
    <SnakeGame />
  </div>
</template>

<script setup lang="ts">
import SnakeGame from './components/SnakeGame.vue';
</script>

<style>
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #d40000;
  background-image: 
    linear-gradient(45deg, #ffde00 25%, transparent 25%),
    linear-gradient(-45deg, #ffde00 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ffde00 75%),
    linear-gradient(-45deg, transparent 75%, #ffde00 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  position: relative;
  overflow: hidden;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(212,0,0,0.9) 70%);
  pointer-events: none;
}
</style>