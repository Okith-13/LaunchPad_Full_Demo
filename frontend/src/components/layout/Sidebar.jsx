import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const linksByRole = {
    CUSTOMER: [
      { to: '/restaurants', label: 'Restaurants', icon: '🏪' },
      { to: '/cart', label: 'My Cart', icon: '🛒' },
      { to: '/orders', label: 'Order History', icon: '📦' },
      { to: '/profile', label: 'My Profile & Addresses', icon: '👤' }
    ],
    RESTAURANT_ADMIN: [
      { to: '/my-restaurant', label: 'My Restaurant', icon: '🏢' },
      { to: '/menu', label: 'Menu Management', icon: '📋' },
      { to: '/incoming-orders', label: 'Incoming Orders', icon: '🔔' }
    ],
    DELIVERY_PERSON: [
      { to: '/my-deliveries', label: 'My Deliveries', icon: '🛵' }
    ],
    ADMIN: [
      { to: '/restaurants', label: 'All Restaurants', icon: '🏪' },
      { to: '/incoming-orders', label: 'All Orders', icon: '📦' },
      { to: '/my-deliveries', label: 'Deliveries Dispatch', icon: '🛵' }
    ]
  };

  const links = user ? linksByRole[user.role] || [] : [
    { to: '/restaurants', label: 'Explore Restaurants', icon: '🏪' },
    { to: '/login', label: 'Sign In', icon: '🔑' },
    { to: '/register', label: 'Create Account', icon: '📝' }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between md:hidden">
          <span className="font-bold text-slate-800">Navigation</span>
          <button onClick={onClose} className="p-1 rounded text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};