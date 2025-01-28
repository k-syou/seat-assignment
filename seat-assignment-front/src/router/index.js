import { createRouter, createWebHistory } from 'vue-router'

// 라우트 컴포넌트 임포트
import HomePage from '@/views/HomePage.vue'
import SeatAssignment from '@/views/SeatAssignment.vue'
// import About from '@/views/About.vue'

// 라우트 설정
const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/seat-assignment',
    name: 'SeatAssignment',
    component: SeatAssignment,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About,
  // },
]
// 라우터 생성
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
