import { createContext, useContext } from 'react';
import type { A2UIResponse } from '@a2ui/core';
import type { ReactRegistry } from './registry';

export interface A2UIContextValue {
  /** The current A2UI response being rendered */
  response: A2UIResponse | null;
  /** The component registry */
  registry: ReactRegistry;
  /** Current data model */
  data: Record<string, unknown>;
  /** Update a value in the data model */
  updateData: (path: string, value: unknown) => void;
  /** Emit an event (componentId, event, payload) */
  emit: (componentId: string, event: string, payload?: Record<string, unknown>) => void;
  /** Custom context from the host application */
  hostContext?: unknown;
}

export const A2UIContext = createContext<A2UIContextValue | null>(null);

export function useA2UIContext(): A2UIContextValue {
  const context = useContext(A2UIContext);
  if (!context) {
    throw new Error('useA2UIContext must be used within an A2UIRenderer');
  }
  return context;
}
