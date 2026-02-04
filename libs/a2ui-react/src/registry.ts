import type { ReactElement, ReactNode, ComponentType } from 'react';
import type { A2UIComponent } from '@a2ui/core';

/**
 * Props passed to A2UI React components
 */
export interface A2UIComponentProps {
  component: A2UIComponent;
  data: Record<string, unknown>;
  emit: (event: string, payload?: Record<string, unknown>) => void;
  updateData: (path: string, value: unknown) => void;
  hostContext?: unknown;
  children?: ReactNode;
}

/**
 * Registry entry for a React component
 */
export interface ReactRegistryEntry {
  type: string;
  Component: ComponentType<A2UIComponentProps>;
  builtin?: boolean;
  meta?: {
    displayName?: string;
    description?: string;
    category?: string;
  };
}

/**
 * React component registry
 */
export class ReactRegistry {
  private components: Map<string, ReactRegistryEntry> = new Map();

  register(entry: ReactRegistryEntry): this {
    this.components.set(entry.type, entry);
    return this;
  }

  registerAll(entries: ReactRegistryEntry[]): this {
    entries.forEach((entry) => this.register(entry));
    return this;
  }

  get(type: string): ReactRegistryEntry | undefined {
    return this.components.get(type);
  }

  has(type: string): boolean {
    return this.components.has(type);
  }

  getTypes(): string[] {
    return Array.from(this.components.keys());
  }

  extend(other: ReactRegistry): this {
    other.components.forEach((entry, type) => {
      if (!this.components.has(type)) {
        this.components.set(type, entry);
      }
    });
    return this;
  }
}

/**
 * Create a new React component registry
 */
export function createReactRegistry(): ReactRegistry {
  return new ReactRegistry();
}
