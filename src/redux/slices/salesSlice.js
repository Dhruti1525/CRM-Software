import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchSales = createAsyncThunk('sales/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/carts?limit=30')
    return res.data.carts
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    carts: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.carts = action.payload
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default salesSlice.reducer
