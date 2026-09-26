import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Plus,
  Zap,
  Truck,
  Building,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { DeliveryAddress, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { handleImageError } from '../utils/imageFallback';

interface CheckoutViewProps {
  onOrderSuccess: (order: Order) => void;
  onExploreMenu: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onOrderSuccess,
  onExploreMenu,
}) => {
  const { cart, subtotal, deliveryFee, discount, tax, total, appliedCoupon, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  // Step 1: Address selection or input
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault);
      return def ? def.id : user.addresses[0].id;
    }
    return 'new';
  });

  const [addressForm, setAddressForm] = useState<Omit<DeliveryAddress, 'id'>>({
    fullName: user?.name || 'Alex Sharma',
    phone: user?.phone || '+91 98765 43210',
    houseBuilding: 'Flat 402, Skyline Towers',
    street: '14th Main Road, Indiranagar',
    area: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    pincode: '560038',
    type: 'Home',
  });

  // Step 2: Delivery Option
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('express');

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('alex@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 8890 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('884');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Delivery fee adjust for express (+₹30)
  const expressExtra = deliveryOption === 'express' ? 30 : 0;
  const finalTotal = total + expressExtra;

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-4xl">
          🛒
        </div>
        <h2 className="text-2xl font-black text-white font-display">Your cart is empty</h2>
        <p className="text-sm text-slate-400">
          Add some delicious hot items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={onExploreMenu}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm font-display hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
        >
          EXPLORE DELICIOUS MENU
        </button>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let targetAddress: DeliveryAddress;

    if (selectedAddressId !== 'new' && user?.addresses) {
      const found = user.addresses.find((a) => a.id === selectedAddressId);
      if (!found) {
        showToast('Please select or fill a valid delivery address', 'error');
        return;
      }
      targetAddress = found;
    } else {
      // Validate address form
      if (
        !addressForm.fullName.trim() ||
        !addressForm.phone.trim() ||
        !addressForm.houseBuilding.trim() ||
        !addressForm.street.trim() ||
        !addressForm.city.trim() ||
        !addressForm.pincode.trim()
      ) {
        showToast('Please fill all delivery address details', 'error');
        return;
      }

      targetAddress = {
        ...addressForm,
        id: 'addr-' + Date.now(),
      };
      if (user) {
        addAddress(addressForm);
      }
    }

    setIsSubmitting(true);

    // Simulate fast order authorization
    setTimeout(() => {
      const newOrder = placeOrder(
        cart,
        subtotal,
        deliveryFee + expressExtra,
        discount,
        tax,
        finalTotal,
        targetAddress,
        deliveryOption,
        paymentMethod,
        appliedCoupon?.code
      );

      clearCart();
      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
    }, 1200);
  };

  // Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-300">
        <div className="rounded-3xl bg-[#121620] border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
          {/* Success Header Badge */}
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest text-emerald-400 font-black">
              ORDER CONFIRMED & IN KITCHEN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
              Thank You for Your Rush!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your order <strong className="text-orange-400 font-mono">#{confirmedOrder.orderNumber}</strong> has been received by our kitchen. Fresh ingredients are already sizzling!
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Estimated Delivery</span>
              <p className="text-base font-bold text-orange-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4" />
                <span>{confirmedOrder.estimatedDeliveryTime}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Payment Mode</span>
              <p className="text-base font-bold text-white capitalize mt-0.5">
                {confirmedOrder.paymentMethod.toUpperCase()} ({confirmedOrder.paymentStatus})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 font-medium">Grand Total</span>
              <p className="text-base font-black text-amber-400 font-display mt-0.5">
                ₹{confirmedOrder.total}
              </p>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="text-left rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ordered Craving Items ({confirmedOrder.items.length})
            </h4>
            <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto pr-1">
              {confirmedOrder.items.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={handleImageError}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-950 shrink-0"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-white">
                        {item.quantity}x {item.product.name}
                      </h5>
                      {item.customization && (
                        <p className="text-[10px] text-orange-400">
                          {item.customization.cheeseType === 'extra' && 'Extra Cheese • '}
                          {item.customization.spiceLevel && `${item.customization.spiceLevel} spice`}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-200">₹{item.itemTotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address Information */}
          <div className="text-left p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">
                Deliver to: {confirmedOrder.deliveryAddress.fullName} ({confirmedOrder.deliveryAddress.phone})
              </span>
              <p className="text-slate-400 mt-0.5">
                {confirmedOrder.deliveryAddress.houseBuilding}, {confirmedOrder.deliveryAddress.street}, {confirmedOrder.deliveryAddress.area}, {confirmedOrder.deliveryAddress.city} - {confirmedOrder.deliveryAddress.pincode}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onOrderSuccess(confirmedOrder)}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm font-display flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all active:scale-95"
            >
              <span>TRACK LIVE DELIVERY</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={onExploreMenu}
              className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-800 transition-all"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
          Fast-Track Checkout
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Review your delivery details, select your rush speed and finalize your craving.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3 Steps Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 font-black text-sm flex items-center justify-center border border-orange-500/30">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Delivery Address</h3>
                <p className="text-xs text-slate-400">Where should we rush your hot food?</p>
              </div>
            </div>

            {/* Saved Addresses Selector (if available) */}
            {user?.addresses && user.addresses.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Choose from Saved Addresses
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-500/10 border-orange-500 text-white shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-400" />
                            {addr.type || 'Home'}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-white">{addr.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {addr.houseBuilding}, {addr.street}, {addr.city}
                        </p>
                        <p className="text-[11px] text-slate-500">{addr.phone}</p>
                      </div>
                    );
                  })}

                  <div
                    onClick={() => setSelectedAddressId('new')}
                    className={`p-3.5 rounded-2xl border border-dashed cursor-pointer flex items-center justify-center gap-2 transition-all ${
                      selectedAddressId === 'new'
                        ? 'border-orange-500 bg-orange-500/5 text-orange-400'
                        : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-bold">Use Different / New Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* Address Form Fields */}
            {(selectedAddressId === 'new' || !user?.addresses || user.addresses.length === 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="e.g. Alex Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Flat / House / Building</label>
                  <input
                    type="text"
                    required
                    value={addressForm.houseBuilding}
                    onChange={(e) => setAddressForm({ ...addressForm, houseBuilding: e.target.value })}
                    placeholder="e.g. Flat 402, Skyline Towers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="e.g. 14th Main Road, Indiranagar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    required
                    value={addressForm.area}
                    onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                    placeholder="e.g. Near Metro Station"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      placeholder="e.g. 560038"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Delivery Option */}
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 font-black text-sm flex items-center justify-center border border-orange-500/30">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Delivery Speed Option</h3>
                <p className="text-xs text-slate-400">Choose your preferred arrival window</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard */}
              <div
                onClick={() => setDeliveryOption('standard')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryOption === 'standard'
                    ? 'bg-orange-500/10 border-orange-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-400" />
                    Standard Delivery
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Estimated ~35 - 45 mins</p>
              </div>

              {/* Express */}
              <div
                onClick={() => setDeliveryOption('express')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  deliveryOption === 'express'
                    ? 'bg-orange-500/15 border-orange-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="absolute top-0 right-0 px-2.5 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-bl-xl font-display">
                  RECOMMENDED
                </span>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
                    Express Rush Delivery
                  </span>
                  <span className="text-xs font-bold text-orange-400">+₹30</span>
                </div>
                <p className="text-xs text-slate-400">Guaranteed within ~20 - 25 mins</p>
              </div>
            </div>
          </div>

          {/* STEP 3: Payment Method */}
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 font-black text-sm flex items-center justify-center border border-orange-500/30">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Simulated Payment Method</h3>
                <p className="text-xs text-slate-400">Demo payment flow with instant authorization</p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'upi', label: 'UPI / QR', icon: '📱' },
                { id: 'card', label: 'Card', icon: '💳' },
                { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'bg-orange-500/15 border-orange-500 text-white font-bold shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg">{m.icon}</div>
                  <div className="text-xs mt-1">{m.label}</div>
                </button>
              ))}
            </div>

            {/* UPI Option Details */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Enter your VPA / UPI ID (Google Pay, PhonePe, Paytm)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="user@upi"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                  <span className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Demo mode: Payment will be auto-approved instantly upon placing order.
                </p>
              </div>
            )}

            {/* Card Option Details */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD Option Details */}
            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Cash or Digital Payment on Handover</p>
                <p className="text-slate-400">
                  Please keep exact cash ready or scan the rider's QR code upon arrival at your doorstep.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Step 4 Order Summary & Submit Button */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-5 sm:p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-display pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-orange-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </h3>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs gap-2">
                  <div className="truncate flex-1">
                    <span className="font-semibold text-white">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.customization && (
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.customization.cheeseType === 'extra' ? '+Extra Cheese' : ''}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-slate-300 shrink-0">₹{item.itemTotal}</span>
                </div>
              ))}
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>

              {deliveryOption === 'express' && (
                <div className="flex justify-between text-orange-400">
                  <span>Express Rush Surcharge</span>
                  <span>+₹30</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>GST Tax (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-slate-800 font-display">
                <span>Grand Total</span>
                <span className="text-orange-400">₹{finalTotal}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base font-display flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHORIZING RUSH...</span>
                </>
              ) : (
                <>
                  <span>PLACE ORDER • ₹{finalTotal}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safe 256-bit Simulated Payment Encryption</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
