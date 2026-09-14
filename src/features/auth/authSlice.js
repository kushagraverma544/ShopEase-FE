import { createSlice } from '@reduxjs/toolkit';

// Persisted to localStorage (see authStorage.js) so a page refresh doesn't
// log the user out mid-session — the auth API contract flags this as an
// accepted tradeoff for now (ideally memory/httpOnly cookie, localStorage
// carries XSS risk).
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { username, accessToken, refreshToken } = action.payload;
      state.user = { username, fullName: null };
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    userLoggedOut() {
      return initialState;
    },
    // /auth/login only returns tokens — fullName comes from GET /me, fetched
    // separately (Header) or after an AccountPage edit, and synced in here
    // so header display stays current without re-fetching everywhere.
    userProfileUpdated(state, action) {
      if (state.user) state.user.fullName = action.payload.fullName;
    },
  },
});

export const { userLoggedIn, userLoggedOut, userProfileUpdated } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;

export default authSlice.reducer;
