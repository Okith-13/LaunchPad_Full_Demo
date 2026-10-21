import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import * as restaurantService from '../../services/restaurantService';
import { useCart } from '../../context/CartContext';
import { DataState } from '../../components/common/DataState';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';

export const RestaurantDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  const fetchMenuFn =
    restaurantService.getMenuByRestaurant ||
    restaurantService.getMenuItems ||
    restaurantService.getRestaurantMenu;

  const {
    data: rawRestaurant,
    loading: restLoading,
    error: restError,
    refetch: refetchRestaurant
  } = useFetch(() => restaurantService.getRestaurantById(id), [id]);

  const {
    data: rawMenuItems,
    loading: menuLoading,
    error: menuError,
    refetch: refetchMenu
  } = useFetch(
    () => (id && typeof fetchMenuFn === 'function' ? fetchMenuFn(id) : Promise.resolve([])),
    [id]
  );

  const restaurant = rawRestaurant?.data || rawRestaurant;
  const menuData = rawMenuItems?.data || rawMenuItems;
  const menuItems = Array.isArray(menuData) ? menuData : [];

  const isClosed = (restaurant?.status || '').toUpperCase() === 'CLOSED' || (restaurant?.status || '').toUpperCase() === 'CLOSE';

  const categories = menuItems.reduce((acc, item) => {
    if (!item) return acc;
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <DataState
        loading={restLoading}
        error={restError}
        data={restaurant}
        onRetry={refetchRestaurant}
      >
        {(rest) => (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{rest.name}</h1>
                <p className="text-sm font-semibold text-orange-600 uppercase mt-1">
                  {rest.cuisine_type}
                </p>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    !isClosed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {!isClosed ? '● OPEN' : '○ CLOSED'}
                </span>
              </div>
            </div>

            {rest.description && (
              <p className="text-slate-600 text-sm mt-3">{rest.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
              <span>📍 {rest.address || 'Address not specified'}</span>
              <span>📞 {rest.contact_number || rest.phone || rest.phone_number || 'N/A'}</span>
              {(rest.opening_time || rest.closing_time) && (
                <span>
                  ⏰ {rest.opening_time || '9:00 AM'} - {rest.closing_time || '10:00 PM'}
                </span>
              )}
            </div>
          </div>
        )}
      </DataState>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Menu Items</h2>
          {isClosed && (
            <span className="text-xs text-rose-500 font-medium">
              Restaurant is currently closed. Ordering is disabled.
            </span>
          )}
        </div>

        <DataState
          loading={menuLoading}
          error={menuError}
          data={menuItems}
          onRetry={refetchMenu}
          emptyMessage="No menu items registered yet."
        >
          {() => (
            <div className="space-y-8">
              {Object.keys(categories).map((catName) => (
                <div key={catName}>
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                    {catName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories[catName].map((item) => {
                      const canOrder = item.availability && !isClosed;

                      return (
                        <Card key={item.id} className="flex-row items-center p-4">
                          <div className="flex-1 pr-4">
                            <div className="font-semibold text-slate-900">{item.item_name}</div>
                            {item.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="text-sm font-bold text-orange-600 mt-2">
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            disabled={!canOrder}
                            onClick={() => addItem(item, restaurant)}
                          >
                            {isClosed
                              ? 'Closed'
                              : item.availability
                              ? 'Add to Cart'
                              : 'Unavailable'}
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DataState>
      </div>
    </div>
  );
};