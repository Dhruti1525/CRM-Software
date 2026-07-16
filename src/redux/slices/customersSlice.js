import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

const STATUS_POOL = ['Active', 'Active', 'Active', 'At Risk', 'Churned', 'New']

// Deterministic pseudo-status/value derived from id so data stays stable across refreshes
const deriveExtras = (user) => {
  const seed = user.id
  return {
    status: STATUS_POOL[seed % STATUS_POOL.length],
    lifetimeValue: 1200 + ((seed * 137) % 48000),
    company: user.company?.name || 'Independent',
    avatar: user.image,
  }
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetch',
  async ({ page = 1, limit = 8, query = '' } = {}, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * limit
      const url = query
        ? `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        : `/users?limit=${limit}&skip=${skip}`
      const res = await api.get(url)
      return {
        items: res.data.users.map((u) => ({ ...u, ...deriveExtras(u) })),
        total: res.data.total,
        page,
        limit,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${id}`)
      return { ...res.data, ...deriveExtras(res.data) }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 8,
    query: '',
    status: 'idle',
    error: null,
    selected: null,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload
      state.page = 1
    },
    setPage(state, action) {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.selected = action.payload
      })
  },
})

export const { setQuery, setPage } = customersSlice.actions
export default customersSlice.reducer
