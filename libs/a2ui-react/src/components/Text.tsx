import React from 'react';
import type { TextProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Text({ component }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<TextProps>;
  const { content = '', variant = 'body', size = 'md', weight = 'normal', color } = props;

  const sizeMap: Record<string, string> = {
    sm: '12px',
    md: '14px',
    lg: '18px',
    xl: '24px',
  };

  const weightMap: Record<string, number> = {
    normal: 400,
    medium: 500,
    bold: 700,
  };

  const style: React.CSSProperties = {
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: color || 'var(--a2ui-text-color, #333)',
    margin: 0,
    lineHeight: 1.5,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    heading: {
      fontSize: '24px',
      fontWeight: 700,
      marginBottom: '8px',
    },
    body: {},
    caption: {
      fontSize: '12px',
      color: 'var(--a2ui-caption-color, #666)',
    },
    label: {
      fontSize: '14px',
      fontWeight: 500,
    },
  };

  const Element = variant === 'heading' ? 'h2' : 'p';

  return (
    <Element
      data-a2ui-id={component.id}
      data-a2ui-type="text"
      style={{ ...style, ...variantStyles[variant] }}
    >
      {content}
    </Element>
  );
}
