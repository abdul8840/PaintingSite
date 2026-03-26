import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artworkApi from '../../api/artworkApi';

export const fetchArtworks = createAsyncThunk('artworks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await artworkApi.getAll(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchArtworkBySlug = createAsyncThunk('artworks/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    return await artworkApi.getBySlug(slug);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchFeaturedArtworks = createAsyncThunk('artworks/fetchFeatured', async (limit, { rejectWithValue }) => {
  try {
    return await artworkApi.getFeatured(limit);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchRelatedArtworks = createAsyncThunk('artworks/fetchRelated', async (id, { rejectWithValue }) => {
  try {
    return await artworkApi.getRelated(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchFilterOptions = createAsyncThunk('artworks/fetchFilters', async (_, { rejectWithValue }) => {
  try {
    return await artworkApi.getFilterOptions();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const artworkSlice = createSlice({
  name: 'artworks',
  initialState: {
    items: [],
    featured: [],
    related: [],
    current: null,
    pagination: null,
    filters: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentArtwork: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => { state.loading = true; })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.artworks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchArtworkBySlug.pending, (state) => { state.detailLoading = true; })
      .addCase(fetchArtworkBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.artwork;
      })
      .addCase(fetchArtworkBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedArtworks.fulfilled, (state, action) => {
        state.featured = action.payload.artworks;
      })
      .addCase(fetchRelatedArtworks.fulfilled, (state, action) => {
        state.related = action.payload.artworks;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filters = action.payload.filters;
      });
  },
});

export const { clearCurrentArtwork } = artworkSlice.actions;
export default artworkSlice.reducer;