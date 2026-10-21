import React from 'react';
import { Button } from './Button';

export const DataState = ({ loading, error, data, onRetry, emptyMessage = 'No data available', children }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <p className="text-sm text-slate-500">Loading data, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl max-w-lg mx-auto my-6">
        <h3 className="text-base font-semibold text-rose-800">Failed to load data</h3>
        <p className="text-sm text-rose-600 mt-1 mb-4">{error}</p>
        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry}>
            Retry Request
          </Button>
        )}
      </div>
    );
  }

  const isEmpty = !data || (Array.isArray(data) && data.length === 0);
  if (isEmpty) {
    return (
      <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl my-6">
        <p className="text-slate-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return typeof children === 'function' ? children(data) : children;
};