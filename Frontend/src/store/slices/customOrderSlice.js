import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customOrderApi from '../../api/customOrderApi';

export const fetchCustomOrderOptions = createAsyncThunk('customOrders/fetchOptions', async (_, { rejectWithValue }) => {
  try {
    return await customOrderApi.getOptions();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const calculateCustomPrice = createAsyncThunk('customOrders/calculatePrice', async (data, { rejectWithValue }) => {
  try {
    return await customOrderApi.calculatePrice(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createCustomOrder = createAsyncThunk('customOrders/create', async (data, { rejectWithValue }) => {
  try {
    return await customOrderApi.create(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMyCustomOrders = createAsyncThunk('customOrders/fetchMy', async (params, { rejectWithValue }) => {
  try {
    return await customOrderApi.getMyOrders(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCustomOrderById = createAsyncThunk('customOrders/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await customOrderApi.getById(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const customOrderSlice = createSlice({
  name: 'customOrders',
  initialState: {
    items: [],
    current: null,
    options: null,
    pricing: null,
    pagination: null,
    loading: false,
    pricingLoading: false,
    error: null,
  },
  reducers: {
    clearPricing: (state) => { state.pricing = null; },
    clearCustomOrderError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomOrderOptions.fulfilled, (state, action) => { state.options = action.payload.options; })
      .addCase(calculateCustomPrice.pending, (state) => { state.pricingLoading = true; })
      .addCase(calculateCustomPrice.fulfilled, (state, action) => {
        state.pricingLoading = false;
        state.pricing = action.payload.pricing;
      })
      .addCase(calculateCustomPrice.rejected, (state) => { state.pricingLoading = false; })
      .addCase(createCustomOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCustomOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(createCustomOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyCustomOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyCustomOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyCustomOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCustomOrderById.pending, (state) => { state.loading = true; })
      .addCase(fetchCustomOrderById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.order; })
      .addCase(fetchCustomOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearPricing, clearCustomOrderError } = customOrderSlice.actions;
export default customOrderSlice.reducer;