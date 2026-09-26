/**
 * Safe fallback image helper for BiteRush
 * Provides category-matched authentic food imagery in case of network drops
 */
import { CategoryId } from '../types';

export const CATEGORY_FALLBACKS: Record<CategoryId, string> = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
  momos: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
  wraps: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  sandwiches: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  beverages: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
  desserts: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  combos: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: CategoryId
) => {
  const target = e.currentTarget;
  const fallback = category && CATEGORY_FALLBACKS[category] ? CATEGORY_FALLBACKS[category] : DEFAULT_FOOD_IMAGE;
  if (target.src !== fallback) {
    target.src = fallback;
  }
};
