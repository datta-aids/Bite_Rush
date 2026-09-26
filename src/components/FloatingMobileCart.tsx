import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FloatingMobileCartProps {
  onOpenCart: () => void;
}

export const FloatingMobileCart: React.FC<FloatingMobileCartProps> = ({ onOpenCart }) => {
  const { cartCount, total } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 lg:hidden animate-in slide-in-from-bottom-5 duration-300">
      <div
        onClick={onOpenCart}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 shadow-2xl shadow-orange-500/40 border border-orange-400/50 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-slate-950/20">
            <ShoppingBag className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-950 text-orange-400 text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-black uppercase tracking-wider font-display">
              {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
            </div>
            <div className="text-[11px] font-semibold text-slate-900/80">Tap to review & checkout</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-base font-display">₹{total}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </div>
      </div>
    </div>
  );
};
