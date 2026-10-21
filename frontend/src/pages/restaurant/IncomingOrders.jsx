import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import * as restaurantService from '../../services/restaurantService';
import * as orderService from '../../services/orderService';
import { Panel } from '../../components/common/Panel';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const IncomingOrders = () => {
  const { data: myRestaurantData, loading: loadingRest } = useFetch(restaurantService.getMyRestaurant);
  
  const restaurant = myRestaurantData?.data || myRestaurantData;

  const { data: ordersResponse, refetch } = useFetch(
    () => (restaurant?.id ? orderService.getRestaurantOrders(restaurant.id) : Promise.resolve([])),
    [restaurant?.id]
  );

  const rawOrders = ordersResponse?.data || ordersResponse;
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  useEffect(() => {
    if (!restaurant?.id) return;
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [restaurant?.id, refetch]);

  const handleUpdate = async (orderId, nextStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to update order');
    }
  };

  if (loadingRest) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-sm text-slate-500">
        Loading restaurant profile...
      </div>
    );
  }

  if (!restaurant || !restaurant.id) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 rounded-xl text-center">
        <h2 className="text-xl font-bold text-slate-800">No Restaurant Linked</h2>
        <p className="text-sm text-slate-500 mt-2">
          Your account does not have a registered restaurant yet. Please register your restaurant first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incoming Orders</h1>
          <p className="text-sm text-slate-500">
            Managing: <span className="font-semibold text-slate-800">{restaurant.name}</span> (ID: #{restaurant.id})
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={refetch}>
          Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-sm">
          No orders received for this restaurant yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            if (!order) return null;
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <Panel key={order.id} title={`Order #${order.id} - ${formatCurrency(order.total_amount || 0)}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm mb-4">
                  <div className="space-y-1">
                    <div>
                      <StatusBadge status={order.order_status || 'PENDING'} />
                      <span className="text-xs text-slate-500 ml-3">
                        Placed: {order.created_at ? formatDate(order.created_at) : 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      📍 Dropoff Address: {order.delivery_address || 'No address provided'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.order_status === 'PENDING' && (
                      <Button size="sm" onClick={() => handleUpdate(order.id, 'CONFIRMED')}>
                        Confirm Order
                      </Button>
                    )}
                    {order.order_status === 'CONFIRMED' && (
                      <Button size="sm" onClick={() => handleUpdate(order.id, 'PREPARING')}>
                        Start Preparing
                      </Button>
                    )}
                    {order.order_status === 'PREPARING' && (
                      <Button size="sm" onClick={() => handleUpdate(order.id, 'READY_FOR_PICKUP')}>
                        Ready for Pickup
                      </Button>
                    )}
                    {['PENDING', 'CONFIRMED'].includes(order.order_status) && (
                      <Button size="sm" variant="danger" onClick={() => handleUpdate(order.id, 'CANCELLED')}>
                        Reject / Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1">
                    <span className="font-semibold text-slate-700">Order Items:</span>
                    {items.map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between pl-2">
                        <span>
                          {item.quantity}x {item.item_name || `Item #${item.menu_item_id}`}
                        </span>
                        <span>{formatCurrency(item.total_price || (item.unit_price * item.quantity) || 0)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
};