import React, { useState, useEffect } from 'react';
import type { SelectProps } from '@a2ui/core';
import { resolveBinding } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Select({ component, data, emit, updateData }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<SelectProps>;
  const {
    label,
    options = [],
    placeholder,
    required = false,
    disabled = false,
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    color: 'var(--a2ui-text-color, #333)',
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 12px',
    fontSize: '14px',
    borderRadius: 'var(--a2ui-input-radius, 8px)',
    border: '2px solid var(--a2ui-border-color, #e0e0e0)',
    outline: 'none',
    backgroundColor: disabled ? 'var(--a2ui-disabled-bg, #f5f5f5)' : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <div
      data-a2ui-id={component.id}
      data-a2ui-type="select"
      style={containerStyle}
    >
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: 'var(--a2ui-error-color, #ef4444)' }}> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        style={selectStyle}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
