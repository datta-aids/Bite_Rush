import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Percent,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreMenu,
}) => {
  const {
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
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  const freeDeliveryThreshold = 399;
  const awayFromFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f1218] border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#131720]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-display">Your Hunger Cart</h3>
                <p className="text-xs text-slate-400">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#161b24] px-5 py-3 border-b border-slate-800/80">
            {subtotal >= freeDeliveryThreshold || (appliedCoupon && appliedCoupon.discountType === 'free_delivery') ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You unlocked FREE Rush Delivery! ⚡</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
                  <span>Add ₹{awayFromFreeDelivery} more for FREE delivery</span>
                  <span className="text-orange-400 font-bold">{deliveryProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-3xl">
                  🍔
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white font-display">Your cart is empty!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Your stomach is calling! Explore our hot pizzas, crunchy burgers and sides.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMenu();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs font-display hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  BROWSE MENU
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const { product, quantity, customization, customizationExtraCost, itemTotal } = item;
                const unitPrice = product.price + customizationExtraCost;

                return (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 p-3.5 rounded-2xl bg-[#131720] border border-slate-800/80 hover:border-slate-700 transition-all group"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => handleImageError(e, product.category)}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-orange-400 transition-colors">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Customization Badges */}
                        {customization && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {customization.cheeseType && customization.cheeseType !== 'normal' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {customization.cheeseType === 'extra' ? '+Extra Cheese' : '+Cheese Burst'}
                              </span>
                            )}
                            {customization.spiceLevel && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                {customization.spiceLevel}
                              </span>
                            )}
                            {customization.extraToppings && customization.extraToppings.length > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                +{customization.extraToppings.length} toppings
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom row: Unit price, Quantity Stepper, Item Total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                        <span className="text-xs text-slate-400">₹{unitPrice} each</span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, quantity - 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, quantity + 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-white font-display">
                            ₹{itemTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#131720] space-y-4 shrink-0">
              {/* Promo Code Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold uppercase tracking-wider">{appliedCoupon.code}</span>
                        <span className="ml-1 text-emerald-400/80">({appliedCoupon.title})</span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Promo code (e.g. RUSH100)"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 uppercase tracking-wider font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 font-bold text-xs font-display transition-all"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Restaurant GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800 font-display">
                  <span>Grand Total</span>
                  <span className="text-orange-400 text-lg">₹{total}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm font-display flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMenu();
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Contactless & Safe Delivery Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
