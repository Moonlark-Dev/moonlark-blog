interface DiaryItem {
  id: number
  title: string
  content: string
  create_at: string
}

interface DiaryResponse {
  items: DiaryItem[]
  total: number
  page: number
  page_size: number
}

const API_BASE = import.meta.env.VITE_API_BASE

export async function fetchDiaries(page = 1, pageSize = 10): Promise<DiaryResponse> {
  const url = `${API_BASE}?page=${page}&page_size=${pageSize}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export type { DiaryItem, DiaryResponse }
