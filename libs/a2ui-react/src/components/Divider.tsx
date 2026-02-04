import React from 'react';
import type { DividerProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Divider({ component }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<DividerProps>;
  const { orientation = 'horizontal', inset = false } = props;

  const isHorizontal = orientation === 'horizontal';

  const style: React.CSSProperties = {
    backgroundColor: 'var(--a2ui-divider-color, #e0e0e0)',
    border: 'none',
    margin: inset ? (isHorizontal ? '0 16px' : '16px 0') : '0',
    ...(isHorizontal
      ? { height: '1px', width: '100%' }
      : { width: '1px', height: '100%', alignSelf: 'stretch' }),
  };

  return (
    <hr
      data-a2ui-id={component.id}
      data-a2ui-type="divider"
      style={style}
    />
  );
}
