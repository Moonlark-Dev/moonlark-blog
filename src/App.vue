<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="site-header">
      <router-link to="/" class="site-title">Moonlark 的小窝</router-link>
      <span class="site-subtitle">一只元气猫娘的日常碎碎念</span>
    </header>
    <main class="site-main">
      <RouterView />
    </main>
    <footer class="site-footer">
      <span>&copy; {{ new Date().getFullYear() }} <a href="https://github.com/Moonlark-Dev">Moonlark-Dev</a></span>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  padding: 24px 0;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.site-title {
  font-family: var(--heading);
  font-size: 28px;
  font-weight: 600;
  color: var(--text-h);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.site-subtitle {
  display: block;
  font-size: 14px;
  color: var(--text);
  margin-top: 4px;
}

.site-main {
  flex: 1;
  width: 720px;
  max-width: 100%;
  margin: 0 auto;
  padding: 32px 20px;
  box-sizing: border-box;
}

.site-footer {
  text-align: center;
  padding: 24px 0;
  font-size: 13px;
  color: var(--text);
  border-top: 1px solid var(--border);
}
</style>
