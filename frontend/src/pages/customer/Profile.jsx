import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import * as customerService from '../../services/customerService';
import { Panel } from '../../components/common/Panel';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';

export const Profile = () => {
  const { data: profile, refetch: refetchProfile } = useFetch(customerService.getProfile);
  const { data: addresses, refetch: refetchAddresses } = useFetch(customerService.getAddresses);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    profile_image: ''
  });

  const [addressForm, setAddressForm] = useState({
    address_name: 'Home',
    address_lines: '',
    city: '',
    postal_code: '',
    is_default: false
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        await customerService.updateProfile(profileForm);
      } else {
        await customerService.createProfile(profileForm);
      }
      setIsEditingProfile(false);
      refetchProfile();
    } catch (err) {
      alert(err.message || 'Failed to save profile');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerService.addAddress(addressForm);
      setAddressForm({ address_name: 'Home', address_lines: '', city: '', postal_code: '', is_default: false });
      refetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete address?')) return;
    try {
      await customerService.deleteAddress(id);
      refetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Panel
        title="Customer Profile"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (profile) setProfileForm(profile);
              setIsEditingProfile(!isEditingProfile);
            }}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </Button>
        }
      >
        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="first_name"
                value={profileForm.first_name}
                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                required
              />
              <FormField
                label="Last Name"
                name="last_name"
                value={profileForm.last_name}
                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                required
              />
            </div>
            <FormField
              label="Phone Number"
              name="phone_number"
              value={profileForm.phone_number}
              onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
              required
            />
            <Button type="submit" size="sm">Save Profile</Button>
          </form>
        ) : profile ? (
          <div className="text-sm space-y-2">
            <div><strong>Name:</strong> {profile.first_name} {profile.last_name}</div>
            <div><strong>Phone:</strong> {profile.phone_number}</div>
            <div><strong>Status:</strong> {profile.status}</div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            No profile information recorded yet. Click Edit Profile to set up your details.
          </div>
        )}
      </Panel>

      <Panel title="Saved Addresses">
        <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
          <FormField
            label="Label (e.g. Home, Work)"
            name="address_name"
            value={addressForm.address_name}
            onChange={(e) => setAddressForm({ ...addressForm, address_name: e.target.value })}
            required
          />
          <FormField
            label="Street Address"
            name="address_lines"
            value={addressForm.address_lines}
            onChange={(e) => setAddressForm({ ...addressForm, address_lines: e.target.value })}
            required
          />
          <FormField
            label="City"
            name="city"
            value={addressForm.city}
            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
            required
          />
          <FormField
            label="Postal Code"
            name="postal_code"
            value={addressForm.postal_code}
            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
            required
          />
          <div className="sm:col-span-2 flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
              />
              <span>Set as default address</span>
            </label>
            <Button type="submit" size="sm">Add Address</Button>
          </div>
        </form>

        <div className="space-y-3">
          {(addresses || []).map((addr) => (
            <div key={addr.id} className="p-3 border rounded-lg flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold text-slate-800">{addr.address_name}</span>
                {addr.is_default && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Default</span>}
                <div className="text-xs text-slate-500">{addr.address_lines}, {addr.city} {addr.postal_code}</div>
              </div>
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};