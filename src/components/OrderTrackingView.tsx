import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Bike,
  Package,
  Utensils,
  ChevronRight,
  ShieldCheck,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useOrders } from '../context/OrderContext';
import { handleImageError } from '../utils/imageFallback';

interface OrderTrackingViewProps {
  onExploreMenu: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ onExploreMenu }) => {
  const { orders, activeTrackingOrderId, setActiveTrackingOrderId, advanceOrderTracking, updateOrderStatus } =
    useOrders();

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (orders.length === 0) return null;
    if (activeTrackingOrderId) {
      const found = orders.find((o) => o.id === activeTrackingOrderId);
      if (found) return found;
    }
    return orders[0];
  });

  // Keep activeOrder synced with context changes
  useEffect(() => {
    if (orders.length > 0) {
      if (activeTrackingOrderId) {
        const found = orders.find((o) => o.id === activeTrackingOrderId);
        if (found) {
          setActiveOrder(found);
          return;
        }
      }
      setActiveOrder(orders[0]);
    } else {
      setActiveOrder(null);
    }
  }, [orders, activeTrackingOrderId]);

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-4xl">
          📍
        </div>
        <h2 className="text-2xl font-black text-white font-display">No Active Orders</h2>
        <p className="text-sm text-slate-400">
          You haven't placed an order yet. Treat yourself to our delicious burgers or pizzas!
        </p>
        <button
          onClick={onExploreMenu}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm font-display hover:from-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          ORDER FOOD NOW
        </button>
      </div>
    );
  }

  const timelineSteps: {
    status: OrderStatus;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      status: 'confirmed',
      title: 'Order Confirmed',
      subtitle: 'Order received and verified by kitchen',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      status: 'preparing',
      title: 'Food Being Prepared',
      subtitle: 'Chef baking crust & assembling fresh sides',
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      status: 'packed',
      title: 'Food Packed & Sealed',
      subtitle: 'Sealed in tamper-proof thermal insulation bags',
      icon: <Package className="w-5 h-5" />,
    },
    {
      status: 'out_for_delivery',
      title: 'Out for Delivery',
      subtitle: `${activeOrder.rider?.name || 'Rider'} is rushing to your location`,
      icon: <Bike className="w-5 h-5" />,
    },
    {
      status: 'delivered',
      title: 'Delivered',
      subtitle: 'Delivered safely at your doorstep. Bon appétit!',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  const statusHierarchy: OrderStatus[] = [
    'confirmed',
    'preparing',
    'packed',
    'out_for_delivery',
    'delivered',
  ];

  const currentStepIndex = statusHierarchy.indexOf(activeOrder.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Order Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-orange-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE KITCHEN & GPS DISPATCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display mt-1">
            Track Order #{activeOrder.orderNumber}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Placed on {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeOrder.deliveryOption === 'express' ? 'Express Rush' : 'Standard'} Delivery
          </p>
        </div>

        {/* Order Selector (if multiple orders exist) */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Switch Order:</span>
            <select
              value={activeOrder.id}
              onChange={(e) => {
                setActiveTrackingOrderId(e.target.value);
                const o = orders.find((ord) => ord.id === e.target.value);
                if (o) setActiveOrder(o);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.orderNumber} ({o.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Timeline & Interactive Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Progress Card */}
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Arrival
                </span>
                <div className="text-2xl sm:text-3xl font-black text-orange-400 font-display mt-0.5 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  <span>
                    {activeOrder.status === 'delivered' ? 'Delivered' : activeOrder.estimatedDeliveryTime}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-orange-500/15 border border-orange-500/30 text-orange-400">
                  {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Vertical Visual Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    {/* Node Circle */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                        isCurrent
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 ring-4 ring-orange-500/20 scale-110'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-900 border border-slate-700 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-bold text-sm sm:text-base ${
                            isCurrent
                              ? 'text-orange-400 font-display'
                              : isPassed
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Demo Simulation Advance Controls */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl">
              <div>
                <h5 className="font-bold text-xs text-white">Interactive Demo Controls</h5>
                <p className="text-[11px] text-slate-400">
                  Simulate live kitchen & delivery rider progression
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => advanceOrderTracking(activeOrder.id)}
                  disabled={activeOrder.status === 'delivered'}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-bold text-xs font-display flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Advance Status</span>
                </button>
                <button
                  onClick={() => updateOrderStatus(activeOrder.id, 'confirmed')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Reset to confirmed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Rider Details Card */}
          {activeOrder.rider && (
            <div className="rounded-3xl bg-[#121620] border border-slate-800 p-5 sm:p-6 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                  {activeOrder.rider.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{activeOrder.rider.name}</h4>
                    <span className="text-xs text-amber-400 font-bold">
                      ★ {activeOrder.rider.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{activeOrder.rider.vehicle}</p>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    ⚡ Certified 25-Min Rush Rider
                  </span>
                </div>
              </div>

              <a
                href={`tel:${activeOrder.rider.phone}`}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Call Rider</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Order Items, Address & Invoice Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
            {/* Delivery Destination */}
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Delivery Address</span>
              </div>
              <p className="font-bold text-sm text-white">
                {activeOrder.deliveryAddress.fullName} ({activeOrder.deliveryAddress.phone})
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeOrder.deliveryAddress.houseBuilding}, {activeOrder.deliveryAddress.street},{' '}
                {activeOrder.deliveryAddress.area}, {activeOrder.deliveryAddress.city} -{' '}
                {activeOrder.deliveryAddress.pincode}
              </p>
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ordered Food ({activeOrder.items.length} items)
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activeOrder.items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        onError={(e) => handleImageError(e, item.product.category)}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">
                          {item.quantity}x {item.product.name}
                        </span>
                        {item.customization && (
                          <span className="text-[10px] text-orange-400">
                            {item.customization.cheeseType === 'extra' && 'Extra Cheese • '}
                            {item.customization.spiceLevel && `${item.customization.spiceLevel}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-slate-200 shrink-0">₹{item.itemTotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{activeOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({activeOrder.appliedCoupon})</span>
                  <span>-₹{activeOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Taxes & GST (5%)</span>
                <span>₹{activeOrder.tax}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800 font-display">
                <span>Total Paid</span>
                <span className="text-orange-400">₹{activeOrder.total}</span>
              </div>
            </div>

            {/* Order Another CTA */}
            <button
              onClick={onExploreMenu}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all text-center block"
            >
              Order Something Else
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
