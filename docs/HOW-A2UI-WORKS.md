# How A2UI Really Works

## 1. Those Imports Are Local Path Aliases

When you see:

```ts
import type { A2UIResponse, A2UIComponent } from '@a2ui/core';
import { findComponent } from '@a2ui/core';
```

**`@a2ui/core` is not an npm package.** It's a **path alias** that points to local files:

| You write        | Resolves to (in this repo)           |
|------------------|--------------------------------------|
| `@a2ui/core`     | `libs/a2ui-core/src/index.ts`        |
| `@a2ui/react`    | `libs/a2ui-react/src/index.ts`       |

Defined in:

- **TypeScript:** `tsconfig.base.json` → `"paths": { "@a2ui/core": ["libs/a2ui-core/src/index.ts"], ... }`
- **Vite (demo app):** `apps/a2ui-demo/vite.config.ts` → `resolve.alias`

So yes: **everything is referencing local files** in this monorepo. No external A2UI package is being pulled from npm (unless you publish `@a2ui/core` / `@a2ui/react` yourself).

---

## 2. The Two Layers: Protocol vs Renderer

A2UI in this repo is split into two layers.

### Layer 1: `@a2ui/core` — The Protocol (No UI)

**Location:** `libs/a2ui-core/`

**Contains:**

- **Types (contract for the JSON):**
  - `A2UIResponse` — `{ version, root, components[], data?, meta? }`
  - `A2UIComponent` — `{ id, type, props?, children?, events?, bindings?, when?, a11y? }`
  - Plus action, accessibility, metadata, etc.
- **Schema/validation** — e.g. `validateResponse()`, `validateComponent()`
- **Utils** — `findComponent()`, `applyUpdate()`, `buildComponentTree()`, `resolveBinding()`, etc.
- **Registry (abstract)** — in core it’s a generic “map type string → something”; no React.

**No React, no DOM, no buttons or cards.**  
Core only defines: “What does a valid A2UI JSON look like?” and “How do I walk/update that structure?”

So: **if you remove all “user” components (all React components), core still exists and still defines the protocol.**

---

### Layer 2: `@a2ui/react` — One Implementation of That Protocol

**Location:** `libs/a2ui-react/`

**Contains:**

- **Imports from core:** types and utils (e.g. `A2UIResponse`, `findComponent`, `evaluateCondition`, `setBinding`).
- **React-specific registry:** maps **type string** → **React component** (e.g. `"button"` → `<Button />`).
- **Concrete components:** Button, Card, TextField, Container, etc. — the actual UI.
- **A2UIRenderer:** takes an `A2UIResponse`, walks the tree, and for each node looks up `type` in the registry and renders the corresponding React component.

So:

- **Core** = “Here’s the A2UI data shape and helpers.”
- **React lib** = “Here’s how to turn that data into React components.”

---

## 3. Data Flow (No “user components” in the sense of app-specific UI)

High level:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  A2UI JSON (from API, static file, AI, DB, etc.)                        │
│  { "version": "0.8", "root": "root", "components": [...], "data": {} }   │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  @a2ui/core                                                             │
│  • Types: A2UIResponse, A2UIComponent (describe that JSON)              │
│  • validateResponse(json) → ok or errors                                │
│  • findComponent(response, id), applyUpdate(response, update), etc.      │
│  → No UI, no React, no DOM. Pure protocol + helpers.                    │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  @a2ui/react                                                            │
│  • Imports A2UIResponse, findComponent, … from @a2ui/core               │
│  • Registry: "card" → Card, "button" → Button, "text" → Text, …          │
│  • A2UIRenderer(response) → for each node, registry.get(type) → <Comp />│
│  → Renders the JSON as real UI using those components.                  │
└─────────────────────────────────────────────────────────────────────────┘
```

So:

- **Protocol** = core (types + validation + utils). **If you remove the React components**, you still have the protocol; you just don’t have a React renderer for it.
- **“User components”** in the sense of “the actual buttons/cards” live in **@a2ui/react**. They are the implementation of the protocol for React. The “user” of the protocol is the React renderer, not a separate app-level component library (unless you add one).

---

## 4. If You “Remove the User’s Components”

Interpretation 1: **Remove the React component implementations (Button, Card, etc.).**

- **@a2ui/core** is unchanged: types, schema, utils still define and work on A2UI JSON.
- **@a2ui/react** would have nothing (or fewer entries) in the registry, so many `type` values would have no component to render. The **protocol** (core) would still be valid; the **renderer** would just be incomplete.

Interpretation 2: **Remove the demo app (a2ui-demo) and the “frontend” app.**

- Again, **@a2ui/core** is unchanged.
- **@a2ui/react** is still a valid renderer: it still imports from core and maps A2UI JSON to React. You just wouldn’t have an app that uses it.

So in both cases: **the “how A2UI really works” at the protocol level is entirely in @a2ui/core (local files under `libs/a2ui-core/`). The rest is “who consumes that protocol” (e.g. @a2ui/react) and “who supplies the JSON” (e.g. demo app, API, AI).**

---

## 5. Summary

| Question | Answer |
|----------|--------|
| Where do `A2UIResponse` / `A2UIComponent` come from? | Local: `libs/a2ui-core/src/types.ts` (via alias `@a2ui/core`). |
| Is `@a2ui/core` a published package? | In this repo, no. It’s a path alias to local `libs/a2ui-core`. |
| What is “A2UI” without any UI? | **@a2ui/core**: types + validation + utils for the JSON protocol. |
| What turns that JSON into UI? | **@a2ui/react**: registry + React components + `A2UIRenderer` (all using core types and helpers). |
| If we remove the user’s components? | Protocol (core) still works. Renderer (react) would have fewer or no components; you’d need another renderer or new components to show UI. |

So: **A2UI “really works” as a data protocol in core; the React lib is one way to render that protocol, and it does so by referencing those local core types and utilities.**
