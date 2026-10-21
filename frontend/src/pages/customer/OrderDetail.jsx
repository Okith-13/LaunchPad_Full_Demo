import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as orderService from '../../services/orderService';
import { Panel } from '../../components/common/Panel';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const LIFECYCLE_STEPS = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'PICKED_UP',
  'ON_THE_WAY',
  'DELIVERED'
];

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data || response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderService.updateOrderStatus(id, 'CANCELLED');
      fetchOrder();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading order tracker...</div>;
  if (error) return <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-xl">{error}</div>;
  if (!order) return null;

  const currentStepIndex = LIFECYCLE_STEPS.indexOf(order.order_status);
  const isCancelled = order.order_status === 'CANCELLED';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
          <p className="text-xs text-slate-500">Placed: {formatDate(order.created_at)}</p>
        </div>
        <StatusBadge status={order.order_status} />
      </div>

      {/* Visual Status Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-6">Delivery Progress</h3>
        {isCancelled ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-rose-700 font-semibold">
            This order has been CANCELLED.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${
                      isCompleted ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase ${isCurrent ? 'text-orange-600 font-bold' : 'text-slate-500'}`}>
                    {step.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Items Breakdown */}
      <Panel title="Order Breakdown">
        <div className="divide-y divide-slate-100">
          {(order.items || []).map((item) => (
            <div key={item.id} className="py-3 flex justify-between text-sm">
              <span>{item.quantity}x {item.item_name}</span>
              <span className="font-semibold">{formatCurrency(item.total_price)}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-slate-200 space-y-1 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 pt-2">
              <span>Total Paid</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Cancellation option if PENDING */}
      {order.order_status === 'PENDING' && (
        <div className="flex justify-end">
          <Button variant="danger" loading={cancelling} onClick={handleCancel}>
            Cancel Order
          </Button>
        </div>
      )}
    </div>
  );
};