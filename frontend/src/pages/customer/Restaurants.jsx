import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import * as restaurantService from '../../services/restaurantService';
import { Card } from '../../components/common/Card';
import { DataState } from '../../components/common/DataState';
import { StatusBadge } from '../../components/common/StatusBadge';

export const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: restaurants, loading, error, refetch } = useFetch(restaurantService.getRestaurants);

  const filtered = (restaurants || []).filter((r) =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Restaurants</h1>
          <p className="text-sm text-slate-500">Find the best food spots around your city</p>
        </div>
        <input
          type="text"
          placeholder="Search by restaurant or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm w-full sm:w-72 bg-white"
        />
      </div>

      <DataState loading={loading} error={error} data={filtered} onRetry={refetch} emptyMessage="No restaurants match your search.">
        {(list) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
                <Card.Header>
                  <span>{restaurant.name}</span>
                  <StatusBadge status={restaurant.status} />
                </Card.Header>
                <Card.Body>
                  <p className="text-xs uppercase font-bold text-orange-600 tracking-wider mb-1">
                    {restaurant.cuisine_type}
                  </p>
                  <p className="text-sm line-clamp-2 text-slate-600 mb-3">{restaurant.description}</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>📍 {restaurant.address}</div>
                    <div>⏰ {restaurant.opening_time} - {restaurant.closing_time}</div>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="w-full text-center py-2 px-4 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
                  >
                    View Menu
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
};