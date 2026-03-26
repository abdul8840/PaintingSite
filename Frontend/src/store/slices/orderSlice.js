import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    return await orderApi.create(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (params, { rejectWithValue }) => {
  try {
    return await orderApi.getMyOrders(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await orderApi.getById(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const trackOrder = createAsyncThunk('orders/track', async (orderNumber, { rejectWithValue }) => {
  try {
    return await orderApi.track(orderNumber);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    return await orderApi.cancel(id, { reason });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    current: null,
    tracked: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => { state.error = null; },
    clearTracked: (state) => { state.tracked = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.order; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(trackOrder.fulfilled, (state, action) => { state.tracked = action.payload.order; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.current = action.payload.order;
        const idx = state.items.findIndex(o => o._id === action.payload.order._id);
        if (idx > -1) state.items[idx] = action.payload.order;
      });
  },
});

export const { clearOrderError, clearTracked } = orderSlice.actions;
export default orderSlice.reducer;