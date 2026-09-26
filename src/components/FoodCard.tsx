import React, { useState, useRef, useEffect } from 'react';
import { Star, Plus, Minus, SlidersHorizontal, Heart, Flame, Clock, Camera } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

interface FoodCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onCustomize?: (product: Product) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product, onOpenDetails, onCustomize }) => {
  const { addToCart, updateQuantity, getProductQuantityInCart, getCartItemByProductId } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();

  const allImages =
    product.relatedImages && product.relatedImages.length > 0
      ? product.relatedImages
      : [product.image];
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const quantityInCart = getProductQuantityInCart(product.id);
  const cartItem = getCartItemByProductId(product.id);
  const isFav = isFavorite(product.id);

  const currentImage = allImages[activeImgIndex] || product.image;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setImgLoaded(true);
    } else {
      setImgLoaded(false);
    }
  }, [currentImage]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.customizable && onCustomize) {
      onCustomize(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#13171f] border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/15 cursor-pointer overflow-hidden"
    >
      {/* Top Media Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {/* Placeholder shimmer during loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
          </div>
        )}

        <img
          ref={imgRef}
          src={currentImage}
          alt={product.name}
          onError={(e) => {
            handleImageError(e, product.category);
            setImgLoaded(true);
          }}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
          className={`h-full w-full object-cover select-none transition-all duration-700 ease-out group-hover:scale-108 filter contrast-[1.04] saturate-[1.06] group-hover:brightness-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient vignette for appetizing depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13171f] via-black/20 to-black/40 opacity-80 pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center pointer-events-none z-10">
          {/* Veg / Non-veg Indicator */}
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center border shadow-md ${
              product.isVeg
                ? 'bg-slate-950/90 border-emerald-500 text-emerald-500'
                : 'bg-slate-950/90 border-rose-500 text-rose-500'
            }`}
            title={product.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                product.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </div>

          {product.isBestseller && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-sans shadow-md">
              Bestseller
            </span>
          )}

          {product.isSpicy && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 backdrop-blur-md">
              <Flame className="w-3 h-3 text-rose-500" /> Spicy
            </span>
          )}
        </div>

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFav
              ? 'bg-rose-500/25 text-rose-400 border border-rose-500/50'
              : 'bg-black/60 text-slate-300 hover:text-white border border-white/10 hover:bg-black/80'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Multi-angle Related Images Switcher */}
        {allImages.length > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 z-10 shadow-lg text-slate-200"
            title={`${allImages.length} photo angles available`}
          >
            <Camera className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-200">
              {activeImgIndex + 1}/{allImages.length}
            </span>
            <div className="flex items-center gap-1 ml-0.5">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIndex(idx);
                  }}
                  className={`transition-all duration-200 rounded-full ${
                    idx === activeImgIndex
                      ? 'w-3 h-1.5 bg-orange-500'
                      : 'w-1.5 h-1.5 bg-slate-400/60 hover:bg-white'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Prep time badge */}
        {product.prepTimeMinutes && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-950/85 text-slate-300 backdrop-blur-md border border-slate-700/50 z-10 pointer-events-none">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{product.prepTimeMinutes} mins</span>
          </div>
        )}
      </div>

      {/* Info Content Section */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div>
          {/* Rating & reviews */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.ratingCount}+ orders)</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-white font-display">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.customizable && (
              <span className="text-[10px] text-orange-400 font-medium flex items-center gap-0.5">
                <SlidersHorizontal className="w-2.5 h-2.5" /> Customizable
              </span>
            )}
          </div>

          {/* Add / Stepper Button */}
          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center rounded-xl bg-orange-600/20 border border-orange-500/50 p-1 text-orange-400"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-sm text-white">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
