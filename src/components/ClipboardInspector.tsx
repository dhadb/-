import React, { memo, useMemo } from 'react'
import { Check, Copy, ExternalLink, Heart, Maximize2, Pin, PinOff } from 'lucide-react'
import { useClipboardStore } from '../store/clipboardStore'
import { useI18n } from '../i18n'
import ImagePreview from './ImagePreview'

const ClipboardInspector: React.FC = memo(() => {
  const history = useClipboardStore(state => state.history)
  const selectedId = useClipboardStore(state => state.selectedId)
  const copiedId = useClipboardStore(state => state.copiedId)
  const copyItem = useClipboardStore(state => state.copyItem)
  const togglePin = useClipboardStore(state => state.togglePin)
  const toggleFavorite = useClipboardStore(state => state.toggleFavorite)
  const setDetailItemId = useClipboardStore(state => state.setDetailItemId)
  const { t, typeLabel, language } = useI18n()

  const item = useMemo(() => history.find(entry => entry.id === selectedId), [history, selectedId])
  const formatter = useMemo(
    () => new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }),
    [language],
  )

  if (!item) {
    return (
      <aside className="clipboard-inspector clipboard-inspector-empty" aria-label={t('workspace.inspector')}>
        <Maximize2 size={20} />
        <p>{t('workspace.selectItem')}</p>
      </aside>
    )
  }

  const copied = copiedId === item.id
  const canOpen = item.type === 'link' || item.type === 'email'
  const open = () => {
    if (item.type === 'link') void window.electronAPI?.openExternalUrl(item.content)
    if (item.type === 'email') void window.electronAPI?.openExternalUrl(`mailto:${item.content.trim()}`)
  }

  return (
    <aside className="clipboard-inspector" aria-label={t('workspace.inspector')}>
      <header className="clipboard-inspector-header">
        <div>
          <span className="clipboard-inspector-kicker">{typeLabel(item.type)}</span>
          <h2>{t('workspace.inspector')}</h2>
        </div>
        <button className="action-btn" onClick={() => setDetailItemId(item.id)} title={t('detail.title')}>
          <Maximize2 size={14} />
        </button>
      </header>

      <div className="clipboard-inspector-body">
        {item.type === 'image' ? (
          <ImagePreview imagePath={item.imagePath} size="detail" />
        ) : (
          <pre className={`clipboard-inspector-content ${item.type === 'code' || item.type === 'json' ? 'font-mono' : ''}`}>
            {item.content}
          </pre>
        )}

        <div className="clipboard-inspector-actions">
          <button className="inspector-primary-action" onClick={() => void copyItem(item.id)}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? t('item.copied') : t('item.copy')}</span>
          </button>
          <button className={`action-btn ${item.pinned ? 'active' : ''}`} onClick={() => void togglePin(item.id)} title={item.pinned ? t('item.unpin') : t('item.pin')}>
            {item.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button className={`action-btn ${item.favorited ? 'active' : ''}`} onClick={() => void toggleFavorite(item.id)} title={item.favorited ? t('item.unfavorite') : t('item.favorite')}>
            <Heart size={14} fill={item.favorited ? 'currentColor' : 'none'} />
          </button>
          {canOpen && <button className="action-btn" onClick={open} title={t('detail.openLink')}><ExternalLink size={14} /></button>}
        </div>

        <dl className="clipboard-inspector-meta">
          <div><dt>{t('workspace.updated')}</dt><dd>{formatter.format(item.timestamp)}</dd></div>
          <div><dt>{t('detail.copies')}</dt><dd>{item.copyCount || 1}</dd></div>
          {item.sourceApplication && <div><dt>{t('workspace.source')}</dt><dd>{item.sourceApplication}</dd></div>}
          {item.workspace && <div><dt>{t('detail.workspace')}</dt><dd>{item.workspace}</dd></div>}
        </dl>

        {item.tags && item.tags.length > 0 && (
          <div className="clipboard-inspector-tags">
            {item.tags.map(tag => <span key={tag}>#{tag}</span>)}
          </div>
        )}
      </div>
    </aside>
  )
})

ClipboardInspector.displayName = 'ClipboardInspector'
export default ClipboardInspector
