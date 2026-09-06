import React from 'react'
import { Clipboard, Plus, Search, Star, X } from 'lucide-react'
import { useClipboardStore } from '../store/clipboardStore'
import { useI18n } from '../i18n'

const EmptyState: React.FC = () => {
  const activeTab = useClipboardStore(s => s.activeTab)
  const searchQuery = useClipboardStore(s => s.searchQuery)
  const filterType = useClipboardStore(s => s.filterType)
  const timeFilter = useClipboardStore(s => s.timeFilter)
  const resetFilters = useClipboardStore(s => s.resetFilters)
  const setQuickAddOpen = useClipboardStore(s => s.setQuickAddOpen)
  const { t } = useI18n()

  const isSearching = searchQuery.length > 0 || Boolean(filterType) || timeFilter !== 'all'
  const isFavorites = activeTab === 'favorites'

  const MainIcon = isSearching ? Search : isFavorites ? Star : Clipboard
  const title = isSearching ? t('empty.noMatches') : isFavorites ? t('empty.noFavorites') : t('empty.emptyClipboard')
  const desc = isSearching ? t('empty.tryOther') : isFavorites ? t('empty.favoriteHint') : t('empty.firstPasteHint')

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 py-10">
      <div className="relative mb-6 fade-in">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{
            background: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-primary) 8%, transparent)',
          }}>
          <MainIcon size={30} color={isFavorites ? 'var(--color-warning)' : 'var(--color-primary)'} strokeWidth={1.5}
            style={{ opacity: 0.5 }} />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-[260px] fade-in" style={{ animationDelay: '80ms' }}>
        <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
      </div>

      {isSearching && <button onClick={resetFilters} className="mt-6 inline-flex h-9 items-center gap-2 rounded-md px-4 text-[11px] font-medium interactive-chip" style={{ background: 'var(--color-primary)', color: 'white' }}>
        <X size={13} />
        {t('search.reset')}
      </button>}

      {!isSearching && !isFavorites && (
        <div className="mt-6 flex flex-col items-center gap-3 fade-in" style={{ animationDelay: '140ms' }}>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-ghost)' }}>
            <kbd className="rounded border px-1.5 py-1 font-mono" style={{ borderColor: 'var(--border-card)', background: 'var(--bg-surface)' }}>Ctrl + Shift + V</kbd>
            <span>{t('empty.shortcutHint')}</span>
          </div>
          <button onClick={() => setQuickAddOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-md px-4 text-[11px] font-medium interactive-chip" style={{ background: 'var(--color-primary)', color: 'white' }}>
            <Plus size={13} />
            {t('search.addSnippet')}
          </button>
        </div>
      )}
    </div>
  )
}

export default React.memo(EmptyState)
