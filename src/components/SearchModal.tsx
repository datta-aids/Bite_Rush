import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, Flame } from 'lucide-react';
import { Product } from '../types';
import { useOrders } from '../context/OrderContext';
import { handleImageError } from '../utils/imageFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products } = useOrders();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q)))
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#121620] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#151a26]">
          <Search className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pizza, crispy burgers, peri peri fries, thick shakes..."
            className="w-full bg-transparent border-none text-white text-base placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Popular Quick Searches when query is empty */}
        {!query.trim() && (
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Popular Rush Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Farmhouse Feast',
                'Peri Peri Fries',
                'Double Cheese Burger',
                'Kurkure Momos',
                'Choco Lava Cake',
                'Solo Meal Combo',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-orange-500/50 hover:bg-slate-800 transition-all"
                >
                  🔍 {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query.trim() && (
          <div className="overflow-y-auto p-4 space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-lg">No dishes found for "{query}"</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for "pizza", "burger", "momo", or "fries"
                </p>
              </div>
            ) : (
              filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-orange-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      onError={handleImageError}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-950"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                          {prod.name}
                        </h4>
                        {prod.isSpicy && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {prod.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {prod.rating}
                        </span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                          • {prod.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-base font-bold text-white font-display">
                      ₹{prod.price}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-slate-950 transition-all">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
