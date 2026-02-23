'use client'

import { useEffect } from 'react'

interface ShortcutMap {
  [key: string]: () => void
}

/**
 * Register global keyboard shortcuts.
 * Key format: "mod+k" (mod = Cmd on Mac, Ctrl on Win/Linux)
 */
export function useKeyboard(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      const key = e.key.toLowerCase()

      for (const [shortcut, callback] of Object.entries(shortcuts)) {
        const parts = shortcut.toLowerCase().split('+')
        const requiresMod = parts.includes('mod')
        const requiresShift = parts.includes('shift')
        const targetKey = parts[parts.length - 1]

        if (
          key === targetKey &&
          (!requiresMod || isMod) &&
          (!requiresShift || e.shiftKey)
        ) {
          e.preventDefault()
          callback()
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}
