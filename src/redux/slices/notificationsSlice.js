import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

// DummyJSON has no dedicated CRM-notification endpoint, so we build a realistic
// activity feed from live todos/products data and shape it into CRM-style events.
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [todosRes, productsRes] = await Promise.all([
        api.get('/todos?limit=5'),
        api.get('/products?limit=4&skip=8'),
      ])

      const templates = [
        (t) => ({ title: 'Follow-up due', body: t, type: 'task' }),
        (p) => ({ title: 'Deal stage changed', body: `${p.title} moved to Proposal`, type: 'deal' }),
      ]

      const fromTodos = todosRes.data.todos.map((t, i) => ({
        id: `todo-${t.id}`,
        title: t.completed ? 'Task completed' : 'Follow-up due',
        body: t.todo,
        type: t.completed ? 'success' : 'task',
        time: `${(i + 1) * 8}m ago`,
        read: t.completed,
      }))

      const fromProducts = productsRes.data.products.map((p, i) => ({
        id: `deal-${p.id}`,
        title: 'Pipeline update',
        body: `${p.title} deal was updated`,
        type: 'deal',
        time: `${(i + 1) * 45}m ago`,
        read: false,
      }))

      return [...fromProducts, ...fromTodos]
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true))
    },
    markOneRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload)
      if (item) item.read = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { markAllRead, markOneRead } = notificationsSlice.actions
export default notificationsSlice.reducer
