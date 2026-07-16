import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import customersReducer from './slices/customersSlice'
import leadsReducer from './slices/leadsSlice'
import salesReducer from './slices/salesSlice'
import notificationsReducer from './slices/notificationsSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    customers: customersReducer,
    leads: leadsReducer,
    sales: salesReducer,
    notifications: notificationsReducer,
  },
})
