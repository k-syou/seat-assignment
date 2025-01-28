<template>
  <div class="layout">
    <TheHeader />
    <div class="layout-content">
      <!-- <button class="toggle-sidebar" @click="toggleSidebar">
        {{ showSidebar ? '◀' : '▶' }}
      </button>
      <TheSidebar v-show="showSidebar" :class="{ hidden: !showSidebar }" :is-open="showSidebar" /> -->
      <main class="main-content" :style="{ marginLeft: showSidebar ? '250px' : '0' }">
        <slot></slot>
      </main>
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
// import TheSidebar from './TheSidebar.vue'
import { ref } from 'vue'

// 사이드바 표시 여부 설정
const showSidebar = ref(false)
// const toggleSidebar = () => {
//   showSidebar.value = !showSidebar.value
// }
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
}
</style>
