import { createSlice } from '@reduxjs/toolkit'

const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('orbit-theme') : null
const prefersDark =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

const initialState = {
  darkMode: storedTheme ? storedTheme === 'dark' : prefersDark,
  sidebarCollapsed: false, // desktop rail collapse
  sidebarMobileOpen: false, // mobile drawer
  notificationsOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
      if (typeof window !== 'undefined') {
        localStorage.setItem('orbit-theme', state.darkMode ? 'dark' : 'light')
      }
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    openMobileSidebar(state) {
      state.sidebarMobileOpen = true
    },
    closeMobileSidebar(state) {
      state.sidebarMobileOpen = false
    },
    toggleNotifications(state) {
      state.notificationsOpen = !state.notificationsOpen
    },
    closeNotifications(state) {
      state.notificationsOpen = false
    },
  },
})

export const {
  toggleDarkMode,
  toggleSidebarCollapsed,
  openMobileSidebar,
  closeMobileSidebar,
  toggleNotifications,
  closeNotifications,
} = uiSlice.actions

export default uiSlice.reducer
