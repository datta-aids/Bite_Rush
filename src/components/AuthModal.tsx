import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
    quickDemoLogin,
  } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email, password);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    signup(name, email, phone, password);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    showToast(`Password reset link transmitted to ${forgotEmail}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#121620] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#151a26]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">⚡</span>
            <h3 className="font-bold text-lg text-white font-display">
              {authModalTab === 'login' && 'Sign In to BiteRush'}
              {authModalTab === 'signup' && 'Create Your Craving Account'}
              {authModalTab === 'forgot' && 'Reset Rush Password'}
            </h3>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers if not forgot */}
        {authModalTab !== 'forgot' && (
          <div className="grid grid-cols-2 p-1.5 m-5 mb-0 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setAuthModalTab('login')}
              className={`py-2 rounded-xl transition-all ${
                authModalTab === 'login'
                  ? 'bg-orange-500 text-slate-950 font-display shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthModalTab('signup')}
              className={`py-2 rounded-xl transition-all ${
                authModalTab === 'signup'
                  ? 'bg-orange-500 text-slate-950 font-display shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Quick Demo Sign In Button */}
          {authModalTab === 'login' && (
            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>One-Click Demo Login (Alex Sharma)</span>
            </button>
          )}

          {/* LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.sharma@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('forgot')}
                    className="text-[11px] text-orange-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm font-display flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-2"
              >
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {authModalTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Nair"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 12345"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm font-display flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-2"
              >
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authModalTab === 'forgot' && (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                  <p className="text-xs text-emerald-300 font-semibold">
                    Reset instructions sent to {forgotEmail}! Please check your inbox.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      setAuthModalTab('login');
                    }}
                    className="text-xs text-orange-400 hover:underline font-bold"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Enter the email registered with your BiteRush craving account to receive a reset code.
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('login')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs font-display transition-all"
                    >
                      SEND RESET CODE
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
