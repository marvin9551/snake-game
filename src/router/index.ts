import { createRouter, createWebHistory } from 'vue-router'
import SnakeGame from '../components/SnakeGame.vue'
import NotFound from '../components/NotFound.vue'

const router = createRouter({
  history: createWebHistory('./'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SnakeGame
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ]
})

export default router