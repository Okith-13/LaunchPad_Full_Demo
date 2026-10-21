import React from 'react';

export const StatusBadge = ({ status }) => {
  const statusStyles = {
    // Order & Delivery lifecycle
    PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
    PREPARING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    READY_FOR_PICKUP: 'bg-purple-100 text-purple-800 border-purple-300',
    ASSIGNED: 'bg-sky-100 text-sky-800 border-sky-300',
    PICKED_UP: 'bg-teal-100 text-teal-800 border-teal-300',
    ON_THE_WAY: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-300',
    FAILED: 'bg-rose-100 text-rose-800 border-rose-300',
    // Entity states
    ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    INACTIVE: 'bg-slate-100 text-slate-800 border-slate-300',
    OPEN: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    CLOSED: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  const currentStyle = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {status?.replace(/_/g, ' ') || 'UNKNOWN'}
    </span>
  );
};