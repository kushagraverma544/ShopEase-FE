import { createSlice } from '@reduxjs/toolkit';

// Persisted to localStorage (see authStorage.js) so a page refresh doesn't
// log the user out mid-session — the auth API contract flags this as an
// accepted tradeoff for now (ideally memory/httpOnly cookie, localStorage
// carries XSS risk).
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { username, accessToken, refreshToken, expiresAt } = action.payload;
      state.user = { username };
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
    },
    userLoggedOut() {
      return initialState;
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;

export default authSlice.reducer;
