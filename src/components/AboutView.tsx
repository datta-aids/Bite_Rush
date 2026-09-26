import React from 'react';
import { Sparkles, Zap, Flame, ShieldCheck, Heart, Award, Clock, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

interface AboutViewProps {
  onExploreMenu: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreMenu }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The BiteRush Story</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-display">
          Crafted for Cravers. Built for Rush.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          BiteRush was born out of a simple frustration: why does fast food have to mean soggy fries and lukewarm burgers? We re-engineered the kitchen-to-doorstep experience with precision culinary craft and hyper-fast dispatch.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold">
            CULINARY PHILOSOPHY
          </span>
          <h2 className="text-3xl font-black text-white font-display">
            Never Frozen, Always Stone-Baked & Sizzling
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every pizza dough is fermented naturally for 24 hours, hand-stretched on order, and baked in 450°C stone ovens. Our burger patties are freshly smashed to create that coveted caramelized crust, paired with our house-crafted sauces.
          </p>
          <div className="space-y-3 pt-2">
            {[
              {
                title: '25-Minute Kitchen-to-Door Rush',
                desc: 'Hyper-local cloud kitchens situated within 3km of your neighborhood.',
              },
              {
                title: 'Tamper-Evident Thermal Packaging',
                desc: 'Specially engineered vented containers keep crispiness locked without trapping moisture.',
              },
              {
                title: '100% Farm-Fresh Vegetarian & Real Produce',
                desc: 'Fresh bell peppers, real dairy mozzarella, stone-ground flours and zero trans fats.',
              },
            ].map((perk, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121620] border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{perk.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt="BiteRush Kitchen & Chefs"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase font-bold text-orange-400">OUR OATH</span>
              <p className="text-lg font-bold text-white mt-1">
                "If it doesn't arrive burning hot and mouthwateringly crisp, your next meal is on us."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { number: '25 Min', label: 'Average Delivery Time' },
          { number: '45+', label: 'Artisanal Recipes' },
          { number: '99.8%', label: 'On-Time Accuracy' },
          { number: '4.9 ★', label: 'Customer Satisfaction' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-[#121620] border border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-display">
              {stat.number}
            </div>
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Bottom Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 p-8 sm:p-12 text-center text-slate-950 space-y-4 shadow-2xl">
        <h3 className="text-3xl sm:text-4xl font-black font-display">
          Experience the Rush Today
        </h3>
        <p className="text-sm sm:text-base font-semibold max-w-xl mx-auto opacity-90">
          Order now and enjoy 25-minute delivery, piping hot pizza crusts and loaded burgers right to your couch.
        </p>
        <button
          onClick={onExploreMenu}
          className="px-8 py-4 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 font-black text-sm font-display shadow-2xl transition-all inline-flex items-center gap-2"
        >
          <span>ORDER YOUR CRAVING</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
