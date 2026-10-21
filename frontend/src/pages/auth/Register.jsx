import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, isSubmitting, serverError, handleChange, handleBlur, handleSubmit } =
    useForm(
      { name: '', email: '', password: '', role: 'CUSTOMER' },
      {
        name: (v) => validateRequired(v, 'Name'),
        email: validateEmail,
        password: validatePassword,
        role: (v) => validateRequired(v, 'Role')
      },
      async (formData) => {
        await register(formData);
        navigate('/login');
      }
    );

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h1>
      <p className="text-sm text-slate-500 mb-6">Join to start placing or managing deliveries.</p>

      {serverError && (
        <div className="p-3 mb-4 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          required
        />
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Account Role <span className="text-rose-500">*</span>
          </label>
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="CUSTOMER">Customer (Browse & Order)</option>
            <option value="RESTAURANT_ADMIN">Restaurant Owner (Manage Food)</option>
            <option value="DELIVERY_PERSON">Delivery Rider (Deliver Orders)</option>
          </select>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-orange-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};