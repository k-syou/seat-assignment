<template>
  <TheLayout>
    <router-view />
  </TheLayout>
</template>

<script setup>
import TheLayout from '@/components/layout/TheLayout.vue'
</script>

<style>
/* 전역 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* 라우터 트랜지션 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
