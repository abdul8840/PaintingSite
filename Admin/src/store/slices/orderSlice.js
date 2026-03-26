import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
  try { return await orderApi.getAll(params); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try { return await orderApi.getById(id); } catch (err) { return rejectWithValue(err.message); }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, data }, { rejectWithValue }) => {
  try { return await orderApi.updateStatus(id, data); } catch (err) { return rejectWithValue(err.message); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { items: [], current: null, pagination: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.orders; state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.order; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.current = action.payload.order;
        const idx = state.items.findIndex(o => o._id === action.payload.order._id);
        if (idx > -1) state.items[idx] = action.payload.order;
      });
  },
});

export const { clearCurrent } = orderSlice.actions;
export default orderSlice.reducer;