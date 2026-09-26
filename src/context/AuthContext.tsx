import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DeliveryAddress } from '../types';
import { INITIAL_SAVED_ADDRESSES } from '../data/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'forgot';
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: 'login' | 'signup' | 'forgot') => void;
  openLoginModal: () => void;
  openSignupModal: () => void;
  login: (email: string, password?: string) => boolean;
  signup: (name: string, email: string, phone: string, password?: string) => boolean;
  logout: () => void;
  quickDemoLogin: () => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  updateAddress: (address: DeliveryAddress) => void;
  deleteAddress: (id: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr-alex-1',
  name: 'Alex Sharma',
  email: 'alex.sharma@example.com',
  phone: '+91 98765 43210',
  addresses: INITIAL_SAVED_ADDRESSES,
  favoriteProductIds: ['pz-2', 'bg-2', 'ds-1', 'cb-1'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('biterush_user');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('biterush_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('biterush_user');
      }
    } catch (e) {
      console.error('Failed to sync user to localStorage', e);
    }
  }, [user]);

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  const login = (email: string) => {
    const loggedUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      email,
      phone: '+91 98765 00000',
      addresses: INITIAL_SAVED_ADDRESSES,
      favoriteProductIds: ['pz-1', 'bg-1'],
    };
    setUser(loggedUser);
    setAuthModalOpen(false);
    showToast(`Welcome back, ${loggedUser.name}!`, 'success');
    return true;
  };

  const signup = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      addresses: [],
      favoriteProductIds: [],
    };
    setUser(newUser);
    setAuthModalOpen(false);
    showToast(`Account created! Welcome to BiteRush, ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const quickDemoLogin = () => {
    setUser(DEFAULT_DEMO_USER);
    setAuthModalOpen(false);
    showToast('Signed in as Demo User (Alex Sharma)', 'success');
  };

  const addAddress = (addressData: Omit<DeliveryAddress, 'id'>) => {
    if (!user) return;
    const newAddress: DeliveryAddress = {
      ...addressData,
      id: 'addr-' + Date.now(),
      isDefault: user.addresses.length === 0,
    };
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: [...prev.addresses, newAddress],
      };
    });
    showToast('New delivery address saved!', 'success');
  };

  const updateAddress = (updated: DeliveryAddress) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => (a.id === updated.id ? updated : a)),
      };
    });
    showToast('Address updated successfully!', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== id),
      };
    });
    showToast('Address removed.', 'info');
  };

  const toggleFavorite = (productId: string) => {
    if (!user) {
      openLoginModal();
      showToast('Please sign in to save your favorites', 'info');
      return;
    }
    const isFav = user.favoriteProductIds.includes(productId);
    const updatedFavs = isFav
      ? user.favoriteProductIds.filter((id) => id !== productId)
      : [...user.favoriteProductIds, productId];

    setUser((prev) => (prev ? { ...prev, favoriteProductIds: updatedFavs } : null));
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', isFav ? 'info' : 'success');
  };

  const isFavorite = (productId: string) => {
    return user ? user.favoriteProductIds.includes(productId) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authModalOpen,
        authModalTab,
        setAuthModalOpen,
        setAuthModalTab,
        openLoginModal,
        openSignupModal,
        login,
        signup,
        logout,
        quickDemoLogin,
        addAddress,
        updateAddress,
        deleteAddress,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
