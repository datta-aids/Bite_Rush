import React from 'react';
import { Logo } from './Logo';
import { NavTab } from './Navbar';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0a0c10] border-t border-slate-800 text-slate-400 pt-16 pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => onNavigate('home')}>
              <Logo showTagline={true} size="md" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              BiteRush is an independent modern fast-food delivery kitchen brand dedicated to fulfilling sudden cravings with hyper-speed dispatch, stone-baked pizzas, and gourmet smash burgers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {[
                { name: 'Instagram', icon: '📸' },
                { name: 'Twitter/X', icon: '⚡' },
                { name: 'YouTube', icon: '▶️' },
                { name: 'Facebook', icon: '👍' },
              ].map((soc) => (
                <div
                  key={soc.name}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-orange-500/50 flex items-center justify-center cursor-pointer transition-all text-sm"
                  title={soc.name}
                >
                  {soc.icon}
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Certified 25-Minute Rush Dispatch Zone</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors"
                >
                  Menu & Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-white transition-colors"
                >
                  Offers & Coupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors"
                >
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-white transition-colors"
                >
                  My Profile & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Admin Operations Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Food Menu Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-display">
              Popular Cravings
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white">
                  Hand-Tossed Pizzas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white">
                  Double Cheese Smash Burgers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white">
                  Peri Peri Shaker Fries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white">
                  Kurkure Fried Momos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white">
                  Molten Choco Lava Cakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white">
                  Rush Super Combos
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider font-display">
              Kitchen Support
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>1800-RUSH-BITE (24/7 Helpline)</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>support@biterush-fastfood.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Indiranagar Kitchen Hub, Bengaluru 560038</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Contact Desk
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BiteRush Foods Inc. All rights reserved. Original branding.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-400 cursor-pointer">FSSAI Hygiene Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
