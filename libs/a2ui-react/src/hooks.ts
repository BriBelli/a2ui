import { useState, useCallback, useMemo, useEffect } from 'react';
import type { A2UIResponse, A2UIUpdate, A2UIEvent } from '@a2ui/core';
import { applyUpdate, setBinding, cloneResponse } from '@a2ui/core';

export interface UseA2UIOptions {
  /** Initial A2UI response */
  initialResponse?: A2UIResponse | null;
  /** Callback when an event is emitted */
  onEvent?: (event: A2UIEvent) => void;
  /** Callback when data changes */
  onDataChange?: (data: Record<string, unknown>) => void;
}

export interface UseA2UIResult {
  /** Current A2UI response */
  response: A2UIResponse | null;
  /** Set the response */
  setResponse: (response: A2UIResponse | null) => void;
  /** Current data model */
  data: Record<string, unknown>;
  /** Update a value in the data model */
  updateData: (path: string, value: unknown) => void;
  /** Apply an update to the response */
  applyUpdate: (update: A2UIUpdate) => void;
  /** Apply multiple updates */
  applyUpdates: (updates: A2UIUpdate[]) => void;
  /** Emit an event */
  emit: (componentId: string, event: string, payload?: Record<string, unknown>) => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Hook to manage A2UI state
 */
export function useA2UI(options: UseA2UIOptions = {}): UseA2UIResult {
  const { initialResponse = null, onEvent, onDataChange } = options;

  const [response, setResponse] = useState<A2UIResponse | null>(
    initialResponse ? cloneResponse(initialResponse) : null
  );
  const [data, setData] = useState<Record<string, unknown>>(
    initialResponse?.data || {}
  );

  // Sync data when response changes
  useEffect(() => {
    if (response?.data) {
      setData((prev) => ({ ...prev, ...response.data }));
    }
  }, [response]);

  const updateData = useCallback(
    (path: string, value: unknown) => {
      setData((prev) => {
        const newData = setBinding(prev, path, value);
        onDataChange?.(newData);
        return newData;
      });
    },
    [onDataChange]
  );

  const handleApplyUpdate = useCallback((update: A2UIUpdate) => {
    setResponse((prev) => {
      if (!prev) return prev;
      return applyUpdate(prev, update);
    });
  }, []);

  const handleApplyUpdates = useCallback((updates: A2UIUpdate[]) => {
    setResponse((prev) => {
      if (!prev) return prev;
      return updates.reduce((r, u) => applyUpdate(r, u), prev);
    });
  }, []);

  const emit = useCallback(
    (componentId: string, event: string, payload?: Record<string, unknown>) => {
      const a2uiEvent: A2UIEvent = {
        type: event,
        componentId,
        payload,
        timestamp: Date.now(),
      };
      onEvent?.(a2uiEvent);
    },
    [onEvent]
  );

  const reset = useCallback(() => {
    setResponse(initialResponse ? cloneResponse(initialResponse) : null);
    setData(initialResponse?.data || {});
  }, [initialResponse]);

  return {
    response,
    setResponse,
    data,
    updateData,
    applyUpdate: handleApplyUpdate,
    applyUpdates: handleApplyUpdates,
    emit,
    reset,
  };
}

/**
 * Hook to fetch and render A2UI from a URL
 */
export function useA2UIFetch(url: string | null): {
  response: A2UIResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [response, setResponse] = useState<A2UIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResponse = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch A2UI: ${res.statusText}`);
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchResponse();
  }, [fetchResponse]);

  return {
    response,
    loading,
    error,
    refetch: fetchResponse,
  };
}
