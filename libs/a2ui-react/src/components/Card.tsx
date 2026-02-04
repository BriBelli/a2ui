import React from 'react';
import type { CardProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Card({ component, children }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<CardProps>;
  const { title, subtitle, elevation = 1, outlined = false } = props;

  const style: React.CSSProperties = {
    backgroundColor: 'var(--a2ui-card-bg, #ffffff)',
    borderRadius: 'var(--a2ui-card-radius, 12px)',
    padding: 'var(--a2ui-card-padding, 16px)',
    boxShadow: outlined
      ? 'none'
      : `0 ${elevation * 2}px ${elevation * 4}px rgba(0,0,0,0.1)`,
    border: outlined ? '1px solid var(--a2ui-border-color, #e0e0e0)' : 'none',
  };

  return (
    <div data-a2ui-id={component.id} data-a2ui-type="card" style={style}>
      {title && (
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
