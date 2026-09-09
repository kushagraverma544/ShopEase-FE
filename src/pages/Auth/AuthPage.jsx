import { Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '../../components/common/Button/Button';
import { GoogleIcon } from '../../components/common/GoogleIcon/GoogleIcon';
import { Input } from '../../components/common/Input/Input';
import { AUTH_PAGE_CONTENT } from '../../constants/authPage.constants';
import { userLoggedIn } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { getRandomPhoto } from '../../services/unsplashService';
import { cn } from '../../utils/cn';

export function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [imageStatus, setImageStatus] = useState('loading');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    let isMounted = true;
    getRandomPhoto(AUTH_PAGE_CONTENT.unsplashQuery)
      .then((photo) => {
        if (!isMounted) return;
        setBackgroundUrl(photo.urls.regular);
        setImageStatus('success');
      })
      .catch(() => {
        if (isMounted) setImageStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: wire up to the real auth service once the backend contract exists.
    dispatch(userLoggedIn({ name: name || email.split('@')[0], email }));
    navigate(ROUTE_PATHS.HOME);
  }

  function handleGoogleContinue() {
    // TODO: real Google OAuth flow goes here once the backend supports it.
    dispatch(userLoggedIn({ name: 'Google User', email: 'google-user@example.com' }));
    navigate(ROUTE_PATHS.HOME);
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 md:block">
        {imageStatus === 'success' ? (
          <img src={backgroundUrl} alt="" className="h-full w-full object-cover" />
        ) : imageStatus === 'loading' ? (
          <div className="h-full w-full animate-pulse bg-neutral-200" />
        ) : (
          <div className="h-full w-full bg-primary-600" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/30 to-neutral-900/10" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-400">
            {AUTH_PAGE_CONTENT.badge}
          </span>
          <h1 className="max-w-md text-3xl font-semibold text-neutral-0">
            {AUTH_PAGE_CONTENT.title}
          </h1>
          <p className="max-w-sm text-sm text-neutral-200">{AUTH_PAGE_CONTENT.description}</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2">
        <div className="w-full max-w-sm">
          <NavLink to={ROUTE_PATHS.HOME} className="mb-8 block text-xl font-semibold text-primary-600">
            ShopEase
          </NavLink>

          <div className="mb-6 flex rounded-lg bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium transition-colors duration-150',
                mode === 'login' ? 'bg-neutral-0 text-primary-600 shadow-card' : 'text-neutral-500',
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium transition-colors duration-150',
                mode === 'register' ? 'bg-neutral-0 text-primary-600 shadow-card' : 'text-neutral-500',
              )}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700" htmlFor="name">
                  Full name
                </label>
                <Input
                  id="name"
                  icon={User}
                  placeholder="Jane Doe"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700" htmlFor="password">
                  Password
                </label>
                {mode === 'login' ? (
                  <button type="button" className="text-xs font-medium text-primary-600 hover:underline">
                    Forgot password?
                  </button>
                ) : null}
              </div>
              <Input
                id="password"
                type="password"
                icon={Lock}
                placeholder="********"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button type="submit" size="lg" fullWidth className="mt-2">
              {mode === 'login' ? 'Login' : 'Create account'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs font-medium text-neutral-400">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <Button variant="secondary" size="lg" fullWidth onClick={handleGoogleContinue}>
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-primary-600 hover:underline"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
