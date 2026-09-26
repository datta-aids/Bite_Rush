import React from 'react';
import { Tag, Copy, Check, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { INITIAL_COUPONS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { handleImageError } from '../utils/imageFallback';

interface OffersViewProps {
  onExploreMenu: () => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ onExploreMenu }) => {
  const { applyCoupon, appliedCoupon, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyOffer = (code: string) => {
    const success = applyCoupon(code);
    if (success) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Offers Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Rush Rewards & Savings</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
          Craving Deals & Steals
        </h2>
        <p className="text-base text-slate-300">
          Save on your favorite pizzas, burgers and combos with our special discount codes. Apply directly to your cart in one click!
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {INITIAL_COUPONS.map((offer) => {
          const isCurrentActive = appliedCoupon?.code === offer.code;

          return (
            <div
              key={offer.code}
              className={`rounded-3xl overflow-hidden bg-[#131720] border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl ${
                isCurrentActive
                  ? 'border-emerald-500/60 shadow-emerald-950/40 shadow-xl'
                  : 'border-slate-800 hover:border-orange-500/40 hover:shadow-orange-500/10'
              }`}
            >
              {/* Media Section */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-black/30 to-transparent" />

                {offer.badge && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider font-display shadow-md">
                    {offer.badge}
                  </span>
                )}

                {isCurrentActive && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider font-display shadow-md flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> APPLIED
                  </span>
                )}
              </div>

              {/* Offer Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white font-display">
                    {offer.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {offer.description}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Valid on orders above ₹{offer.minOrder}
                  </p>
                </div>

                {/* Coupon Code Block & Action */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-dashed border-orange-500/40">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-400" />
                      <span className="font-mono font-black text-sm text-orange-400 tracking-wider">
                        {offer.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(offer.code)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Copy promo code"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleApplyOffer(offer.code)}
                    disabled={isCurrentActive}
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm font-display flex items-center justify-center gap-2 transition-all ${
                      isCurrentActive
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-lg shadow-orange-500/20 active:scale-95'
                    }`}
                  >
                    {isCurrentActive ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>APPLIED TO CART</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>APPLY TO CART</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Cravings Prompt */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border border-orange-500/20 p-8 text-center space-y-4 max-w-3xl mx-auto mt-12">
        <h3 className="text-2xl font-black text-white font-display">
          Ready to satisfy your cravings?
        </h3>
        <p className="text-sm text-slate-300">
          Pick your favorite pizzas, sides and thick shakes from our 45+ dish menu and apply your discount at checkout!
        </p>
        <button
          onClick={onExploreMenu}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm font-display shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all inline-flex items-center gap-2"
        >
          <span>ORDER NOW</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
