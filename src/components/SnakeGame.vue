<template>
  <div class="game-container">
    <div class="game-info">
      <div class="score">得分: {{ score }}</div>
      <button @click="startGame" :disabled="isPlaying">开始游戏</button>
      <button @click="pauseGame" :disabled="!isPlaying">暂停</button>
    </div>
    <div class="game-board" :style="gameBoardStyle">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="cell"
        :class="{
          'snake-cell': isSnakeCell(index),
          'food-cell': isFoodCell(index)
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 游戏配置
const BOARD_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 150;

// 游戏状态
const score = ref(0);
const isPlaying = ref(false);
const cells = ref<number[]>(Array(BOARD_SIZE * BOARD_SIZE).fill(0));
const snake = ref<number[]>([]);
const food = ref<number>(-1);
const direction = ref<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
let gameInterval: number | null = null;

// 计算属性
const gameBoardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
  gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
}));

// 方法
const initializeGame = () => {
  // 初始化蛇的位置（从左侧中间开始）
  const startY = Math.floor(BOARD_SIZE / 2);
  snake.value = Array(INITIAL_SNAKE_LENGTH)
    .fill(0)
    .map((_, index) => startY * BOARD_SIZE + index);
  generateFood();
  generateFood();
  score.value = 0;
};

const generateFood = () => {
  let newFood;
  do {
    newFood = Math.floor(Math.random() * cells.value.length);
  } while (snake.value.includes(newFood));
  food.value = newFood;
};

const startGame = () => {
  if (!isPlaying.value) {
    initializeGame();
    isPlaying.value = true;
    gameInterval = setInterval(moveSnake, GAME_SPEED);
  }
};

const pauseGame = () => {
  isPlaying.value = false;
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
};

const gameOver = () => {
  pauseGame();
  if (confirm(`游戏结束！得分：${score.value}\n是否重新开始？`)) {
    startGame();
  }
};

const moveSnake = () => {
  const head = snake.value[snake.value.length - 1];
  let newHead: number;

  // 计算新的头部位置
  switch (direction.value) {
    case 'UP':
      newHead = head - BOARD_SIZE;
      if (newHead < 0 || (head < BOARD_SIZE && direction.value === 'UP')) return gameOver();
      break;
    case 'DOWN':
      newHead = head + BOARD_SIZE;
      if (newHead >= cells.value.length || (head >= cells.value.length - BOARD_SIZE && direction.value === 'DOWN')) return gameOver();
      break;
    case 'LEFT':
      newHead = head - 1;
      if (head % BOARD_SIZE === 0 || (head % BOARD_SIZE === 0 && direction.value === 'LEFT')) return gameOver();
      break;
    case 'RIGHT':
      newHead = head + 1;
      if (head % BOARD_SIZE === BOARD_SIZE - 1 || (head % BOARD_SIZE === BOARD_SIZE - 1 && direction.value === 'RIGHT')) return gameOver();
      break;
  }

  // 检查是否撞到自己
  if (snake.value.includes(newHead)) {
    return gameOver();
  }

  snake.value.push(newHead);

  // 检查是否吃到食物
  if (newHead === food.value) {
    score.value += 10;
    generateFood();
  } else {
    snake.value.shift(); // 如果没吃到食物，移除尾部
  }
};

let lastKeyPressTime = 0;
const KEY_PRESS_DELAY = 100; // 防抖延迟时间（毫秒）

const handleKeydown = (event: KeyboardEvent) => {
  if (!isPlaying.value) return;

  const currentTime = Date.now();
  if (currentTime - lastKeyPressTime < KEY_PRESS_DELAY) return;
  lastKeyPressTime = currentTime;

  const newDirection = {
    'ArrowUp': direction.value !== 'DOWN' ? 'UP' : direction.value,
    'ArrowDown': direction.value !== 'UP' ? 'DOWN' : direction.value,
    'ArrowLeft': direction.value !== 'RIGHT' ? 'LEFT' : direction.value,
    'ArrowRight': direction.value !== 'LEFT' ? 'RIGHT' : direction.value
  }[event.key];

  if (newDirection) direction.value = newDirection;
};

// 辅助方法
const isSnakeCell = (index: number) => snake.value.includes(index);
const isFoodCell = (index: number) => food.value === index;

// 生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (gameInterval) {
    clearInterval(gameInterval);
  }
});
</script>

<style scoped>
.game-container {
  padding: 30px;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 60px rgba(255, 140, 0, 0.2);
  border: 4px solid #d4af37;
}

.game-info {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  min-width: 400px;
}

.score {
  font-size: 28px;
  font-weight: bold;
  color: #8b0000;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  background: linear-gradient(45deg, #ffd700, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

button {
  padding: 12px 25px;
  font-size: 18px;
  border: 2px solid #d4af37;
  border-radius: 30px;
  background: linear-gradient(45deg, #d4af37, #ffd700);
  color: #8b0000;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  margin: 0 10px;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  background: linear-gradient(45deg, #ffd700, #d4af37);
}

button:disabled {
  background: #d3d3d3;
  border-color: #a9a9a9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color: #666;
}

.game-board {
  display: grid;
  gap: 1px;
  background-color: #ccc;
  border: 1px solid #999;
  width: 400px;
  height: 400px;
}

.cell {
  background-color: #fff;
  aspect-ratio: 1;
}

.snake-cell {
  position: relative;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
  transform: scale(0.95);
  overflow: hidden;
}

.snake-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(255, 255, 255, 0.1) 5px,
    rgba(255, 255, 255, 0.1) 10px
  );
  animation: scalePattern 0.5s infinite alternate;
}

.snake-cell::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
}

@keyframes scalePattern {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.food-cell {
  background-color: #f44336;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff4500, #8b0000);
  box-shadow: 0 0 15px rgba(255, 69, 0, 0.6);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>