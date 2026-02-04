/**
 * A2UI Schema Validation
 * 
 * Utilities for validating A2UI responses and components
 */

import type { A2UIResponse, A2UIComponent, A2UIUpdate } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

/**
 * Validates an A2UI response structure
 */
export function validateResponse(response: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!response || typeof response !== 'object') {
    errors.push({
      path: '',
      message: 'Response must be an object',
      code: 'INVALID_TYPE',
    });
    return { valid: false, errors };
  }

  const res = response as Record<string, unknown>;

  // Check required fields
  if (!res.version || typeof res.version !== 'string') {
    errors.push({
      path: 'version',
      message: 'Version is required and must be a string',
      code: 'MISSING_FIELD',
    });
  }

  if (!res.root || typeof res.root !== 'string') {
    errors.push({
      path: 'root',
      message: 'Root component ID is required and must be a string',
      code: 'MISSING_FIELD',
    });
  }

  if (!Array.isArray(res.components)) {
    errors.push({
      path: 'components',
      message: 'Components must be an array',
      code: 'INVALID_TYPE',
    });
  } else {
    // Validate each component
    const componentIds = new Set<string>();
    res.components.forEach((comp, index) => {
      const compErrors = validateComponent(comp, `components[${index}]`);
      errors.push(...compErrors);

      if (comp && typeof comp === 'object' && 'id' in comp) {
        const id = (comp as { id: string }).id;
        if (componentIds.has(id)) {
          errors.push({
            path: `components[${index}].id`,
            message: `Duplicate component ID: ${id}`,
            code: 'DUPLICATE_ID',
          });
        }
        componentIds.add(id);
      }
    });

    // Validate root exists
    if (res.root && typeof res.root === 'string' && !componentIds.has(res.root)) {
      errors.push({
        path: 'root',
        message: `Root component "${res.root}" not found in components`,
        code: 'INVALID_REFERENCE',
      });
    }

    // Validate child references
    res.components.forEach((comp, index) => {
      if (comp && typeof comp === 'object' && 'children' in comp) {
        const children = (comp as { children?: string[] }).children;
        if (Array.isArray(children)) {
          children.forEach((childId, childIndex) => {
            if (!componentIds.has(childId)) {
              errors.push({
                path: `components[${index}].children[${childIndex}]`,
                message: `Child component "${childId}" not found`,
                code: 'INVALID_REFERENCE',
              });
            }
          });
        }
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a single A2UI component
 */
export function validateComponent(component: unknown, path: string = ''): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!component || typeof component !== 'object') {
    errors.push({
      path,
      message: 'Component must be an object',
      code: 'INVALID_TYPE',
    });
    return errors;
  }

  const comp = component as Record<string, unknown>;

  if (!comp.id || typeof comp.id !== 'string') {
    errors.push({
      path: `${path}.id`,
      message: 'Component ID is required and must be a string',
      code: 'MISSING_FIELD',
    });
  }

  if (!comp.type || typeof comp.type !== 'string') {
    errors.push({
      path: `${path}.type`,
      message: 'Component type is required and must be a string',
      code: 'MISSING_FIELD',
    });
  }

  if (comp.children !== undefined && !Array.isArray(comp.children)) {
    errors.push({
      path: `${path}.children`,
      message: 'Children must be an array of strings',
      code: 'INVALID_TYPE',
    });
  }

  if (comp.props !== undefined && (typeof comp.props !== 'object' || comp.props === null)) {
    errors.push({
      path: `${path}.props`,
      message: 'Props must be an object',
      code: 'INVALID_TYPE',
    });
  }

  return errors;
}

/**
 * Validates an A2UI update payload
 */
export function validateUpdate(update: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!update || typeof update !== 'object') {
    errors.push({
      path: '',
      message: 'Update must be an object',
      code: 'INVALID_TYPE',
    });
    return { valid: false, errors };
  }

  const upd = update as Record<string, unknown>;

  const validOperations = ['add', 'remove', 'update', 'replace'];
  if (!upd.operation || !validOperations.includes(upd.operation as string)) {
    errors.push({
      path: 'operation',
      message: `Operation must be one of: ${validOperations.join(', ')}`,
      code: 'INVALID_VALUE',
    });
  }

  if (!upd.targetId || typeof upd.targetId !== 'string') {
    errors.push({
      path: 'targetId',
      message: 'Target ID is required and must be a string',
      code: 'MISSING_FIELD',
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Type guard to check if a value is a valid A2UI response
 */
export function isA2UIResponse(value: unknown): value is A2UIResponse {
  return validateResponse(value).valid;
}

/**
 * Type guard to check if a value is a valid A2UI component
 */
export function isA2UIComponent(value: unknown): value is A2UIComponent {
  return validateComponent(value).length === 0;
}

/**
 * Type guard to check if a value is a valid A2UI update
 */
export function isA2UIUpdate(value: unknown): value is A2UIUpdate {
  return validateUpdate(value).valid;
}
