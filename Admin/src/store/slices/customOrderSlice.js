import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customOrderApi from '../../api/customOrderApi';

export const fetchCustomOrders = createAsyncThunk('customOrders/fetchAll', async (params, { rejectWithValue }) => {
  try { return await customOrderApi.getAll(params); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchCustomOrderById = createAsyncThunk('customOrders/fetchById', async (id, { rejectWithValue }) => {
  try { return await customOrderApi.getById(id); } catch (err) { return rejectWithValue(err.message); }
});

export const updateCustomOrder = createAsyncThunk('customOrders/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await customOrderApi.update(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchArtists = createAsyncThunk('customOrders/fetchArtists', async (_, { rejectWithValue }) => {
  try { return await customOrderApi.getArtists(); } catch (err) { return rejectWithValue(err.message); }
});

const customOrderSlice = createSlice({
  name: 'customOrders',
  initialState: { items: [], current: null, artists: [], pagination: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchCustomOrders.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.orders; state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCustomOrderById.pending, (state) => { state.loading = true; })
      .addCase(fetchCustomOrderById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.order; })
      .addCase(fetchCustomOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateCustomOrder.fulfilled, (state, action) => {
        state.current = action.payload.order;
        const idx = state.items.findIndex(o => o._id === action.payload.order._id);
        if (idx > -1) state.items[idx] = action.payload.order;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => { state.artists = action.payload.artists; });
  },
});

export const { clearCurrent } = customOrderSlice.actions;
export default customOrderSlice.reducer;