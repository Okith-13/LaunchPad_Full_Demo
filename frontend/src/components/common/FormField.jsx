import React from 'react';

export const FormField = ({ label, name, type = 'text', value, onChange, onBlur, error, touched, required = false, children, ...props }) => {
  const hasError = touched && Boolean(error);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 transition-colors ${
            hasError
              ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'
          }`}
          {...props}
        />
      )}
      {hasError && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
};