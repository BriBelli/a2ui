import React, { useState, useEffect } from 'react';
import type { CheckboxProps } from '@a2ui/core';
import { resolveBinding } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Checkbox({ component, data, emit, updateData }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<CheckboxProps>;
  const { label, disabled = false } = props;

  const binding = component.bindings?.checked;
  const boundValue = binding ? resolveBinding(data, binding) : undefined;
  const initialChecked = (boundValue as boolean) ?? props.checked ?? false;

  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    const newBoundValue = binding ? resolveBinding(data, binding) : undefined;
    if (newBoundValue !== undefined && newBoundValue !== checked) {
      setChecked(newBoundValue as boolean);
    }
  }, [data, binding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    
    if (binding) {
      updateData(binding, newChecked);
    }
    
    emit('change', { checked: newChecked });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const checkboxStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    cursor: 'inherit',
    accentColor: 'var(--a2ui-primary-color, #6366f1)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'var(--a2ui-text-color, #333)',
    userSelect: 'none',
  };

  return (
    <label
      data-a2ui-id={component.id}
      data-a2ui-type="checkbox"
      style={containerStyle}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        style={checkboxStyle}
      />
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
