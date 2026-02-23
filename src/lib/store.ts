import { create } from 'zustand'

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // AI Chat Panel
  aiChatOpen: boolean
  toggleAIChat: () => void
  setAIChatOpen: (open: boolean) => void

  // Command Palette
  commandPaletteOpen: boolean
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void

  // Notifications Panel
  notificationsPanelOpen: boolean
  toggleNotificationsPanel: () => void

  // Quick Event Creation
  quickEventOpen: boolean
  setQuickEventOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // AI Chat
  aiChatOpen: false,
  toggleAIChat: () => set((s) => ({ aiChatOpen: !s.aiChatOpen })),
  setAIChatOpen: (open) => set({ aiChatOpen: open }),

  // Command Palette
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Notifications
  notificationsPanelOpen: false,
  toggleNotificationsPanel: () => set((s) => ({ notificationsPanelOpen: !s.notificationsPanelOpen })),

  // Quick Event
  quickEventOpen: false,
  setQuickEventOpen: (open) => set({ quickEventOpen: open }),
}))
