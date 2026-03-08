import React from 'react';

const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  placeholder,
  helpText,
  className = '',
  disabled = false,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  autoComplete,
}) => {
  // 输入框类型
  const inputClasses = `mt-1 block w-full rounded-md ${
    error
      ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  } shadow-sm sm:text-sm ${className} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={inputClasses}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
