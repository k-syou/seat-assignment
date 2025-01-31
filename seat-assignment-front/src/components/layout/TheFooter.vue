<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <p>2025.1. All rights reserved.</p>
        <p>ksyou가 작성하고 만든 사이트</p>
      </div>
      <div class="footer-links">
        <a href="https://github.com/ksyou" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  background-color: #EFDBCB; /* 푸른 계열의 배경색 */
  color: #555; /* 텍스트 색상 */
}

.footer-content {
  text-align: center;
}

.footer-info,
.footer-links {
  margin: 0;
}

.footer-info p {
  font-size: small;
}

.footer-links a {
  color: #333; /* 링크 텍스트 색상 */
  text-decoration: none;
  margin-left: 10px;
  font-size: smaller
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>