import { useState } from 'react';

export const useForm = (initialValues = {}, validators = {}, onSubmit = async () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: finalValue }));

    if (validators[name]) {
      const errorMsg = validators[name](finalValue, values);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value, values) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = {};
    Object.keys(validators).forEach((key) => {
      const errorMsg = validators[key](values[key], values);
      if (errorMsg) validationErrors[key] = errorMsg;
    });

    setErrors(validationErrors);
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    setValues,
    errors,
    touched,
    isSubmitting,
    serverError,
    setServerError,
    handleChange,
    handleBlur,
    handleSubmit
  };
};