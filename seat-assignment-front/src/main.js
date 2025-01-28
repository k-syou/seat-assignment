import './styles/main.css'
// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)
app.use(router)

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.timeout = 5000  // 타임아웃 설정

app.mount('#app')
