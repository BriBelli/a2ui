import React from 'react';
import type { ImageProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Image({ component }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<ImageProps>;
  const { src = '', alt = '', width, height, fit = 'cover' } = props;

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width || '100%',
    height: typeof height === 'number' ? `${height}px` : height || 'auto',
    objectFit: fit,
    borderRadius: 'var(--a2ui-image-radius, 8px)',
  };

  return (
    <img
      data-a2ui-id={component.id}
      data-a2ui-type="image"
      src={src}
      alt={alt}
      style={style}
      loading="lazy"
    />
  );
}
