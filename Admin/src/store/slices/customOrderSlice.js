import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customOrderApi from '../../api/customOrderApi';

// For admin - fetch all orders
export const fetchCustomOrders = createAsyncThunk(
  'customOrders/fetchAll', 
  async (params, { rejectWithValue }) => {
    try { 
      console.log('Fetching orders with params:', params);
      const response = await customOrderApi.getAllAdmin(params);
      console.log('API Response:', response);
      return response; 
    } catch (err) { 
      console.error('Fetch error:', err);
      return rejectWithValue(err.message || 'Failed to fetch orders'); 
    }
  }
);

// For user - fetch my orders
export const fetchMyCustomOrders = createAsyncThunk(
  'customOrders/fetchMyOrders', 
  async (params, { rejectWithValue }) => {
    try { 
      console.log('Fetching my orders with params:', params);
      const response = await customOrderApi.getMyOrders(params);
      console.log('API Response:', response);
      return response; 
    } catch (err) { 
      console.error('Fetch error:', err);
      return rejectWithValue(err.message || 'Failed to fetch my orders'); 
    }
  }
);

export const fetchCustomOrderById = createAsyncThunk(
  'customOrders/fetchById', 
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }
      console.log('Fetching order by ID:', id);
      const response = await customOrderApi.getById(id);
      console.log('API Response:', response);
      return response;
    } catch (err) {
      console.error('Fetch by ID error:', err);
      return rejectWithValue(err.message || 'Failed to fetch order');
    }
  }
);

export const updateCustomOrder = createAsyncThunk(
  'customOrders/update', 
  async ({ id, data }, { rejectWithValue }) => {
    try { 
      if (!id) {
        throw new Error('Order ID is required for update');
      }
      console.log('Updating order:', id, data);
      const response = await customOrderApi.updateAdmin(id, data);
      console.log('Update response:', response);
      return response; 
    } catch (err) { 
      console.error('Update error:', err);
      return rejectWithValue(err.message || 'Update failed'); 
    }
  }
);

export const requestOrderRevision = createAsyncThunk(
  'customOrders/requestRevision', 
  async ({ id, notes }, { rejectWithValue }) => {
    try { 
      if (!id) {
        throw new Error('Order ID is required');
      }
      return await customOrderApi.requestRevision(id, notes); 
    } catch (err) { 
      return rejectWithValue(err.message || 'Revision request failed'); 
    }
  }
);

export const approveOrder = createAsyncThunk(
  'customOrders/approve', 
  async (id, { rejectWithValue }) => {
    try { 
      if (!id) {
        throw new Error('Order ID is required');
      }
      return await customOrderApi.approveOrder(id); 
    } catch (err) { 
      return rejectWithValue(err.message || 'Approval failed'); 
    }
  }
);

export const fetchArtists = createAsyncThunk(
  'customOrders/fetchArtists', 
  async (_, { rejectWithValue }) => {
    try { 
      const response = await customOrderApi.getArtists();
      return response; 
    } catch (err) { 
      return rejectWithValue(err.message || 'Failed to fetch artists'); 
    }
  }
);

const customOrderSlice = createSlice({
  name: 'customOrders',
  initialState: {
    items: [],
    current: null,
    artists: [],
    pagination: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.items = [];
      state.pagination = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all (admin)
      .addCase(fetchCustomOrders.pending, (state) => { 
        console.log('fetchCustomOrders pending');
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchCustomOrders.fulfilled, (state, action) => {
        console.log('fetchCustomOrders fulfilled:', action.payload);
        state.loading = false;
        state.items = action.payload.orders || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchCustomOrders.rejected, (state, action) => {
        console.log('fetchCustomOrders rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.pagination = null;
      })
      // Fetch my orders (user)
      .addCase(fetchMyCustomOrders.pending, (state) => { 
        console.log('fetchMyCustomOrders pending');
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchMyCustomOrders.fulfilled, (state, action) => {
        console.log('fetchMyCustomOrders fulfilled:', action.payload);
        state.loading = false;
        state.items = action.payload.orders || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchMyCustomOrders.rejected, (state, action) => {
        console.log('fetchMyCustomOrders rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.pagination = null;
      })
      // Fetch by ID
      .addCase(fetchCustomOrderById.pending, (state) => { 
        console.log('fetchCustomOrderById pending');
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchCustomOrderById.fulfilled, (state, action) => {
        console.log('fetchCustomOrderById fulfilled:', action.payload);
        state.loading = false;
        state.current = action.payload.order || null;
      })
      .addCase(fetchCustomOrderById.rejected, (state, action) => {
        console.log('fetchCustomOrderById rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.current = null;
      })
      // Update
      .addCase(updateCustomOrder.pending, (state) => { 
        state.updating = true;
        state.error = null; 
      })
      .addCase(updateCustomOrder.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload.order) {
          state.current = action.payload.order;
          const idx = state.items.findIndex(o => o._id === action.payload.order._id);
          if (idx > -1) state.items[idx] = action.payload.order;
        }
      })
      .addCase(updateCustomOrder.rejected, (state, action) => { 
        state.updating = false;
        state.error = action.payload; 
      })
      // Request Revision
      .addCase(requestOrderRevision.pending, (state) => {
        state.updating = true;
      })
      .addCase(requestOrderRevision.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload.order) {
          state.current = action.payload.order;
          const idx = state.items.findIndex(o => o._id === action.payload.order._id);
          if (idx > -1) state.items[idx] = action.payload.order;
        }
      })
      .addCase(requestOrderRevision.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Approve Order
      .addCase(approveOrder.pending, (state) => {
        state.updating = true;
      })
      .addCase(approveOrder.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload.order) {
          state.current = action.payload.order;
          const idx = state.items.findIndex(o => o._id === action.payload.order._id);
          if (idx > -1) state.items[idx] = action.payload.order;
        }
      })
      .addCase(approveOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Artists
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.artists = action.payload.artists || [];
      });
  },
});

export const { clearCurrent, clearError, clearOrders } = customOrderSlice.actions;
export default customOrderSlice.reducer;