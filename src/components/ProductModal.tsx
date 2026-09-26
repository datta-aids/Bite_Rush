import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, Check, Sparkles, Heart, Camera } from 'lucide-react';
import { Product, CustomizationOption } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  startInCustomizeMode?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  startInCustomizeMode = false,
}) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Customization States
  const [cheeseType, setCheeseType] = useState<'normal' | 'extra' | 'burst'>('normal');
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'hot' | 'inferno'>('medium');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [prepType, setPrepType] = useState<'steamed' | 'fried' | 'tandoori'>('steamed');

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedImageIndex(0);
      setShowCustomize(startInCustomizeMode || (product.category === 'pizza' || product.category === 'burgers'));
      setCheeseType('normal');
      setSpiceLevel(product.isSpicy ? 'hot' : 'medium');
      setSelectedToppings([]);
      setRemovedIngredients([]);
      setPrepType('steamed');
    }
  }, [isOpen, product, startInCustomizeMode]);

  if (!isOpen || !product) return null;

  const allImages =
    product.relatedImages && product.relatedImages.length > 0
      ? product.relatedImages
      : [product.image];
  const activeHeroImage = allImages[selectedImageIndex] || product.image;

  const isFav = isFavorite(product.id);

  // Available toppings depending on category
  const availableToppings =
    product.category === 'pizza'
      ? [
          { name: 'Extra Mozzarella Drizzle', price: 40 },
          { name: 'Sliced Black Olives', price: 30 },
          { name: 'Pickled Jalapeños', price: 25 },
          { name: 'Grilled Herb Paneer', price: 45 },
          { name: 'Crispy Fried Garlic Flakes', price: 20 },
        ]
      : product.category === 'burgers'
      ? [
          { name: 'Crispy Hash Brown Patty', price: 45 },
          { name: 'Melted Cheddar Slice', price: 30 },
          { name: 'Caramelized Sweet Onions', price: 25 },
          { name: 'Pickled Dill Gherkins', price: 20 },
          { name: 'Smoked Chipotle Sauce', price: 20 },
        ]
      : [
          { name: 'Extra Mint Chutney & Mayo', price: 25 },
          { name: 'Peri Peri Shake Seasoning', price: 20 },
          { name: 'Grated Cheese Blanket', price: 35 },
        ];

  // Cheese extra costs
  const cheeseCost = cheeseType === 'extra' ? 40 : cheeseType === 'burst' ? 70 : 0;

  // Toppings total extra cost
  const toppingsCost = selectedToppings.reduce((sum, toppingName) => {
    const item = availableToppings.find((t) => t.name === toppingName);
    return sum + (item ? item.price : 0);
  }, 0);

  const extraCostPerUnit = cheeseCost + toppingsCost;
  const unitPrice = product.price + extraCostPerUnit;
  const grandTotal = unitPrice * quantity;

  const handleToggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName) ? prev.filter((t) => t !== toppingName) : [...prev, toppingName]
    );
  };

  const handleToggleRemove = (ingredientName: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredientName) ? prev.filter((i) => i !== ingredientName) : [...prev, ingredientName]
    );
  };

  const handleAddToCart = () => {
    const customization: CustomizationOption = {
      cheeseType,
      spiceLevel,
      extraToppings: selectedToppings.length > 0 ? selectedToppings : undefined,
      removedIngredients: removedIngredients.length > 0 ? removedIngredients : undefined,
      preparationType: product.category === 'momos' ? prepType : undefined,
    };

    addToCart(product, quantity, customization, extraCostPerUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#11141c] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Media */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={activeHeroImage}
            alt={product.name}
            onError={(e) => handleImageError(e, product.category)}
            className="w-full h-full object-cover transition-all duration-500 filter contrast-[1.04] saturate-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-black/20 to-black/60 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-slate-300 hover:text-white border border-white/10 hover:bg-black/80 transition-all z-10"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
              isFav
                ? 'bg-rose-500/25 text-rose-400 border border-rose-500/50'
                : 'bg-black/60 text-slate-300 hover:text-white border border-white/10 hover:bg-black/80'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Badge Chips Over Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center border shadow-lg ${
                  product.isVeg
                    ? 'bg-slate-950/90 border-emerald-500 text-emerald-500'
                    : 'bg-slate-950/90 border-rose-500 text-rose-500'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {product.rating} ({product.ratingCount} reviews)
              </span>
            </div>

            {product.prepTimeMinutes && (
              <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                {product.prepTimeMinutes} mins rush
              </span>
            )}
          </div>
        </div>

        {/* Related Food Images / Alternate Angles Gallery Strip */}
        {allImages.length > 1 && (
          <div className="px-5 sm:px-6 py-2.5 flex items-center gap-3 overflow-x-auto scrollbar-none bg-[#0c0e14] border-b border-slate-800/80 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 shrink-0">
              <Camera className="w-3.5 h-3.5" />
              <span>Related Photos ({allImages.length}):</span>
            </div>
            <div className="flex items-center gap-2.5">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 group ${
                    idx === selectedImageIndex
                      ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-lg scale-105'
                      : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View photo angle ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} angle ${idx + 1}`}
                    onError={(e) => handleImageError(e, product.category)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {idx === selectedImageIndex && (
                    <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-orange-400 font-bold">
                  {product.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-0.5">
                  {product.name}
                </h2>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-white font-display">₹{unitPrice}</div>
                {product.originalPrice && (
                  <div className="text-xs text-slate-500 line-through">
                    ₹{product.originalPrice + extraCostPerUnit}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients Tags */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customization Toggle Section */}
          {(product.customizable || product.category === 'pizza' || product.category === 'burgers' || product.category === 'momos') && (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-sm text-white">Customize Your Craving</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomize(!showCustomize)}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300"
                >
                  {showCustomize ? 'Hide Options' : 'Show Options'}
                </button>
              </div>

              {showCustomize && (
                <div className="space-y-5">
                  {/* Cheese Option (For Pizza & Burgers) */}
                  {(product.category === 'pizza' || product.category === 'burgers') && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Cheese Indulgence
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'normal', label: 'Classic Cheese', price: 0 },
                          { id: 'extra', label: 'Extra Cheese', price: 40 },
                          { id: 'burst', label: 'Liquid Burst Core', price: 70 },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCheeseType(c.id as any)}
                            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                              cheeseType === c.id
                                ? 'bg-orange-500/15 border-orange-500 text-white'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-xs font-bold leading-tight">{c.label}</span>
                            <span className="text-[11px] font-semibold text-orange-400 mt-1">
                              {c.price === 0 ? 'Included' : `+₹${c.price}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spice Level */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Spiciness Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'mild', label: 'Mild', icon: '🌱' },
                        { id: 'medium', label: 'Medium', icon: '🌶️' },
                        { id: 'hot', label: 'Spicy', icon: '🌶️🌶️' },
                        { id: 'inferno', label: 'Inferno', icon: '🔥' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSpiceLevel(s.id as any)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            spiceLevel === s.id
                              ? 'bg-rose-500/20 border-rose-500 text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-sm">{s.icon}</div>
                          <div className="text-[11px] font-bold mt-0.5">{s.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Toppings */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Add Extra Toppings & Crunch
                    </label>
                    <div className="space-y-2">
                      {availableToppings.map((top) => {
                        const checked = selectedToppings.includes(top.name);
                        return (
                          <div
                            key={top.name}
                            onClick={() => handleToggleTopping(top.name)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                              checked
                                ? 'bg-orange-500/10 border-orange-500 text-white'
                                : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border ${
                                  checked
                                    ? 'bg-orange-500 border-orange-500 text-slate-950'
                                    : 'border-slate-600 bg-slate-900'
                                }`}
                              >
                                {checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-medium">{top.name}</span>
                            </div>
                            <span className="text-xs font-bold text-orange-400">+₹{top.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Remove Ingredients Option */}
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Remove Ingredient (Don't like something?)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing) => {
                          const isRemoved = removedIngredients.includes(ing);
                          return (
                            <button
                              key={ing}
                              type="button"
                              onClick={() => handleToggleRemove(ing)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                                isRemoved
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 line-through'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              No {ing}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Fixed Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0e1117] flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-2xl bg-slate-900 border border-slate-800 p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 active:scale-95 flex items-center justify-center transition-all"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-black text-white text-base font-display">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 active:scale-95 flex items-center justify-center transition-all"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm sm:text-base font-display shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
          >
            <span>ADD TO CART</span>
            <span className="bg-slate-950/20 px-2.5 py-0.5 rounded-lg text-slate-950">
              ₹{grandTotal}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
