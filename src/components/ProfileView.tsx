import React, { useState } from 'react';
import {
  User as UserIcon,
  MapPin,
  Clock,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Package,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { DeliveryAddress, Product } from '../types';
import { FoodCard } from './FoodCard';
import { handleImageError } from '../utils/imageFallback';

interface ProfileViewProps {
  onTrackOrder: (orderId: string) => void;
  onExploreMenu: () => void;
  onOpenProductDetails: (product: Product) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onTrackOrder,
  onExploreMenu,
  onOpenProductDetails,
}) => {
  const { user, logout, addAddress, deleteAddress } = useAuth();
  const { orders } = useOrders();
  const { products } = useOrders();
  const { addToCart, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'favorites'>('orders');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const [newAddr, setNewAddr] = useState<Omit<DeliveryAddress, 'id'>>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    houseBuilding: '',
    street: '',
    area: '',
    city: 'Bengaluru',
    pincode: '',
    type: 'Home',
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-3xl">
          👤
        </div>
        <h3 className="text-xl font-bold text-white font-display">Please Sign In</h3>
        <p className="text-xs text-slate-400">
          Sign in to access your saved addresses, past orders and favorite meals.
        </p>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseBuilding || !newAddr.street || !newAddr.pincode) return;
    addAddress(newAddr);
    setShowAddAddressModal(false);
    setNewAddr({
      fullName: user.name,
      phone: user.phone,
      houseBuilding: '',
      street: '',
      area: '',
      city: 'Bengaluru',
      pincode: '',
      type: 'Home',
    });
  };

  const favoriteProducts = products.filter((p) => user.favoriteProductIds.includes(p.id));

  const handleReorder = (orderItems: typeof orders[0]['items']) => {
    orderItems.forEach((item) => {
      addToCart(item.product, item.quantity, item.customization, item.customizationExtraCost);
    });
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141822] via-[#161c28] to-[#121620] border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-slate-950 font-black text-3xl flex items-center justify-center shadow-xl shadow-orange-500/20 shrink-0 font-display">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                {user.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30 uppercase tracking-widest">
                Rush VIP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{user.email} • {user.phone}</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified BiteRush Foodie Member
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-orange-500/15 border border-orange-500/30 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 text-orange-400" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'addresses'
              ? 'bg-orange-500/15 border border-orange-500/30 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Saved Addresses ({user.addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'favorites'
              ? 'bg-orange-500/15 border border-orange-500/30 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Favorite Bites ({favoriteProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-[#121620] rounded-3xl border border-slate-800 p-8">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-bold text-white">No previous orders found</p>
              <p className="text-xs text-slate-400 mt-1">
                Explore our menu to start your first rush craving.
              </p>
              <button
                onClick={onExploreMenu}
                className="mt-4 px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs font-display hover:bg-orange-600 transition-all"
              >
                BROWSE MENU
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#121620] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white font-mono">
                        #{order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500/15 border border-orange-500/30 text-orange-400">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-amber-400 font-display">
                      ₹{order.total}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items • {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Items Thumbnails Row */}
                <div className="flex flex-wrap gap-2.5">
                  {order.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        onError={handleImageError}
                        className="w-8 h-8 rounded-lg object-cover bg-slate-950"
                      />
                      <span className="text-white font-medium">
                        {item.quantity}x {item.product.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-400 truncate max-w-xs">
                    Deliver to: {order.deliveryAddress.houseBuilding}, {order.deliveryAddress.street}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order.items)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                      <span>Re-Order Items</span>
                    </button>

                    <button
                      onClick={() => onTrackOrder(order.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-bold text-xs font-display flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/10"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white font-display">Manage Delivery Addresses</h3>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="px-3.5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs font-display flex items-center gap-1.5 hover:bg-orange-600 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-5 rounded-3xl bg-[#121620] border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {addr.type || 'Home'}
                    </span>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-2">{addr.fullName}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {addr.houseBuilding}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{addr.phone}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div
                className="w-full max-w-lg bg-[#141822] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-white font-display">Add Delivery Address</h3>
                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">House / Building</label>
                    <input
                      type="text"
                      required
                      value={newAddr.houseBuilding}
                      onChange={(e) => setNewAddr({ ...newAddr, houseBuilding: e.target.value })}
                      placeholder="Flat 101, Palm Residency"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Street & Area</label>
                    <input
                      type="text"
                      required
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      placeholder="12th Main Road, Near Park"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs font-display hover:bg-orange-600"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Favorite Bites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-[#121620] rounded-3xl border border-slate-800 p-8">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-bold text-white">No favorites added yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Tap the heart on any pizza, burger or dessert card to save it here!
              </p>
              <button
                onClick={onExploreMenu}
                className="mt-4 px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs font-display hover:bg-orange-600 transition-all"
              >
                EXPLORE MENU
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((prod) => (
                <FoodCard
                  key={prod.id}
                  product={prod}
                  onOpenDetails={onOpenProductDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
