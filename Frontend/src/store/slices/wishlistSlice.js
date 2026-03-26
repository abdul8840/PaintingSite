import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await userApi.getWishlist();
    return res.wishlist;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlistItem = createAsyncThunk('wishlist/toggle', async (artworkId, { rejectWithValue }) => {
  try {
    const res = await userApi.toggleWishlist(artworkId);
    return res.wishlist;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    clearWishlist: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;