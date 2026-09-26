import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus, Product, CartItem, DeliveryAddress } from '../types';
import { INITIAL_DEMO_ORDERS, INITIAL_PRODUCTS } from '../data/mockData';
import { useToast } from './ToastContext';

interface OrderContextType {
  orders: Order[];
  products: Product[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  getOrderById: (orderId: string) => Order | undefined;
  placeOrder: (
    items: CartItem[],
    subtotal: number,
    deliveryFee: number,
    discount: number,
    tax: number,
    total: number,
    deliveryAddress: DeliveryAddress,
    deliveryOption: 'standard' | 'express',
    paymentMethod: 'upi' | 'card' | 'cod',
    appliedCouponCode?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderTracking: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetToDefaults: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('biterush_orders');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('biterush_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const updatedInit = INITIAL_PRODUCTS.map((initProd) => {
          const matched = parsed.find((p) => p.id === initProd.id);
          if (matched) {
            return {
              ...matched,
              ...initProd,
            };
          }
          return initProd;
        });
        const customProds = parsed.filter(
          (p) => !INITIAL_PRODUCTS.some((ip) => ip.id === p.id)
        );
        return [...updatedInit, ...customProds];
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(() => {
    return orders.length > 0 ? orders[0].id : null;
  });

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('biterush_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('biterush_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync products to localStorage', e);
    }
  }, [products]);

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase());
  };

  const placeOrder = (
    items: CartItem[],
    subtotal: number,
    deliveryFee: number,
    discount: number,
    tax: number,
    total: number,
    deliveryAddress: DeliveryAddress,
    deliveryOption: 'standard' | 'express',
    paymentMethod: 'upi' | 'card' | 'cod',
    appliedCouponCode?: string
  ): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `BR-${randomSuffix}`;
    const id = `ord-${Date.now()}`;
    const estimatedMinutes = deliveryOption === 'express' ? 22 : 35;

    const newOrder: Order = {
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      items,
      subtotal,
      deliveryFee,
      discount,
      appliedCoupon: appliedCouponCode,
      tax,
      total,
      deliveryAddress,
      deliveryOption,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      estimatedDeliveryTime: `${estimatedMinutes} mins`,
      rider: {
        name: 'Rohan Deshmukh',
        phone: '+91 97654 32190',
        vehicle: 'Ola S1 Pro (KA-05-MD-1188)',
        rating: 4.95,
      },
      timeline: [
        {
          status: 'confirmed',
          timestamp: 'Just now',
          completed: true,
          label: 'Order Confirmed',
          description: 'BiteRush automated kitchen received your order.',
        },
        {
          status: 'preparing',
          timestamp: 'Est. 5 mins',
          completed: false,
          label: 'Food Being Prepared',
          description: 'Chef is baking fresh crust & assembling crispy sides.',
        },
        {
          status: 'packed',
          timestamp: 'Est. 12 mins',
          completed: false,
          label: 'Food Packed & Sealed',
          description: 'Food placed in thermal rush hot-bag.',
        },
        {
          status: 'out_for_delivery',
          timestamp: 'Est. 18 mins',
          completed: false,
          label: 'Out for Delivery',
          description: 'Rider picks up and heads your way on fast route.',
        },
        {
          status: 'delivered',
          timestamp: `Est. ${estimatedMinutes} mins`,
          completed: false,
          label: 'Delivered',
          description: 'Contactless handover at your doorstep.',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch {
      // Safe fallback if canvas not available
    }

    showToast(`Order placed successfully! Order #${orderNumber}`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusOrder: OrderStatus[] = [
            'confirmed',
            'preparing',
            'packed',
            'out_for_delivery',
            'delivered',
          ];
          const currentIndex = statusOrder.indexOf(status);

          const updatedTimeline = ord.timeline.map((step) => {
            const stepIndex = statusOrder.indexOf(step.status);
            return {
              ...step,
              completed: stepIndex <= currentIndex,
              timestamp: stepIndex <= currentIndex && !step.completed ? 'Just now' : step.timestamp,
            };
          });

          return {
            ...ord,
            status,
            timeline: updatedTimeline,
            estimatedDeliveryTime: status === 'delivered' ? 'Delivered' : ord.estimatedDeliveryTime,
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${status.replace(/_/g, ' ')}"`, 'info');
  };

  const advanceOrderTracking = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const stages: OrderStatus[] = [
      'confirmed',
      'preparing',
      'packed',
      'out_for_delivery',
      'delivered',
    ];
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
    }
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `custom-prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added to menu!`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Deleted ${prod?.name || 'product'} from menu`, 'info');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_DEMO_ORDERS);
    localStorage.removeItem('biterush_products');
    localStorage.removeItem('biterush_orders');
    showToast('Reset data to initial defaults.', 'info');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        products,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        getOrderById,
        placeOrder,
        updateOrderStatus,
        advanceOrderTracking,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
