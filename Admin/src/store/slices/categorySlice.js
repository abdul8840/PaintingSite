import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../api/categoryApi';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try { return await categoryApi.getAll(); } catch (err) { return rejectWithValue(err.message); }
});

export const createCategory = createAsyncThunk('categories/create', async (data, { rejectWithValue }) => {
  try { return await categoryApi.create(data); } catch (err) { return rejectWithValue(err.message); }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await categoryApi.update(id, data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try { await categoryApi.delete(id); return id; } catch (err) { return rejectWithValue(err.message); }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, formLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.categories; })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createCategory.pending, (state) => { state.formLoading = true; })
      .addCase(createCategory.fulfilled, (state, action) => { state.formLoading = false; state.items.push(action.payload.category); })
      .addCase(createCategory.rejected, (state, action) => { state.formLoading = false; state.error = action.payload; })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c._id === action.payload.category._id);
        if (idx > -1) state.items[idx] = action.payload.category;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;