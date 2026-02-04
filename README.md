# A2UI - Agent-to-User Interface

An Nx monorepo implementing [Google's A2UI specification](https://github.com/google/A2UI) - an open standard that allows AI agents to generate rich, interactive user interfaces.

## Overview

A2UI enables agents to "speak UI" by sending declarative JSON describing the intent of the UI. The client application renders this using native component libraries, ensuring that agent-generated UIs are **safe like data, but expressive like code**.

## Project Structure

```
a2ui/
├── apps/
│   ├── frontend/          # Original React app (OpenAI integration)
│   └── a2ui-demo/         # A2UI component demo application
├── libs/
│   ├── a2ui-core/         # Core types, validation, and utilities
│   └── a2ui-react/        # React renderer implementation
├── backend/               # Python FastAPI backend (outside Nx)
└── nx.json               # Nx workspace configuration
```

## A2UI Libraries

### @a2ui/core

Core library containing:
- **Types**: A2UIResponse, A2UIComponent, actions, events
- **Schema validation**: Validate A2UI responses
- **Registry**: Framework-agnostic component registry
- **Utilities**: Tree building, data binding, conditional evaluation

### @a2ui/react

React implementation featuring:
- **A2UIRenderer**: Main component for rendering A2UI responses
- **Built-in components**: Card, Button, TextField, Select, Checkbox, etc.
- **Hooks**: useA2UI, useA2UIFetch for state management
- **Context**: Shared state across component tree

## Getting Started

### Installation

```bash
npm install
```

### Running the A2UI Demo

```bash
npm run a2ui:demo
# or
nx dev a2ui-demo
```

This starts a demo application showcasing:
- Restaurant finder UI
- Flight booking form
- Settings panel
- Loading states

### Running the Original Frontend

```bash
npm run frontend:start
```

### Running the Backend

```bash
npm run backend:start
# or
cd backend && python3 app.py
```

## Building

```bash
# Build all projects
npm run build:all

# Build specific libraries
npm run a2ui:core:build
npm run a2ui:react:build
```

## A2UI Response Format

```json
{
  "version": "0.8",
  "root": "root-id",
  "components": [
    {
      "id": "root-id",
      "type": "container",
      "props": { "direction": "column" },
      "children": ["child-1", "child-2"]
    },
    {
      "id": "child-1",
      "type": "text",
      "props": { "content": "Hello A2UI!", "variant": "heading" }
    },
    {
      "id": "child-2",
      "type": "button",
      "props": { "label": "Click Me", "variant": "filled" }
    }
  ],
  "data": {}
}
```

## Built-in Component Types

| Type | Description |
|------|-------------|
| `card` | Container with title, subtitle, elevation |
| `button` | Interactive button with variants |
| `text-field` | Text input with validation |
| `text` | Typography component |
| `container` | Flex layout container |
| `image` | Image display |
| `select` | Dropdown selection |
| `checkbox` | Boolean toggle |
| `chip` | Tag/chip component |
| `progress` | Linear/circular progress |
| `divider` | Visual separator |

## Creating Custom Components

Register custom components with the renderer:

```tsx
import { createReactRegistry, A2UIRenderer } from '@a2ui/react';

const customRegistry = createReactRegistry();

customRegistry.register({
  type: 'my-custom-component',
  render: (component, context) => (
    <div>Custom: {component.props?.label}</div>
  ),
});

<A2UIRenderer 
  response={response}
  registry={customRegistry}
/>
```

## Roadmap to Nx Plugin

This project is structured to eventually become an Nx plugin:

1. **Generator**: Create new A2UI renderers (React, Vue, Angular)
2. **Executor**: Build and validate A2UI libraries
3. **Schematic**: Add A2UI support to existing projects

## Backend (Python FastAPI)

The backend is a separate Python application not managed by Nx:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### API Endpoints
- `GET /api` - Welcome message
- `POST /api/openai` - OpenAI completion endpoint

## License

Apache-2.0 (following Google's A2UI specification)

## References

- [A2UI Specification](https://github.com/google/A2UI)
- [A2UI Documentation](https://a2ui.org)
- [Nx Documentation](https://nx.dev)
