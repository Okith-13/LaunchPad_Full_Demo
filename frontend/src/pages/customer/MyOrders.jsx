import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import * as orderService from '../../services/orderService';
import { Card } from '../../components/common/Card';
import { DataState } from '../../components/common/DataState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MyOrders = () => {
  const { data: orders, loading, error, refetch } = useFetch(orderService.getMyOrders);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Order History</h1>
      <DataState loading={loading} error={error} data={orders} onRetry={refetch} emptyMessage="You haven't placed any orders yet.">
        {(list) => (
          <div className="space-y-4">
            {list.map((order) => (
              <Card key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-bold text-slate-900">Order #{order.id}</span>
                    <StatusBadge status={order.order_status} />
                  </div>
                  <div className="text-xs text-slate-500">
                    Placed on {formatDate(order.created_at)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">📍 {order.delivery_address}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-extrabold text-base text-slate-900">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    Track Order
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
};