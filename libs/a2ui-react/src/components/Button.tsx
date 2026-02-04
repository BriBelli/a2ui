import React from 'react';
import type { ButtonProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Button({ component, emit }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<ButtonProps>;
  const { label = 'Button', variant = 'filled', disabled = false, loading = false } = props;

  const baseStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: 'var(--a2ui-button-radius, 8px)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    filled: {
      backgroundColor: 'var(--a2ui-primary-color, #6366f1)',
      color: 'white',
    },
    outlined: {
      backgroundColor: 'transparent',
      color: 'var(--a2ui-primary-color, #6366f1)',
      border: '2px solid var(--a2ui-primary-color, #6366f1)',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'var(--a2ui-primary-color, #6366f1)',
    },
    elevated: {
      backgroundColor: 'var(--a2ui-surface-color, #f5f5f5)',
      color: 'var(--a2ui-primary-color, #6366f1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  };

  const handleClick = () => {
    if (!disabled && !loading) {
      emit('click', { label });
      
      const action = component.events?.click;
      if (action) {
        emit('action', { action });
      }
    }
  };

  return (
    <button
      data-a2ui-id={component.id}
      data-a2ui-type="button"
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'a2ui-spin 1s linear infinite',
          }}
        />
      )}
      {label}
    </button>
  );
}
