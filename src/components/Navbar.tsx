import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  MapPin,
  Clock,
  Shield,
  LayoutDashboard,
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'home' | 'menu' | 'offers' | 'track' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout';

interface NavbarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'offers', label: 'Offers', badge: 'DEALS' },
    { id: 'track', label: 'Track Order' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Rush Announcement Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-slate-950 font-bold text-xs py-1.5 px-4 text-center select-none overflow-hidden relative shadow-inner">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-block animate-bounce">⚡</span>
            <span>RUSH GUARANTEE: Piping hot food in 25 mins or get ₹100 BiteCash!</span>
          </span>
          <span className="hidden md:inline-block text-black/60">•</span>
          <span className="hidden md:inline-flex items-center gap-1">
            <span>Use code</span>
            <span className="px-1.5 py-0.5 rounded bg-black/20 text-slate-950 font-black tracking-wider uppercase">
              RUSH100
            </span>
            <span>for flat ₹100 off</span>
          </span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0c0e13]/95 backdrop-blur-md border-b border-slate-800 shadow-2xl'
            : 'bg-[#0f1117]/85 backdrop-blur-md border-b border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div onClick={() => handleNavClick('home')}>
            <Logo showTagline={true} size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-orange-500/15 border border-orange-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Dashboard Quick Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'admin'
                  ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
              title="Admin Dashboard Demo"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Icons: Search, Cart, Profile, Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2 group"
              aria-label="Search dishes"
            >
              <Search className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-400 hidden xl:inline-block pr-1">
                Search food...
              </span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm font-display flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-slate-950 text-orange-400 text-[10px] font-black flex items-center justify-center border-2 border-orange-500 shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-display">CART</span>
            </button>

            {/* Profile Dropdown or Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-200 hidden md:inline max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141822] border border-slate-800 shadow-2xl p-2 z-40 text-xs">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="font-bold text-white text-sm truncate">{user.name}</p>
                        <p className="text-slate-400 truncate text-[11px]">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => handleNavClick('profile')}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                          <UserIcon className="w-4 h-4 text-orange-400" />
                          <span>My Profile & Orders</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('track')}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>Live Order Tracking</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                          <span>Admin Dashboard</span>
                        </button>
                      </div>
                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-bold text-white transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0c0e14] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentTab === link.id
                    ? 'bg-orange-500/15 border border-orange-500/30 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/60"
              >
                <UserIcon className="w-4 h-4 text-orange-400" />
                <span>My Profile & Orders</span>
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 hover:bg-slate-800/60"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
