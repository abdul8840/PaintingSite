import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: null,
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
  },
  reducers: {
    showToast: (state, action) => {
      state.toast = { message: action.payload.message, type: action.payload.type || 'info', id: Date.now() };
    },
    hideToast: (state) => { state.toast = null; },
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    toggleMobileSidebar: (state) => { state.sidebarMobileOpen = !state.sidebarMobileOpen; },
    closeMobileSidebar: (state) => { state.sidebarMobileOpen = false; },
  },
});

export const { showToast, hideToast, toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;