import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Check, Sparkles, Flame } from 'lucide-react';
import { Product, CategoryId } from '../types';
import { useOrders } from '../context/OrderContext';
import { CategoryBar } from './CategoryBar';
import { FoodCard } from './FoodCard';

interface MenuViewProps {
  initialCategory?: CategoryId | 'all';
  onOpenProductDetails: (product: Product) => void;
  onCustomizeProduct: (product: Product) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  initialCategory = 'all',
  onOpenProductDetails,
  onCustomizeProduct,
}) => {
  const { products } = useOrders();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Veg filter
    if (vegOnly) {
      result = result.filter((p) => p.isVeg);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: Popularity & Bestsellers first
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.ratingCount - a.ratingCount);
    }

    return result;
  }, [products, selectedCategory, vegOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Menu Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 100% Oven-Fresh & Handcrafted
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display mt-1">
            Explore BiteRush Menu
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Choose from authentic stone-baked pizzas, double-patty smash burgers, crispy sides and molten desserts.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Showing <strong className="text-orange-400">{filteredAndSortedProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Categories Horizontal Scroller */}
      <div>
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showAllOption={true}
        />
      </div>

      {/* Filter and Sorting Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#121620] p-4 rounded-2xl border border-slate-800/80">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within menu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              vegOnly
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded border border-emerald-500 flex items-center justify-center p-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span>Pure Veg Only</span>
            {vegOnly && <Check className="w-3 h-3 text-emerald-400" />}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-9 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="popular">Popularity & Best</option>
              <option value="rating">Highest Rated (⭐ 4.8+)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#121620]/60 rounded-3xl border border-slate-800 p-8">
          <div className="w-20 h-20 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-4xl">
            🍽️
          </div>
          <h3 className="text-xl font-bold text-white font-display">No food items matched your filters</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or switching from pure veg to view all delicious options.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setVegOnly(false);
              setSortBy('popular');
            }}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs font-display hover:bg-orange-600 transition-all"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <FoodCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetails}
              onCustomize={onCustomizeProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
