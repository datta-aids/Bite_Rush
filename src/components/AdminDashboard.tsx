import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
  Search,
  Tag,
  Layers,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { Product, OrderStatus, CategoryId } from '../types';
import { CATEGORIES, INITIAL_COUPONS } from '../data/mockData';
import { handleImageError } from '../utils/imageFallback';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  } = useOrders();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'products' | 'offers' | 'categories'>('orders');

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'burgers' as CategoryId,
    description: '',
    price: 199,
    originalPrice: 249,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 120,
    prepTimeMinutes: 15,
  });

  // Calculate Metrics
  const totalOrdersCount = orders.length;
  const todaySales = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalCustomers = 48 + orders.length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const popularProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.ratingCount - a.ratingCount)
      .slice(0, 5);
  }, [products]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'burgers',
      description: '',
      price: 199,
      originalPrice: 249,
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      ratingCount: 120,
      prepTimeMinutes: 15,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price + 50,
      isVeg: prod.isVeg,
      image: prod.image,
      rating: prod.rating,
      ratingCount: prod.ratingCount,
      prepTimeMinutes: prod.prepTimeMinutes || 15,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || productForm.price <= 0) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productForm,
      });
    } else {
      addProduct(productForm);
    }
    setIsProductModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30 uppercase tracking-widest">
              MANAGEMENT CONSOLE
            </span>
            <span className="text-xs text-slate-400">• LocalStorage Synced</span>
          </div>
          <h2 className="text-3xl font-black text-white font-display mt-1">
            BiteRush Kitchen & Store Operations
          </h2>
          <p className="text-sm text-slate-400">
            Real-time control over orders, menu pricing, inventory and active promotions.
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
          title="Reset products and demo orders"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Defaults</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#121620] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">↑ 14% vs yesterday</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121620] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Today's Sales</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
            ₹{todaySales}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">98.4% online prepaid</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121620] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Registered Foodies</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {totalCustomers}
          </div>
          <p className="text-[11px] text-slate-400">Active craving accounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#121620] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active In-Kitchen</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {activeOrdersCount}
          </div>
          <p className="text-[11px] text-orange-400 font-medium">⚡ Average 18 min prep</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'orders', label: `Live Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Menu Catalog (${products.length})`, icon: TrendingUp },
          { id: 'offers', label: 'Offers & Coupons', icon: Tag },
          { id: 'categories', label: 'Categories', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeAdminTab === tab.id
                  ? 'bg-orange-500 text-slate-950 font-display shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Live Orders Manager */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#121620] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white font-display">Recent Customer Orders</h3>
              <span className="text-xs text-slate-400">Click dropdown to update live kitchen status</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Craving Items</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status & Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                        #{ord.orderNumber}
                        <div className="text-[10px] text-slate-500">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{ord.deliveryAddress.fullName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {ord.deliveryAddress.area}, {ord.deliveryAddress.city}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          {ord.items.map((i) => (
                            <div key={i.cartItemId} className="truncate text-slate-300">
                              {i.quantity}x {i.product.name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-display text-sm">₹{ord.total}</div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {ord.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-orange-400 focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Food Being Prepared</option>
                          <option value="packed">Food Packed</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Menu Catalog Manager */}
      {activeAdminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">
              Dish Catalog ({products.length} Products)
            </h3>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs font-display flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="rounded-3xl bg-[#121620] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Diet</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={handleImageError}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{p.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {p.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 capitalize font-medium text-slate-300">{p.category}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isVeg ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {p.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-white font-display text-sm">
                        ₹{p.price}
                      </td>

                      <td className="py-3 px-4 font-bold text-amber-400">★ {p.rating}</td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Edit dish"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Offers Manager */}
      {activeAdminTab === 'offers' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white font-display">Active Marketing Coupons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_COUPONS.map((cp) => (
              <div
                key={cp.code}
                className="p-5 rounded-3xl bg-[#121620] border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm text-orange-400">{cp.code}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{cp.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{cp.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                  Minimum Order: ₹{cp.minOrder}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Categories Manager */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white font-display">Food Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-3xl bg-[#121620] border border-slate-800 flex items-center gap-4"
                >
                  <div className="text-3xl p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                    <span className="text-[11px] font-bold text-orange-400 mt-1 inline-block">
                      {count} items active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-lg bg-[#141822] border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white font-display">
              {editingProduct ? 'Edit Food Product' : 'Add New Food Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Veg / Non-Veg</label>
                  <select
                    value={productForm.isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setProductForm({ ...productForm, isVeg: e.target.value === 'veg' })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={productForm.prepTimeMinutes}
                    onChange={(e) =>
                      setProductForm({ ...productForm, prepTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs font-display hover:bg-orange-600"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
