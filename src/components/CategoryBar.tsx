import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types';

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
  showAllOption?: boolean;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  showAllOption = true,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
        {showAllOption && (
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/25 scale-[1.02]'
                : 'bg-[#141822] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
            }`}
          >
            <span>🍽️</span>
            <span>All Items</span>
          </button>
        )}

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/25 scale-[1.02]'
                  : 'bg-[#141822] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
