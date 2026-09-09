import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarHovered: false,
  mobileDrawerOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    sidebarHoverStarted(state) {
      state.sidebarHovered = true;
    },
    sidebarHoverEnded(state) {
      state.sidebarHovered = false;
    },
    mobileDrawerOpened(state) {
      state.mobileDrawerOpen = true;
    },
    mobileDrawerClosed(state) {
      state.mobileDrawerOpen = false;
    },
    mobileDrawerToggled(state) {
      state.mobileDrawerOpen = !state.mobileDrawerOpen;
    },
  },
});

export const {
  sidebarHoverStarted,
  sidebarHoverEnded,
  mobileDrawerOpened,
  mobileDrawerClosed,
  mobileDrawerToggled,
} = uiSlice.actions;

export const selectSidebarHovered = (state) => state.ui.sidebarHovered;
export const selectMobileDrawerOpen = (state) => state.ui.mobileDrawerOpen;

export default uiSlice.reducer;
