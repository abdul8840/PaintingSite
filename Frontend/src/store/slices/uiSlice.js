import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: null,
    mobileMenuOpen: false,
    searchOpen: false,
  },
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info', // success, error, info, warning
        id: Date.now(),
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
  },
});

export const { showToast, hideToast, toggleMobileMenu, closeMobileMenu, toggleSearch } = uiSlice.actions;
export default uiSlice.reducer;