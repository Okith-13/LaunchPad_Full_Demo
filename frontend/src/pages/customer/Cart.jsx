import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFetch } from '../../hooks/useFetch';
import * as customerService from '../../services/customerService';
import * as orderService from '../../services/orderService';
import { Button } from '../../components/common/Button';
import { Panel } from '../../components/common/Panel';
import { formatCurrency } from '../../utils/formatters';

export const Cart = () => {
  const { cartItems, restaurant, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total } = useCart();
  const { data: addresses } = useFetch(customerService.getAddresses);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setOrderError('Please select a delivery address');
      return;
    }
    setOrderError('');
    setIsPlacing(true);

    try {
      const orderPayload = {
        restaurant_id: restaurant.id,
        delivery_address: selectedAddress,
        delivery_fee: deliveryFee,
        items: cartItems.map((i) => ({
          menu_item_id: i.id,
          item_name: i.item_name,
          quantity: i.quantity,
          unit_price: Number(i.price)
        }))
      };

      const result = await orderService.createOrder(orderPayload);
      clearCart();
      const placedOrder = result.data || result;
      navigate(`/orders/${placedOrder.id}`);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order');
    } finally {
      setIsPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto my-12">
        <span className="text-4xl">🛒</span>
        <h2 className="text-xl font-bold text-slate-800 mt-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">Looks like you haven't added any food yet.</p>
        <Link to="/restaurants">
          <Button>Browse Restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Review Your Order</h1>

      {orderError && (
        <div className="p-3 mb-6 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          {orderError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Panel title={`Items from ${restaurant?.name || 'Restaurant'}`}>
            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.item_name}</h4>
                    <p className="text-xs text-slate-500">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold w-16 text-right">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 text-sm ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Delivery Destination">
            {(!addresses || addresses.length === 0) ? (
              <div className="text-sm text-slate-500">
                You have not registered any delivery address yet.{' '}
                <Link to="/profile" className="text-orange-600 font-semibold underline">
                  Add one in your profile
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => {
                  const fullText = `${addr.address_lines}, ${addr.city} (${addr.address_name})`;
                  return (
                    <label
                      key={addr.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        selectedAddress === fullText ? 'border-orange-500 bg-orange-50/20' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_address"
                        value={fullText}
                        checked={selectedAddress === fullText}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mr-3 text-orange-600"
                      />
                      <div>
                        <div className="text-sm font-semibold">{addr.address_name}</div>
                        <div className="text-xs text-slate-500">{addr.address_lines}, {addr.city}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        <div>
          <Panel title="Summary">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>Total Amount</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              loading={isPlacing}
              onClick={handleCheckout}
            >
              Confirm & Place Order
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
};