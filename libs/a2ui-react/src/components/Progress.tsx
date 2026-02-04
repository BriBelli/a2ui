import React from 'react';
import type { ProgressProps } from '@a2ui/core';
import type { A2UIComponentProps } from '../registry';

export function Progress({ component }: A2UIComponentProps): React.ReactElement {
  const props = (component.props || {}) as Partial<ProgressProps>;
  const { value = 0, variant = 'linear', indeterminate = false } = props;

  if (variant === 'circular') {
    const size = 40;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <svg
        data-a2ui-id={component.id}
        data-a2ui-type="progress"
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--a2ui-progress-bg, #e0e0e0)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--a2ui-primary-color, #6366f1)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.25 : offset}
          strokeLinecap="round"
          style={
            indeterminate
              ? { animation: 'a2ui-circular-spin 1.5s ease-in-out infinite' }
              : {}
          }
        />
      </svg>
    );
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--a2ui-progress-bg, #e0e0e0)',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const barStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: 'var(--a2ui-primary-color, #6366f1)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
    width: indeterminate ? '30%' : `${Math.min(100, Math.max(0, value))}%`,
    animation: indeterminate ? 'a2ui-linear-indeterminate 1.5s ease-in-out infinite' : 'none',
  };

  return (
    <div
      data-a2ui-id={component.id}
      data-a2ui-type="progress"
      style={containerStyle}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div style={barStyle} />
    </div>
  );
}
