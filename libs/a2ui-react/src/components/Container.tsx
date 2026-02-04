import React from 'react';
import type { ContainerProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Container({ component, children }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<ContainerProps>;
  const {
    direction = 'column',
    gap = '12px',
    padding = '0',
    align = 'stretch',
    justify = 'start',
    wrap = false,
  } = props;

  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  };

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  return (
    <div
      data-a2ui-id={component.id}
      data-a2ui-type="container"
      style={style}
    >
      {children}
    </div>
  );
}
