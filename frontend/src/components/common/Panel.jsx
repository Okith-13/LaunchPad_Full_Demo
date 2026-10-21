import React from 'react';

export const Panel = ({ title, actions, children, footer, className = '' }) => {
  return (
    <section className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
        {title && <h2 className="text-xl font-bold text-slate-800">{title}</h2>}
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-slate-100">{footer}</div>}
    </section>
  );
};