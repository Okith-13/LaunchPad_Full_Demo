import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('cart_restaurant');
    if (savedCart && savedRestaurant) {
      try {
        setCartItems(JSON.parse(savedCart));
        setRestaurant(JSON.parse(savedRestaurant));
      } catch {
        localStorage.removeItem('cart');
        localStorage.removeItem('cart_restaurant');
      }
    }
  }, []);

  const persist = (items, rest) => {
    setCartItems(items);
    setRestaurant(rest);
    localStorage.setItem('cart', JSON.stringify(items));
    localStorage.setItem('cart_restaurant', JSON.stringify(rest));
  };

  const addItem = (item, restInfo) => {
    if (restaurant && restaurant.id !== restInfo.id) {
      const confirmChange = window.confirm(
        `Your cart contains items from ${restaurant.name}. Clear it and add items from ${restInfo.name}?`
      );
      if (!confirmChange) return false;
      persist([{ ...item, quantity: 1 }], restInfo);
      return true;
    }

    const existingIndex = cartItems.findIndex((i) => i.id === item.id);
    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cartItems, { ...item, quantity: 1 }];
    }
    persist(updated, restInfo);
    return true;
  };

  const removeItem = (itemId) => {
    const updated = cartItems.filter((i) => i.id !== itemId);
    if (updated.length === 0) {
      clearCart();
    } else {
      persist(updated, restaurant);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const updated = cartItems.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    persist(updated, restaurant);
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_restaurant');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 250 : 0.00;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        restaurant,
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};