import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/client';
import { Lock, Shield, Mail, Eye, EyeOff, AlertCircle, Loader2, Building2, Globe } from 'lucide-react';
import bhutanLogo from '../../assets/images/blht_logo.png';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, navigate } = useApp();
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
      // Get CSRF token first
      await api.getCsrfToken();
      
      const success = await loginAdmin(email, password);
      if (success) {
        navigate('admin-dashboard');
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white/95 backdrop-blur-xl border border-amber-200/50 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-white p-2 border-2 border-amber-400/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <img src={bhutanLogo} alt="Bhutan Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-50 mb-2">
                BLHT Administration
              </h1>
              <p className="text-amber-200/90 text-sm font-serif">
                Bhutan Luxury & Heritage Tours Management Portal
              </p>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-amber-300/80 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure Encrypted Access</span>
                <Globe className="w-3.5 h-3.5" />
                <span>Thimphu HQ</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Authentication Failed</p>
                  <p className="text-rose-700 text-xs mt-1">Invalid email or password. Please try again.</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-700" />
                  <span>Admin Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setError(false);
                    }}
                    className="w-full px-4 py-3 pl-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-stone-50/50 hover:bg-stone-50"
                    placeholder="admin@blht.bt"
                    disabled={isLoading}
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-stone-300 text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-stone-50/50 hover:bg-stone-50"
                    placeholder="••••••••••••"
                    disabled={isLoading}
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
              </button>
            </form>

            {/* Security Notice */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-start gap-3 text-xs text-stone-500">
                <Building2 className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-700">Authorized Access Only</p>
                  <p className="mt-1">This portal is restricted to authorized BLHT staff. All login attempts are monitored and logged for security purposes.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-stone-200">
              <p className="text-[10px] text-stone-400">
                BLHT Management System v2026.1 • Secure SSL/TLS Connection
              </p>
            </div>
          </div>
        </div>

        {/* Additional Security Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stone-500">
            Need assistance? Contact <a href="mailto:it@blht.bt" className="text-amber-700 hover:underline font-semibold">IT Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
