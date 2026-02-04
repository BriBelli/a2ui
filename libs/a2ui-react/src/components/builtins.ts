import type { ReactRegistryEntry } from '../registry';
import { Card } from './Card';
import { Button } from './Button';
import { TextField } from './TextField';
import { Text } from './Text';
import { Container } from './Container';
import { Image } from './Image';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Progress } from './Progress';
import { Divider } from './Divider';
import { Chip } from './Chip';

/**
 * Create all built-in A2UI components for React
 */
export function createBuiltinComponents(): ReactRegistryEntry[] {
  return [
    {
      type: 'card',
      Component: Card,
      builtin: true,
      meta: { displayName: 'Card', category: 'layout' },
    },
    {
      type: 'button',
      Component: Button,
      builtin: true,
      meta: { displayName: 'Button', category: 'input' },
    },
    {
      type: 'text-field',
      Component: TextField,
      builtin: true,
      meta: { displayName: 'Text Field', category: 'input' },
    },
    {
      type: 'text',
      Component: Text,
      builtin: true,
      meta: { displayName: 'Text', category: 'display' },
    },
    {
      type: 'container',
      Component: Container,
      builtin: true,
      meta: { displayName: 'Container', category: 'layout' },
    },
    {
      type: 'image',
      Component: Image,
      builtin: true,
      meta: { displayName: 'Image', category: 'display' },
    },
    {
      type: 'select',
      Component: Select,
      builtin: true,
      meta: { displayName: 'Select', category: 'input' },
    },
    {
      type: 'checkbox',
      Component: Checkbox,
      builtin: true,
      meta: { displayName: 'Checkbox', category: 'input' },
    },
    {
      type: 'progress',
      Component: Progress,
      builtin: true,
      meta: { displayName: 'Progress', category: 'display' },
    },
    {
      type: 'divider',
      Component: Divider,
      builtin: true,
      meta: { displayName: 'Divider', category: 'layout' },
    },
    {
      type: 'chip',
      Component: Chip,
      builtin: true,
      meta: { displayName: 'Chip', category: 'display' },
    },
  ];
}
