export type CategoryId =
  | 'pizza'
  | 'burgers'
  | 'fries'
  | 'momos'
  | 'wraps'
  | 'sandwiches'
  | 'beverages'
  | 'desserts'
  | 'combos';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  isVeg: boolean;
  image: string;
  relatedImages?: string[];
  isPopular?: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  prepTimeMinutes?: number;
  calories?: number;
  ingredients?: string[];
  customizable?: boolean;
}

export interface CustomizationOption {
  cheeseType?: 'normal' | 'extra' | 'burst';
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'inferno';
  extraToppings?: string[];
  removedIngredients?: string[];
  drinkChoice?: string;
  preparationType?: 'steamed' | 'fried' | 'tandoori';
}

export interface CartItem {
  cartItemId: string; // unique per combination of product + customization
  product: Product;
  quantity: number;
  customization?: CustomizationOption;
  customizationExtraCost: number;
  itemTotal: number;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free_delivery';
  discountValue: number; // e.g. 100 for fixed, 20 for 20%, 0 for free_delivery
  minOrder: number;
  maxDiscount?: number;
  badge?: string;
  image?: string;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  houseBuilding: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  type?: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon?: string;
  tax: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  deliveryOption: 'standard' | 'express';
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  estimatedDeliveryTime: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    completed: boolean;
    label: string;
    description: string;
  }[];
  rider?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: DeliveryAddress[];
  favoriteProductIds: string[];
}
