import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '../../api/dashboardApi';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await dashboardApi.getStats();
    return res.stats;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default dashboardSlice.reducer;