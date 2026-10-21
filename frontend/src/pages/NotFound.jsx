import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="text-center py-20">
      <span className="text-6xl">🔍</span>
      <h1 className="text-4xl font-extrabold text-slate-900 mt-4">404 - Page Not Found</h1>
      <p className="text-slate-500 mt-2 mb-6">The page or link you requested does not exist.</p>
      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
};