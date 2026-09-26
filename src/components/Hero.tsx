import React from 'react';
import { ArrowRight, Zap, Flame, ShieldCheck, Star, Clock } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

interface HeroProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onViewMenu }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Speed Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="font-display tracking-wide uppercase">25-Min Express Kitchen Delivery</span>
            </div>

            {/* Main Brand Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
                Your Cravings.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 drop-shadow-sm">
                  Our Rush.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Hot, fresh and delicious food delivered to your doorstep. Handcrafted burgers, stone-fired pizzas, crunchy momos, and chilled shakes ready before your hunger strikes.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base font-display flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/30 active:scale-95 transition-all group"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onViewMenu}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base font-display border border-slate-700/80 hover:border-slate-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>VIEW FULL MENU</span>
              </button>
            </div>

            {/* Trust Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">25-Min Rush</h4>
                  <p className="text-[11px] text-slate-400">Guaranteed lightning delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Oven-Fresh</h4>
                  <p className="text-[11px] text-slate-400">100% freshly cooked to order</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Safe Packaging</h4>
                  <p className="text-[11px] text-slate-400">Tamper-proof insulated bags</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Food Collage & Floating Live Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-2xl opacity-20 -rotate-3 transform" />

              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-[4/3] sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious Double Stack BiteRush Burger"
                  onError={handleImageError}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-orange-500 text-slate-950 font-black text-[11px] uppercase tracking-wider font-display">
                      SIGNATURE RUSH SPECIAL
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                      Double Cheese Rush Stack
                    </h3>
                    <p className="text-xs text-slate-300">Toasted Brioche • Melted Cheddar • Rush Mayo</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 font-display">₹249</span>
                  </div>
                </div>
              </div>

              {/* Floating Pill: Live Rider Tracking */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3 rounded-2xl bg-[#141822]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-rush">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl border border-orange-500/40">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Rider In Transit</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Delivering in ~12 mins</p>
                </div>
              </div>

              {/* Floating Pill: 4.9 Star Rating */}
              <div className="absolute -bottom-5 -right-2 sm:-right-6 p-3 rounded-2xl bg-[#141822]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">4.9 / 5 Rating</div>
                  <p className="text-[11px] text-slate-400">15,000+ Happy Foodies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
