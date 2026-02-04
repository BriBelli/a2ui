import React from 'react';
import type { ChipProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Chip({ component, emit }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<ChipProps>;
  const { label = 'Chip', variant = 'filled', selected = false, deletable = false } = props;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    filled: {
      backgroundColor: selected
        ? 'var(--a2ui-primary-color, #6366f1)'
        : 'var(--a2ui-chip-bg, #e0e0e0)',
      color: selected ? 'white' : 'var(--a2ui-text-color, #333)',
      border: 'none',
    },
    outlined: {
      backgroundColor: selected
        ? 'var(--a2ui-primary-light, #eef2ff)'
        : 'transparent',
      color: selected
        ? 'var(--a2ui-primary-color, #6366f1)'
        : 'var(--a2ui-text-color, #333)',
      border: `1px solid ${
        selected ? 'var(--a2ui-primary-color, #6366f1)' : 'var(--a2ui-border-color, #e0e0e0)'
      }`,
    },
  };

  const handleClick = () => {
    emit('click', { label, selected: !selected });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    emit('delete', { label });
  };

  return (
    <span
      data-a2ui-id={component.id}
      data-a2ui-type="chip"
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={handleClick}
    >
      {label}
      {deletable && (
        <button
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            marginLeft: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            opacity: 0.7,
            color: 'inherit',
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
