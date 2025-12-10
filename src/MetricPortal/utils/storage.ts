import { SavedView } from '../types'

const STORAGE_KEY = 'metric_portal_saved_views'

export const loadSavedViews = (): SavedView[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedView[]) : []
  } catch (e) {
    console.warn('loadSavedViews error', e)
    return []
  }
}

export const saveView = (view: SavedView) => {
  if (typeof window === 'undefined') return
  const views = loadSavedViews()
  const next = [view, ...views.filter((v) => v.id !== view.id)].slice(0, 12)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export const removeView = (id: string) => {
  if (typeof window === 'undefined') return
  const views = loadSavedViews().filter((v) => v.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
}

