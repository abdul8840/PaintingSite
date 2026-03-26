import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artworkApi from '../../api/artworkApi';

export const fetchArtworks = createAsyncThunk('artworks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await artworkApi.getAll(params);
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchArtworkById = createAsyncThunk('artworks/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await artworkApi.getById(id);
  } catch (err) { return rejectWithValue(err.message); }
});

export const createArtwork = createAsyncThunk('artworks/create', async (data, { rejectWithValue }) => {
  try {
    return await artworkApi.create(data);
  } catch (err) { return rejectWithValue(err.message); }
});

export const updateArtwork = createAsyncThunk('artworks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await artworkApi.update(id, data);
  } catch (err) { return rejectWithValue(err.message); }
});

export const deleteArtwork = createAsyncThunk('artworks/delete', async (id, { rejectWithValue }) => {
  try {
    await artworkApi.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.message); }
});

const artworkSlice = createSlice({
  name: 'artworks',
  initialState: {
    items: [],
    current: null,
    pagination: null,
    loading: false,
    formLoading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => { state.loading = true; })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload.artworks; state.pagination = action.payload.pagination;
      })
      .addCase(fetchArtworks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchArtworkById.pending, (state) => { state.loading = true; })
      .addCase(fetchArtworkById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.artwork; })
      .addCase(fetchArtworkById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createArtwork.pending, (state) => { state.formLoading = true; })
      .addCase(createArtwork.fulfilled, (state) => { state.formLoading = false; })
      .addCase(createArtwork.rejected, (state, action) => { state.formLoading = false; state.error = action.payload; })
      .addCase(updateArtwork.pending, (state) => { state.formLoading = true; })
      .addCase(updateArtwork.fulfilled, (state) => { state.formLoading = false; })
      .addCase(updateArtwork.rejected, (state, action) => { state.formLoading = false; state.error = action.payload; })
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      });
  },
});

export const { clearCurrent, clearError } = artworkSlice.actions;
export default artworkSlice.reducer;