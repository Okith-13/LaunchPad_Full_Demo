import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validatePassword } from '../../utils/validators';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, isSubmitting, serverError, handleChange, handleBlur, handleSubmit } =
    useForm(
      { email: '', password: '' },
      { email: validateEmail, password: validatePassword },
      async (formData) => {
        const loggedUser = await login(formData);
        if (loggedUser.role === 'CUSTOMER') navigate('/restaurants');
        else if (loggedUser.role === 'RESTAURANT_ADMIN') navigate('/my-restaurant');
        else if (loggedUser.role === 'DELIVERY_PERSON') navigate('/my-deliveries');
        else navigate('/restaurants');
      }
    );

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
      <p className="text-sm text-slate-500 mb-6">Sign in to manage and track your food orders.</p>

      {serverError && (
        <div className="p-3 mb-4 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          required
        />
        <Button type="submit" loading={isSubmitting} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-orange-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};