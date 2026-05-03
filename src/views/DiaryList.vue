<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchDiaries } from '../api/diary'
import type { DiaryItem } from '../api/diary'

const route = useRoute()
const router = useRouter()

const diaries = ref<DiaryItem[]>([])
const total = ref(0)
const page = ref(Number(route.query.page) || 1)
const pageSize = 5
const maxPages = 5
const loading = ref(false)
const error = ref<string | null>(null)

function totalPages(): number {
  return Math.min(Math.ceil(total.value / pageSize), maxPages)
}

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const data = await fetchDiaries(page.value, pageSize)
    diaries.value = data.items || []
    total.value = data.total || 0
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

function goPage(p: number): void {
  if (p < 1 || p > totalPages()) return
  router.push({ query: { page: String(p) } })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function truncate(text: string, len = 120): string {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

watch(() => route.query.page, (val) => {
  const p = Number(val) || 1
  if (p !== page.value) {
    page.value = p
    load()
  }
})

onMounted(load)
</script>

<template>
  <div class="diary-list">
    <div v-if="loading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <template v-else>
      <article
        v-for="item in diaries"
        :key="item.id"
        class="diary-card"
        @click="router.push(`/diary/${item.id}?page=${page}`)"
      >
        <div class="diary-meta">
          <time>{{ formatDate(item.create_at) }}</time>
        </div>
        <h2 class="diary-title">{{ item.title }}</h2>
        <p class="diary-preview">{{ truncate(item.content) }}</p>
      </article>

      <div v-if="diaries.length === 0" class="state-msg">No entries yet.</div>

      <nav v-if="totalPages() > 1" class="pagination">
        <button :disabled="page <= 1" @click="goPage(page - 1)">Prev</button>
        <span class="page-info">{{ page }} / {{ totalPages() }}</span>
        <button :disabled="page >= totalPages()" @click="goPage(page + 1)">Next</button>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.diary-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.diary-card {
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s;
}

.diary-card:first-child {
  padding-top: 0;
}

.diary-card:hover {
  background: var(--accent-bg);
  margin: 0 -12px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 8px;
}

.diary-meta {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 6px;
}

.diary-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 8px;
  line-height: 1.4;
}

.diary-preview {
  font-size: 15px;
  color: var(--text);
  line-height: 1.6;
}

.state-msg {
  text-align: center;
  padding: 48px 0;
  color: var(--text);
}

.state-msg.error {
  color: #ef4444;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 32px 0 8px;
}

.pagination button {
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: var(--accent);
  color: #fff;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--text);
  font-family: var(--mono);
}
</style>
