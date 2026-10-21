import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import * as restaurantService from '../../services/restaurantService';
import { Panel } from '../../components/common/Panel';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';

export const MyRestaurant = () => {
  const { data: responseData, loading, refetch } = useFetch(restaurantService.getMyRestaurant);
  const restaurant = responseData?.data || responseData;

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    contact_number: '',
    email: '',
    cuisine_type: '',
    opening_time: '',
    closing_time: '',
    status: 'OPEN'
  });
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (restaurant && restaurant.id) {
      const currentStatus = String(restaurant.status || 'OPEN').toUpperCase();
      const normalizedStatus = ['CLOSED', 'CLOSE', 'INACTIVE'].includes(currentStatus) ? 'CLOSED' : 'OPEN';

      setForm({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        contact_number: restaurant.contact_number || restaurant.phone || restaurant.phone_number || '',
        email: restaurant.email || '',
        cuisine_type: restaurant.cuisine_type || '',
        opening_time: restaurant.opening_time || '',
        closing_time: restaurant.closing_time || '',
        status: normalizedStatus
      });
    }
  }, [restaurant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (restaurant && restaurant.id) {
        await restaurantService.updateRestaurant(restaurant.id, form);
        setIsEditing(false);
      } else {
        await restaurantService.createRestaurant(form);
      }
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to save restaurant details');
    } finally {
      setSubmitting(false);
    }
  };

  const isOpen = (restaurant?.status || '').toUpperCase() === 'OPEN' || (restaurant?.status || '').toUpperCase() === 'ACTIVE';

  const handleToggleStatus = async () => {
    if (!restaurant?.id) return;
    const nextStatus = isOpen ? 'CLOSED' : 'OPEN';
    try {
      await restaurantService.updateRestaurant(restaurant.id, { status: nextStatus });
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to update store status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-sm text-slate-500">
        Loading your restaurant profile...
      </div>
    );
  }

  if (!restaurant || !restaurant.id) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Your Restaurant</h1>
          <p className="text-sm text-slate-500">Set up your store profile to start taking orders.</p>
        </div>

        <Panel title="Restaurant Details">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Restaurant Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <FormField
              label="Cuisine Type"
              name="cuisine_type"
              value={form.cuisine_type}
              onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })}
              required
            />
            <FormField
              label="Contact Number"
              name="contact_number"
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              required
            />
            <FormField
              label="Restaurant Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <FormField
              label="Address"
              name="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <FormField
              label="Opening Time"
              name="opening_time"
              value={form.opening_time}
              onChange={(e) => setForm({ ...form, opening_time: e.target.value })}
              placeholder="e.g., 09:00 AM"
              required
            />
            <FormField
              label="Closing Time"
              name="closing_time"
              value={form.closing_time}
              onChange={(e) => setForm({ ...form, closing_time: e.target.value })}
              placeholder="e.g., 10:00 PM"
              required
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Register Restaurant'}
            </Button>
          </form>
        </Panel>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Restaurant Profile</h1>
          <p className="text-sm text-slate-500">Manage store details and operational status</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={isOpen ? 'outline' : 'primary'}
            onClick={handleToggleStatus}
            className={
              isOpen
                ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }
          >
            {isOpen ? 'Close Restaurant' : 'Open Restaurant'}
          </Button>

          {!isEditing && (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          )}
        </div>
      </div>

      <Panel title={restaurant.name}>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Restaurant Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <FormField
              label="Cuisine Type"
              name="cuisine_type"
              value={form.cuisine_type}
              onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })}
              required
            />
            <FormField
              label="Contact Number"
              name="contact_number"
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              required
            />
            <FormField
              label="Restaurant Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <FormField
              label="Address"
              name="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <FormField
              label="Opening Time"
              name="opening_time"
              value={form.opening_time}
              onChange={(e) => setForm({ ...form, opening_time: e.target.value })}
              placeholder="e.g., 09:00 AM"
              required
            />
            <FormField
              label="Closing Time"
              name="closing_time"
              value={form.closing_time}
              onChange={(e) => setForm({ ...form, closing_time: e.target.value })}
              placeholder="e.g., 10:00 PM"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Store Status
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="OPEN">OPEN (Accepting Orders)</option>
                <option value="CLOSED">CLOSED (Not Accepting Orders)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Restaurant ID:</span>
              <span className="font-semibold text-slate-800">#{restaurant.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Cuisine:</span>
              <span className="font-semibold text-slate-800">{restaurant.cuisine_type}</span>
            </div>
            <div className="border-b border-slate-100 pb-2">
              <div className="text-slate-500 mb-1">Description:</div>
              <p className="font-semibold text-slate-800 whitespace-pre-wrap">
                {restaurant.description || 'No description provided'}
              </p>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-slate-800">
                {restaurant.contact_number || restaurant.phone || restaurant.phone_number || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Restaurant Email:</span>
              <span className="font-semibold text-slate-800">{restaurant.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Physical Address:</span>
              <span className="font-semibold text-slate-800">{restaurant.address}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Opening Hours:</span>
              <span className="font-semibold text-slate-800">
                {restaurant.opening_time || 'N/A'} - {restaurant.closing_time || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500">Current Status:</span>
              <span
                className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                  isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isOpen ? '● OPEN' : '○ CLOSED'}
              </span>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
};