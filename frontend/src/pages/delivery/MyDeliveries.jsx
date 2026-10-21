import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import * as deliveryService from '../../services/deliveryService';
import { Panel } from '../../components/common/Panel';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const MyDeliveries = () => {
  const {
    data: available,
    loading: loadingAvailable,
    refetch: refetchAvailable
  } = useFetch(deliveryService.getAvailableDeliveries);

  const {
    data: myDeliveries,
    loading: loadingMy,
    refetch: refetchMy
  } = useFetch(deliveryService.getMyDeliveries);

  const handleAccept = async (deliveryId) => {
    try {
      await deliveryService.acceptDelivery(deliveryId);
      refetchAvailable();
      refetchMy();
    } catch (err) {
      alert(err.message || 'Failed to accept delivery');
    }
  };

  const handleStatusUpdate = async (deliveryId, nextStatus) => {
    try {
      await deliveryService.updateDeliveryStatus(deliveryId, nextStatus);
      refetchMy();
    } catch (err) {
      alert(err.message || 'Failed to update delivery status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rider Dashboard</h1>
        <p className="text-sm text-slate-500">Claim ready orders and update delivery progress</p>
      </div>

      {/* Available Orders Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span>🔔</span> Available for Pickup ({available?.length || 0})
        </h2>

        {loadingAvailable ? (
          <div className="p-6 text-sm text-slate-500">Checking available deliveries...</div>
        ) : !available || available.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-sm text-slate-500">
            No orders are currently waiting for a rider.
          </div>
        ) : (
          <div className="space-y-3">
            {available.map((d) => (
              <Panel key={d.id} title={`Order #${d.order_id}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div className="space-y-1">
                    <div><strong>Status:</strong> <StatusBadge status={d.status} /></div>
                    <div className="text-xs text-slate-600">🏪 Pickup: {d.pickup_address}</div>
                    <div className="text-xs text-slate-600">📍 Dropoff: {d.delivery_address}</div>
                  </div>
                  <Button size="sm" onClick={() => handleAccept(d.id)}>
                    Accept Delivery
                  </Button>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </section>

      {/* Driver's Active Deliveries Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span>🛵</span> My Active Assignments ({myDeliveries?.length || 0})
        </h2>

        {loadingMy ? (
          <div className="p-6 text-sm text-slate-500">Loading assignments...</div>
        ) : !myDeliveries || myDeliveries.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-sm text-slate-500">
            You have not accepted any deliveries yet.
          </div>
        ) : (
          <div className="space-y-3">
            {myDeliveries.map((d) => (
              <Panel key={d.id} title={`Delivery #${d.id} (Order #${d.order_id})`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div className="space-y-1">
                    <div><strong>Status:</strong> <StatusBadge status={d.status} /></div>
                    <div className="text-xs text-slate-500">Assigned: {formatDate(d.assigned_time)}</div>
                    <div className="text-xs">🏪 Pickup: {d.pickup_address}</div>
                    <div className="text-xs">📍 Dropoff: {d.delivery_address}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.status === 'ASSIGNED' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(d.id, 'PICKED_UP')}>
                        Confirm Pickup
                      </Button>
                    )}
                    {d.status === 'PICKED_UP' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(d.id, 'ON_THE_WAY')}>
                        Start Journey (On The Way)
                      </Button>
                    )}
                    {d.status === 'ON_THE_WAY' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(d.id, 'DELIVERED')}>
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};