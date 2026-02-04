/**
 * A2UI Utility Functions
 */

import type { A2UIResponse, A2UIComponent, A2UIUpdate } from './types';

/**
 * Build a component tree from a flat A2UI response
 */
export interface ComponentNode extends A2UIComponent {
  childNodes: ComponentNode[];
}

/**
 * Convert flat component list to a tree structure
 */
export function buildComponentTree(response: A2UIResponse): ComponentNode | null {
  const componentMap = new Map<string, A2UIComponent>();
  
  // Index all components by ID
  response.components.forEach((comp) => {
    componentMap.set(comp.id, comp);
  });

  // Recursive function to build tree
  function buildNode(id: string): ComponentNode | null {
    const component = componentMap.get(id);
    if (!component) return null;

    const childNodes: ComponentNode[] = [];
    if (component.children) {
      for (const childId of component.children) {
        const childNode = buildNode(childId);
        if (childNode) {
          childNodes.push(childNode);
        }
      }
    }

    return {
      ...component,
      childNodes,
    };
  }

  return buildNode(response.root);
}

/**
 * Find a component by ID in a response
 */
export function findComponent(
  response: A2UIResponse,
  id: string
): A2UIComponent | undefined {
  return response.components.find((c) => c.id === id);
}

/**
 * Get all component IDs from a response
 */
export function getComponentIds(response: A2UIResponse): string[] {
  return response.components.map((c) => c.id);
}

/**
 * Apply an update to an A2UI response (immutably)
 */
export function applyUpdate(
  response: A2UIResponse,
  update: A2UIUpdate
): A2UIResponse {
  const newResponse = { ...response };

  switch (update.operation) {
    case 'add':
      if (update.component) {
        newResponse.components = [
          ...response.components,
          update.component as A2UIComponent,
        ];
      }
      break;

    case 'remove':
      newResponse.components = response.components.filter(
        (c) => c.id !== update.targetId
      );
      // Also remove from parent's children arrays
      newResponse.components = newResponse.components.map((c) => {
        if (c.children?.includes(update.targetId)) {
          return {
            ...c,
            children: c.children.filter((id) => id !== update.targetId),
          };
        }
        return c;
      });
      break;

    case 'update':
      newResponse.components = response.components.map((c) => {
        if (c.id === update.targetId && update.component) {
          return { ...c, ...update.component };
        }
        return c;
      });
      break;

    case 'replace':
      newResponse.components = response.components.map((c) => {
        if (c.id === update.targetId && update.component) {
          return { id: c.id, ...update.component } as A2UIComponent;
        }
        return c;
      });
      break;
  }

  // Apply data updates
  if (update.data) {
    newResponse.data = {
      ...response.data,
      ...update.data,
    };
  }

  return newResponse;
}

/**
 * Apply multiple updates to a response
 */
export function applyUpdates(
  response: A2UIResponse,
  updates: A2UIUpdate[]
): A2UIResponse {
  return updates.reduce((res, update) => applyUpdate(res, update), response);
}

/**
 * Resolve a data binding path to a value
 */
export function resolveBinding(
  data: Record<string, unknown>,
  path: string
): unknown {
  const parts = path.split('.');
  let current: unknown = data;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Set a value at a binding path (immutably)
 */
export function setBinding(
  data: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const parts = path.split('.');
  
  if (parts.length === 1) {
    return { ...data, [path]: value };
  }

  const [first, ...rest] = parts;
  const nested = (data[first] as Record<string, unknown>) || {};
  
  return {
    ...data,
    [first]: setBinding(nested, rest.join('.'), value),
  };
}

/**
 * Evaluate a conditional expression against data
 * Supports simple expressions like "data.showField === true"
 */
export function evaluateCondition(
  condition: string,
  data: Record<string, unknown>
): boolean {
  // Simple expression evaluator - can be extended
  try {
    // Replace data references with actual values
    const evaluated = condition.replace(/data\.(\w+(?:\.\w+)*)/g, (_, path) => {
      const value = resolveBinding(data, path);
      return JSON.stringify(value);
    });

    // Basic operators
    if (evaluated.includes('===')) {
      const [left, right] = evaluated.split('===').map((s) => s.trim());
      return JSON.parse(left) === JSON.parse(right);
    }
    if (evaluated.includes('!==')) {
      const [left, right] = evaluated.split('!==').map((s) => s.trim());
      return JSON.parse(left) !== JSON.parse(right);
    }
    if (evaluated.includes('&&')) {
      const parts = evaluated.split('&&').map((s) => s.trim());
      return parts.every((p) => JSON.parse(p));
    }
    if (evaluated.includes('||')) {
      const parts = evaluated.split('||').map((s) => s.trim());
      return parts.some((p) => JSON.parse(p));
    }

    // Truthy check
    const value = resolveBinding(data, condition.replace('data.', ''));
    return Boolean(value);
  } catch {
    console.warn(`A2UI: Failed to evaluate condition: ${condition}`);
    return true;
  }
}

/**
 * Generate a unique component ID
 */
export function generateId(prefix: string = 'a2ui'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an A2UI response
 */
export function cloneResponse(response: A2UIResponse): A2UIResponse {
  return JSON.parse(JSON.stringify(response));
}

/**
 * Create an empty A2UI response
 */
export function createEmptyResponse(): A2UIResponse {
  const rootId = generateId('root');
  return {
    version: '0.8',
    root: rootId,
    components: [
      {
        id: rootId,
        type: 'container',
        props: { direction: 'column' },
        children: [],
      },
    ],
    data: {},
  };
}
