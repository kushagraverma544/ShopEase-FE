import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { logout as logoutRequest } from '../../services/authService';
import { selectRefreshToken, userLoggedOut } from './authSlice';

// Clears the session locally even if the /auth/logout call fails — the
// user's intent to log out shouldn't be blocked by a flaky/unreachable
// backend.
export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refreshToken = useAppSelector(selectRefreshToken);

  return async function logout() {
    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch {
        // best-effort — fall through to clearing local state regardless
      }
    }
    dispatch(userLoggedOut());
    navigate(ROUTE_PATHS.HOME);
  };
}
