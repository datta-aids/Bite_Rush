import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, CartItem, CustomizationOption, Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/mockData';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, customization?: CustomizationOption, extraCost?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => boolean;
  removeCoupon: () => void;
  getProductQuantityInCart: (productId: string) => number;
  getCartItemByProductId: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('biterush_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('biterush_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('biterush_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart]);

  // Sync coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('biterush_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('biterush_coupon');
      }
    } catch (e) {
      console.error('Failed to sync coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price + item.customizationExtraCost) * item.quantity, 0);
  }, [cart]);

  // Calculate discount based on applied coupon and subtotal
  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
    if (appliedCoupon.discountType === 'percentage') {
      const calc = (subtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    }
    if (appliedCoupon.discountType === 'free_delivery') {
      return 0; // Discounted directly on delivery fee
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  // Delivery fee calculation
  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (subtotal >= 399) return 0; // Free delivery above 399
    if (appliedCoupon && appliedCoupon.discountType === 'free_delivery' && subtotal >= appliedCoupon.minOrder) {
      return 0;
    }
    return 40; // Standard 40
  }, [cart.length, subtotal, appliedCoupon]);

  // 5% Restaurant GST
  const tax = useMemo(() => {
    if (subtotal === 0) return 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    return Math.round(taxableAmount * 0.05);
  }, [subtotal, discount]);

  // Grand total
  const total = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, subtotal - discount + deliveryFee + tax);
  }, [cart.length, subtotal, discount, deliveryFee, tax]);

  const addToCart = (
    product: Product,
    quantity = 1,
    customization?: CustomizationOption,
    extraCost = 0
  ) => {
    // Generate deterministic id based on product and custom options
    const customKey = customization ? JSON.stringify(customization) : 'standard';
    const cartItemId = `${product.id}-${customKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        const unitCost = product.price + extraCost;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          itemTotal: unitCost * newQty,
        };
        return next;
      } else {
        const unitCost = product.price + extraCost;
        const newItem: CartItem = {
          cartItemId,
          product,
          quantity,
          customization,
          customizationExtraCost: extraCost,
          itemTotal: unitCost * quantity,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}${product.name} to cart! 🍔`, 'success');
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitCost = item.product.price + item.customizationExtraCost;
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: unitCost * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const itemToRemove = prev.find((item) => item.cartItemId === cartItemId);
      if (itemToRemove) {
        showToast(`Removed ${itemToRemove.product.name} from cart`, 'info');
      }
      return prev.filter((item) => item.cartItemId !== cartItemId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (couponCode: string): boolean => {
    const cleanCode = couponCode.trim().toUpperCase();
    const foundCoupon = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

    if (!foundCoupon) {
      showToast(`Invalid coupon code "${cleanCode}". Try RUSH100 or FREESHIP!`, 'error');
      return false;
    }

    if (subtotal < foundCoupon.minOrder) {
      showToast(`Coupon requires a minimum order of ₹${foundCoupon.minOrder}. Add more items!`, 'error');
      return false;
    }

    setAppliedCoupon(foundCoupon);
    showToast(`Coupon ${foundCoupon.code} applied! Saved ₹${foundCoupon.discountType === 'free_delivery' ? '40 delivery' : foundCoupon.discountValue}`, 'success');
    return true;
  };

  const removeCoupon = () => {
    if (appliedCoupon) {
      showToast(`Coupon ${appliedCoupon.code} removed`, 'info');
      setAppliedCoupon(null);
    }
  };

  const getProductQuantityInCart = (productId: string) => {
    return cart
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartItemByProductId = (productId: string) => {
    return cart.find((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        tax,
        total,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        getProductQuantityInCart,
        getCartItemByProductId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
