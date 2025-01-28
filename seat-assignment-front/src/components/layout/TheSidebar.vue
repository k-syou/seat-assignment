<template>
  <aside class="sidebar">
    <button class="toggle-sidebar" @click="$emit('toggle')">
      {{ isOpen ? '◀' : '▶' }}
    </button>
    <nav class="sidebar-nav">
      <ul>
        <li><router-link to="/dashboard">대시보드</router-link></li>
        <li><router-link to="/profile">프로필</router-link></li>
        <!-- 기타 메뉴 항목들 -->
      </ul>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['toggle'])
</script>
