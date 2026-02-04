import React, { useMemo, useCallback, useState, useEffect, type ReactElement } from 'react';
import type { A2UIResponse, A2UIComponent as A2UIComponentType } from '@a2ui/core';
import { findComponent, evaluateCondition, setBinding } from '@a2ui/core';
import { A2UIContext, useA2UIContext, type A2UIContextValue } from './context';
import { createReactRegistry, type ReactRegistry } from './registry';
import { createBuiltinComponents } from './components';

export interface A2UIRendererProps {
  /** The A2UI response to render */
  response: A2UIResponse;
  /** Custom component registry (will be merged with builtins) */
  registry?: ReactRegistry;
  /** Event handler */
  onEvent?: (componentId: string, event: string, payload?: Record<string, unknown>) => void;
  /** Data change handler */
  onDataChange?: (data: Record<string, unknown>) => void;
  /** Additional context for components */
  hostContext?: unknown;
  /** Class name for the root element */
  className?: string;
  /** Style for the root element */
  style?: React.CSSProperties;
}

/**
 * Main A2UI Renderer Component
 * 
 * Renders an A2UI response using registered React components.
 */
export function A2UIRenderer({
  response,
  registry: customRegistry,
  onEvent,
  onDataChange,
  hostContext,
  className,
  style,
}: A2UIRendererProps): ReactElement | null {
  // Create merged registry
  const registry = useMemo(() => {
    const builtinRegistry = createReactRegistry();
    const builtins = createBuiltinComponents();
    builtinRegistry.registerAll(builtins);
    
    if (customRegistry) {
      builtinRegistry.extend(customRegistry);
    }
    
    return builtinRegistry;
  }, [customRegistry]);

  // State management
  const [data, setData] = useState<Record<string, unknown>>(response.data || {});

  // Sync data when response changes
  useEffect(() => {
    setData(response.data || {});
  }, [response]);

  const updateData = useCallback((path: string, value: unknown) => {
    setData((prev) => {
      const newData = setBinding(prev, path, value);
      onDataChange?.(newData);
      return newData;
    });
  }, [onDataChange]);

  const emit = useCallback((componentId: string, event: string, payload?: Record<string, unknown>) => {
    onEvent?.(componentId, event, payload);
  }, [onEvent]);

  // Create context value
  const contextValue: A2UIContextValue = useMemo(
    () => ({
      response,
      registry,
      data,
      updateData,
      emit,
      hostContext,
    }),
    [response, registry, data, updateData, emit, hostContext]
  );

  return (
    <A2UIContext.Provider value={contextValue}>
      <div className={className} style={style} data-a2ui-root>
        <A2UIComponentRenderer id={response.root} />
      </div>
    </A2UIContext.Provider>
  );
}

/**
 * Internal component to render an A2UI component by ID
 * This is a proper React component so hooks work correctly
 */
function A2UIComponentRenderer({ id }: { id: string }): ReactElement | null {
  const { response, registry, data, updateData, emit, hostContext } = useA2UIContext();
  
  const component = findComponent(response!, id);
  
  if (!component) {
    return null;
  }

  // Check conditional rendering
  if (component.when && !evaluateCondition(component.when, data)) {
    return null;
  }

  const entry = registry.get(component.type);
  if (!entry) {
    console.warn(`A2UI: Unknown component type "${component.type}"`);
    return null;
  }

  // Render children as proper components
  const children = component.children?.map((childId) => (
    <A2UIComponentRenderer key={childId} id={childId} />
  ));

  return (
    <entry.Component
      key={component.id}
      component={component}
      data={data}
      emit={(event: string, payload?: Record<string, unknown>) => emit(component.id, event, payload)}
      updateData={updateData}
      hostContext={hostContext}
    >
      {children}
    </entry.Component>
  );
}

/**
 * Public component to render a single A2UI component by ID
 */
export function A2UIComponent({ id }: { id: string }): ReactElement | null {
  return <A2UIComponentRenderer id={id} />;
}
