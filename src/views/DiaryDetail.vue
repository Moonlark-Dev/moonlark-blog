<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchDiaries } from '../api/diary'
import type { DiaryItem } from '../api/diary'

const route = useRoute()
const router = useRouter()

const diary = ref<DiaryItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

onMounted(async () => {
  const id = Number(route.params.id)
  loading.value = true
  try {
    const data = await fetchDiaries(1, 100)
    const found = (data.items || []).find((d) => d.id === id)
    if (found) {
      diary.value = found
    } else {
      error.value = 'Entry not found'
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

function goBack(): void {
  const p = route.query.page
  router.push(p ? `/?page=${p}` : '/')
}
</script>

<template>
  <div class="diary-detail">
    <button class="back-btn" @click="goBack">&larr; Back</button>

    <div v-if="loading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <article v-else-if="diary">
      <div class="detail-meta">
        <time>{{ formatDate(diary.create_at) }}</time>
      </div>
      <h1 class="detail-title">{{ diary.title }}</h1>
      <div class="detail-content">{{ diary.content }}</div>
    </article>
  </div>
</template>

<style scoped>
.diary-detail {
  max-width: 640px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
}

.back-btn:hover {
  text-decoration: underline;
}

.detail-meta {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 12px;
}

.detail-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 24px;
  line-height: 1.35;
  letter-spacing: -0.5px;
}

.detail-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.state-msg {
  text-align: center;
  padding: 48px 0;
  color: var(--text);
}

.state-msg.error {
  color: #ef4444;
}
</style>
