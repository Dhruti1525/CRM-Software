import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const PIPELINE_STAGES = [
  { key: 'new', label: 'New', color: '#8D7CFF' },
  { key: 'contacted', label: 'Contacted', color: '#14B8A6' },
  { key: 'proposal', label: 'Proposal', color: '#F59E0B' },
  { key: 'negotiation', label: 'Negotiation', color: '#F97316' },
  { key: 'won', label: 'Won', color: '#16A34A' },
  { key: 'lost', label: 'Lost', color: '#F43F5E' },
]

const OWNER_POOL = ['Ava Reyes', 'Noah Kim', 'Priya Nair', 'Leo Marsh', 'Mia Chen', 'Ethan Cole']
const SOURCE_POOL = ['Referral', 'Website', 'Cold Outreach', 'Event', 'Partner', 'Inbound']

const deriveDeal = (product) => {
  const seed = product.id
  const stage = PIPELINE_STAGES[seed % PIPELINE_STAGES.length]
  return {
    id: product.id,
    name: product.title,
    company: product.brand || 'Unbranded Co.',
    value: Math.round(product.price * 12.5),
    stage: stage.key,
    stageLabel: stage.label,
    stageColor: stage.color,
    owner: OWNER_POOL[seed % OWNER_POOL.length],
    source: SOURCE_POOL[seed % SOURCE_POOL.length],
    probability: Math.min(95, (product.rating || 3) * 20),
    thumbnail: product.thumbnail,
    category: product.category,
    createdAt: product.meta?.createdAt || null,
  }
}

export const fetchLeads = createAsyncThunk(
  'leads/fetch',
  async ({ page = 1, limit = 10, query = '' } = {}, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * limit
      const url = query
        ? `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        : `/products?limit=${limit}&skip=${skip}`
      const res = await api.get(url)
      return {
        items: res.data.products.map(deriveDeal),
        total: res.data.total,
        page,
        limit,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Pulls a larger batch for the Kanban pipeline board (needs all stages visible at once)
export const fetchPipeline = createAsyncThunk(
  'leads/fetchPipeline',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/products?limit=60')
      return res.data.products.map(deriveDeal)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    query: '',
    status: 'idle',
    pipeline: [],
    pipelineStatus: 'idle',
    error: null,
  },
  reducers: {
    setLeadQuery(state, action) {
      state.query = action.payload
      state.page = 1
    },
    setLeadPage(state, action) {
      state.page = action.payload
    },
    moveDeal(state, action) {
      const { id, stageKey } = action.payload
      const stage = PIPELINE_STAGES.find((s) => s.key === stageKey)
      const deal = state.pipeline.find((d) => d.id === id)
      if (deal && stage) {
        deal.stage = stage.key
        deal.stageLabel = stage.label
        deal.stageColor = stage.color
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchPipeline.pending, (state) => {
        state.pipelineStatus = 'loading'
      })
      .addCase(fetchPipeline.fulfilled, (state, action) => {
        state.pipelineStatus = 'succeeded'
        state.pipeline = action.payload
      })
      .addCase(fetchPipeline.rejected, (state) => {
        state.pipelineStatus = 'failed'
      })
  },
})

export const { setLeadQuery, setLeadPage, moveDeal } = leadsSlice.actions
export default leadsSlice.reducer
