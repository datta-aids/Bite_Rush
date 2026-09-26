import React from 'react';
import { Hero } from './Hero';
import { CategoryBar } from './CategoryBar';
import { FoodCard } from './FoodCard';
import { Product, CategoryId } from '../types';
import { useOrders } from '../context/OrderContext';
import { INITIAL_COUPONS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { NavTab } from './Navbar';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenProductDetails: (product: Product) => void;
  onCustomizeProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenProductDetails,
  onCustomizeProduct,
}) => {
  const { products } = useOrders();
  const { applyCoupon, setIsCartOpen } = useCart();

  // Popular & Bestseller items for Home Page showcase
  const popularItems = products.filter((p) => p.isPopular || p.isBestseller).slice(0, 8);

  const handleCategoryClick = (category: CategoryId | 'all') => {
    onNavigate('menu');
  };

  const handleApplyQuickCoupon = (code: string) => {
    applyCoupon(code);
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <Hero
        onOrderNow={() => onNavigate('menu')}
        onViewMenu={() => onNavigate('menu')}
      />

      {/* Food Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> WHAT ARE YOU CRAVING?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-0.5">
              Explore Our Food Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <CategoryBar
          selectedCategory="all"
          onSelectCategory={handleCategoryClick}
          showAllOption={false}
        />
      </section>

      {/* Popular Items Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>HOTTEST PICKS OF THE DAY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display mt-1">
              Most Popular BiteRush Cravings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Hand-tossed pizzas, crispy smashed burgers and sides ordered most frequently right now.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold font-display self-start sm:self-auto transition-all"
          >
            VIEW FULL MENU ({products.length})
          </button>
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularItems.map((prod) => (
            <FoodCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenProductDetails}
              onCustomize={onCustomizeProduct}
            />
          ))}
        </div>
      </section>

      {/* Featured Offer Banner Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/70 border border-orange-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider font-display inline-block">
                LIMITED RUSH PROMO
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
                Flat ₹100 OFF On Your First 2 Orders
              </h3>
              <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                Use code <strong className="text-orange-400 font-mono">RUSH100</strong> at checkout on any order above ₹399. Fresh stone-baked pizzas, fries, and thick shakes delivered in 25 minutes!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleApplyQuickCoupon('RUSH100')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-sm font-display shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                >
                  APPLY CODE "RUSH100"
                </button>
                <button
                  onClick={() => onNavigate('offers')}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm font-display transition-all"
                >
                  VIEW ALL OFFERS
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80"
                  alt="Rush Promo Meal"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Rush Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold">
            WHY BITERUSH WINS
          </span>
          <h2 className="text-3xl font-black text-white font-display">
            The Golden Standard of Fast Food
          </h2>
          <p className="text-sm text-slate-400">
            We don't settle for mediocre reheated burgers. Here's why 15,000+ hungry foodies choose BiteRush every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6 text-orange-400" />,
              title: '25-Min Rush Dispatch',
              desc: 'Localized micro-kitchens ensure your food is prepared in minutes and on the road immediately.',
            },
            {
              icon: <Flame className="w-6 h-6 text-amber-400" />,
              title: 'Stone-Fired & Sizzling',
              desc: 'Pizzas cooked at blistering 450°C for bubble-crusted bliss and burgers smashed to order.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
              title: 'Tamper-Proof Hot Bags',
              desc: 'Special thermal insulation keeps steam vented and crunchy textures completely crisp.',
            },
            {
              icon: <Star className="w-6 h-6 text-rose-400" />,
              title: 'Taste & Hot Guarantee',
              desc: 'If your meal arrives cold or delayed, our live kitchen support credits you immediately.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[#121620] border border-slate-800 hover:border-orange-500/40 transition-all space-y-3 shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-bold text-base text-white font-display">{feature.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
