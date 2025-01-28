<template>
  <header class="header">
    <div class="logo">
      <router-link to="/">로고</router-link>
    </div>
    <TheNavigation />
    <div class="user-menu">
      <!-- 사용자 메뉴, 로그인 버튼 등 -->
    </div>
  </header>
</template>

<script setup>
import TheNavigation from './TheNavigation.vue'
</script>
