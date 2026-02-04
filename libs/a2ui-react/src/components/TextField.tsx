import React, { useState, useEffect } from 'react';
import type { TextFieldProps } from '@a2ui/core';
import { resolveBinding } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function TextField({ component, data, emit, updateData }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<TextFieldProps>;
  const {
    label,
    placeholder,
    type = 'text',
    required = false,
    disabled = false,
    error,
    helperText,
  } = props;

  const binding = component.bindings?.value;
  const boundValue = binding ? resolveBinding(data, binding) : undefined;
  const initialValue = (boundValue as string) ?? props.value ?? '';

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const newBoundValue = binding ? resolveBinding(data, binding) : undefined;
    if (newBoundValue !== undefined && newBoundValue !== value) {
      setValue(newBoundValue as string);
    }
  }, [data, binding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (binding) {
      updateData(binding, newValue);
    }
    
    emit('change', { value: newValue });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: error ? 'var(--a2ui-error-color, #ef4444)' : 'var(--a2ui-text-color, #333)',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: 'var(--a2ui-input-radius, 8px)',
    border: `2px solid ${error ? 'var(--a2ui-error-color, #ef4444)' : 'var(--a2ui-border-color, #e0e0e0)'}`,
    outline: 'none',
    backgroundColor: disabled ? 'var(--a2ui-disabled-bg, #f5f5f5)' : 'white',
    transition: 'border-color 0.2s ease',
  };

  const helperStyle: React.CSSProperties = {
    fontSize: '12px',
    color: error ? 'var(--a2ui-error-color, #ef4444)' : 'var(--a2ui-helper-color, #666)',
  };

  return (
    <div
      data-a2ui-id={component.id}
      data-a2ui-type="text-field"
      style={containerStyle}
    >
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: 'var(--a2ui-error-color, #ef4444)' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={inputStyle}
        aria-label={component.a11y?.label || label}
      />
      {(error || helperText) && <span style={helperStyle}>{error || helperText}</span>}
    </div>
  );
}
