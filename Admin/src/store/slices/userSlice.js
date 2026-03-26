import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try { return await userApi.getAll(params); } catch (err) { return rejectWithValue(err.message); }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await userApi.update(id, data); } catch (err) { return rejectWithValue(err.message); }
});

const userSlice = createSlice({
  name: 'users',
  initialState: { items: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.users; state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex(u => u._id === action.payload.user._id);
        if (idx > -1) state.items[idx] = action.payload.user;
      });
  },
});

export default userSlice.reducer;