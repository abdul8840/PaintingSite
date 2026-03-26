import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../api/couponApi';

export const fetchCoupons = createAsyncThunk('coupons/fetchAll', async (_, { rejectWithValue }) => {
  try { return await couponApi.getAll(); } catch (err) { return rejectWithValue(err.message); }
});

export const createCoupon = createAsyncThunk('coupons/create', async (data, { rejectWithValue }) => {
  try { return await couponApi.create(data); } catch (err) { return rejectWithValue(err.message); }
});

export const updateCoupon = createAsyncThunk('coupons/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await couponApi.update(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteCoupon = createAsyncThunk('coupons/delete', async (id, { rejectWithValue }) => {
  try { await couponApi.delete(id); return id; } catch (err) { return rejectWithValue(err.message); }
});

const couponSlice = createSlice({
  name: 'coupons',
  initialState: { items: [], loading: false, formLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => { state.loading = true; })
      .addCase(fetchCoupons.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.coupons; })
      .addCase(fetchCoupons.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createCoupon.pending, (state) => { state.formLoading = true; })
      .addCase(createCoupon.fulfilled, (state, action) => { state.formLoading = false; state.items.unshift(action.payload.coupon); })
      .addCase(createCoupon.rejected, (state, action) => { state.formLoading = false; state.error = action.payload; })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c._id === action.payload.coupon._id);
        if (idx > -1) state.items[idx] = action.payload.coupon;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  },
});

export default couponSlice.reducer;