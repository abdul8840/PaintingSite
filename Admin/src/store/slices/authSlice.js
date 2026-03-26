import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

export const loginAdmin = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data);
    if (res.user.role !== 'admin') {
      throw { message: 'Access denied. Admin only.' };
    }
    return res.user;
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const logoutAdmin = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
  return null;
});

export const checkAuthStatus = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.checkAuth();
    if (res.user.role !== 'admin') {
      throw { message: 'Not admin' };
    }
    return res.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    authChecked: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true; state.authChecked = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null; state.isAuthenticated = false; state.authChecked = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload; state.isAuthenticated = true; state.authChecked = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null; state.isAuthenticated = false; state.authChecked = true;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;