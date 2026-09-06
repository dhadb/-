import React, { memo } from 'react'
import { BookOpen, ClipboardPaste, FolderOpen, BarChart3, Settings2, Maximize2, Star } from 'lucide-react'
import { useClipboardStore, type ActiveTab, type ViewMode } from '../store/clipboardStore'
import { useI18n } from '../i18n'

const WorkspaceRail: React.FC = memo(() => {
  const activeTab = useClipboardStore(state => state.activeTab)
  const viewMode = useClipboardStore(state => state.viewMode)
  const setActiveTab = useClipboardStore(state => state.setActiveTab)
  const setViewMode = useClipboardStore(state => state.setViewMode)
  const { t } = useI18n()

  const select = (mode: ViewMode, tab: ActiveTab) => {
    setViewMode(mode)
    setActiveTab(tab)
    void window.electronAPI?.setWindowMode(mode)
  }

  const items: Array<{ mode: ViewMode; tab: ActiveTab; label: string; Icon: typeof BookOpen }> = [
    { mode: 'quick', tab: 'history', label: t('workspace.quick'), Icon: ClipboardPaste },
    { mode: 'library', tab: 'history', label: t('workspace.library'), Icon: BookOpen },
    { mode: 'library', tab: 'favorites', label: t('tabs.favorites'), Icon: Star },
    { mode: 'library', tab: 'collections', label: t('tabs.collections'), Icon: FolderOpen },
    { mode: 'library', tab: 'stats', label: t('tabs.stats'), Icon: BarChart3 },
    { mode: 'library', tab: 'settings', label: t('title.settings'), Icon: Settings2 },
  ]

  return (
    <aside className="workspace-rail" aria-label={t('workspace.navigation')}>
      <div className="workspace-rail-brand">
        <span className="workspace-rail-mark">C</span>
        <span className="workspace-rail-word">ClipMaster</span>
      </div>
      <nav className="workspace-rail-nav">
        {items.map(({ mode, tab, label, Icon }) => {
          const active = viewMode === mode && activeTab === tab
          return (
            <button
              key={`${mode}-${tab}`}
              type="button"
              className={`workspace-rail-item ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
              title={label}
              onClick={() => select(mode, tab)}
            >
              <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        className="workspace-rail-item workspace-rail-expand"
        title={t('workspace.expand')}
        onClick={() => select('library', activeTab === 'settings' ? 'settings' : 'history')}
      >
        <Maximize2 size={15} />
        <span>{t('workspace.expand')}</span>
      </button>
    </aside>
  )
})

WorkspaceRail.displayName = 'WorkspaceRail'
export default WorkspaceRail
