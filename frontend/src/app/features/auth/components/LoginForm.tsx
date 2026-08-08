import React, { useState } from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import { Button, Input } from '../../shared/components/ui';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2, Shield } from 'lucide-react';

/**
 * Reusable admin login form.
 *
 * Owns the email/password fields, show-password toggle, error banner and
 * loading state, then delegates the actual authentication to `onLogin`.
 * `onSuccess` fires once `onLogin` resolves to true so the parent can
 * navigate to the dashboard.
 */
export interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSuccess }) => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    try {
      const success = await onLogin(email, password);
      if (success) {
        onSuccess?.();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast(err instanceof Error ? err.message : 'Login failed');
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Authentication Failed</p>
            <p className="text-rose-700 text-xs mt-1">Invalid email or password. Please try again.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Field */}
        <Input
          label={(
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-700" />
              <span>Admin Email</span>
            </span>
          )}
          labelClassName="block text-sm font-semibold text-stone-700 flex items-center gap-2"
          containerClassName="space-y-2"
          type="email"
          required
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setError(false);
          }}
          variant="login"
          icon={<Mail className="w-4 h-4 text-stone-400" />}
          placeholder="admin@blht.bt"
          disabled={isLoading}
          autoComplete="email"
        />

        {/* Password Field */}
        <Input
          label={(
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Password</span>
            </span>
          )}
          labelClassName="block text-sm font-semibold text-stone-700 flex items-center gap-2"
          containerClassName="space-y-2"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setError(false);
          }}
          variant="login"
          icon={<Lock className="w-4 h-4 text-stone-400" />}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-stone-400 hover:text-stone-600 transition-colors"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          placeholder="••••••••••••"
          disabled={isLoading}
          autoComplete="current-password"
        />

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          variant="gradient"
          size="full"
          className="shadow-lg shadow-amber-900/20 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span>Secure Login</span>
            </>
          )}
        </Button>
      </form>
    </>
  );
};
