import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import * as restaurantService from '../../services/restaurantService';
import { Panel } from '../../components/common/Panel';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { formatCurrency } from '../../utils/formatters';

export const MenuManagement = () => {
  const { data: myRestaurantData, loading: loadingRest } = useFetch(restaurantService.getMyRestaurant);
  const restaurant = myRestaurantData?.data || myRestaurantData;

  const { data: menuResponse, loading: loadingMenu, refetch } = useFetch(
    () => (restaurant?.id ? restaurantService.getMenuItems(restaurant.id) : Promise.resolve([])),
    [restaurant?.id]
  );

  const rawMenu = menuResponse?.data || menuResponse;
  const menuItems = Array.isArray(rawMenu) ? rawMenu : [];

  const [form, setForm] = useState({
    item_name: '',
    description: '',
    price: '',
    category: '',
    availability: true
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurant?.id) return;
    setSubmitting(true);
    try {
      await restaurantService.createMenuItem({
        restaurant_id: restaurant.id,
        ...form,
        price: parseFloat(form.price)
      });
      setForm({ item_name: '', description: '', price: '', category: '', availability: true });
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await restaurantService.updateMenuItem(item.id, {
        availability: !item.availability
      });
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to update item availability');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await restaurantService.deleteMenuItem(itemId);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  };

  if (loadingRest) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-sm text-slate-500">Loading restaurant...</div>;
  }

  if (!restaurant || !restaurant.id) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 rounded-xl text-center">
        <h2 className="text-xl font-bold text-slate-800">No Restaurant Found</h2>
        <p className="text-sm text-slate-500 mt-2">Create your restaurant profile before adding menu items.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
        <p className="text-sm text-slate-500">Managing menu for: {restaurant.name}</p>
      </div>

      <Panel title="Add New Menu Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Item Name"
              name="item_name"
              value={form.item_name}
              onChange={(e) => setForm({ ...form, item_name: e.target.value })}
              required
            />
            <FormField
              label="Category"
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g., Appetizer, Main, Dessert"
              required
            />
            <FormField
              label="Price (Rs.)"
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 1200.00"
              required
            />
            <FormField
              label="Description"
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Menu Item'}
          </Button>
        </form>
      </Panel>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Current Menu ({menuItems.length})</h2>
        {loadingMenu ? (
          <div className="p-6 text-sm text-slate-500">Loading menu items...</div>
        ) : menuItems.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-sm text-slate-500">
            No menu items added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Panel key={item.id} title={item.item_name}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">{item.category}</span>
                    <span className="text-emerald-600">{formatCurrency(item.price)}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className={`text-xs font-semibold ${item.availability ? 'text-green-600' : 'text-rose-500'}`}>
                      {item.availability ? '● Available' : '○ Unavailable'}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleToggleAvailability(item)}>
                        {item.availability ? 'Mark Unavailable' : 'Mark Available'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
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