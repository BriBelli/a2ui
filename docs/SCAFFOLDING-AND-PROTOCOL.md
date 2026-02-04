# Scaffolding and Protocol: Who Chooses Layout and CSS?

## 1. Who Chooses What?

| Decision | Who | Where |
|----------|-----|--------|
| Tailwind vs Bootstrap vs plain CSS | **Engineering team** | In the **renderer** (e.g. `@a2ui/react` or your app) |
| Page-level structure (sidebar + main, columns) | **AI (or any JSON producer)** | In the **A2UI JSON** (protocol vocabulary only) |
| 12-column grid vs flex vs CSS Grid | **Protocol** defines abstract options; **renderer** maps to real CSS | Protocol types + renderer implementation |

So: **The AI never chooses CSS classes or framework.** It only uses the protocol’s layout vocabulary. Your team chooses the scaffolding and implements the mapping.

---

## 2. How "Agent-Driven" Layout Works

### Step 1: Protocol defines abstract layout

The **protocol** (in `@a2ui/core`) defines what layout *concepts* the JSON can express, e.g.:

- **Today:** `container` with `direction`, `gap`, `align`, `justify`, `wrap` (flex-style).
- **Optional extension:** `grid` with `columns: 12` and per-child `span: 6` (abstract “6 of 12”).

No CSS class names, no “col-md-6”, no “grid-cols-12”. Just: “a container in a row with gap” or “a 12-column grid, this child spans 6”.

### Step 2: AI (or API/DB) outputs only that vocabulary

When you ask the AI something like: *“Show a dashboard with a sidebar and main content,”* the AI returns **A2UI JSON** only, e.g.:

```json
{
  "id": "root",
  "type": "container",
  "props": { "direction": "row", "gap": "24px" },
  "children": ["sidebar", "main"]
}
```

Or with a future grid primitive:

```json
{
  "id": "root",
  "type": "grid",
  "props": { "columns": 12 },
  "children": [
    { "id": "sidebar", "span": 3 },
    { "id": "main", "span": 9 }
  ]
}
```

The AI does **not** output:

- `class="row"` or `class="col-md-6"`
- Tailwind/Bootstrap class names
- Raw CSS

So: **domain/page-level structure and column patterns are expressed in the JSON using the protocol; the AI stays inside that vocabulary.**

### Step 3: Renderer maps protocol → your scaffolding

Your **renderer** (e.g. React + Tailwind or React + Bootstrap) decides how each protocol primitive becomes real layout:

- **Tailwind:** `container` with `direction: "row"` → `className="flex flex-row gap-6"`; `grid` with `columns: 12` and `span: 6` → `className="grid grid-cols-12"` and `className="col-span-6"`.
- **Bootstrap:** same `container` → `className="d-flex flex-row gap-3"`; grid → `className="row"` and `className="col-md-6"`.
- **Plain CSS:** you map to your own classes or inline styles.

So: **the protocol gives you a stable, AI-safe way to describe layout; the engineering team’s choice of Tailwind/Bootstrap/CSS is applied only in the renderer.**

---

## 3. Complex Column Layouts and 12-Grid

Today the protocol has **flex-only** layout via `container`:

- Nested containers: outer `direction: "row"`, inner `direction: "column"` → rows and columns.
- No explicit “12-column grid” in the spec yet.

To support **12-column-style** layouts in a framework-agnostic way:

1. **Extend the protocol** (in `@a2ui/core` types), e.g.:
   - Add a `grid` component type with `columns?: number` (e.g. 12).
   - Allow children to specify `span?: number` (e.g. 6 for “half”).
2. **Keep the JSON abstract:** e.g. `"span": 6` means “take 6 of 12 columns”, not “use col-md-6”.
3. **Implement in the renderer:** map `grid` + `columns: 12` + `span: 6` to:
   - Bootstrap: `col-md-6`
   - Tailwind: `col-span-6`
   - CSS Grid: `grid-column: span 6`

So: **the AI only chooses protocol layout (e.g. grid, columns, span). The team chooses the actual CSS/scaffolding (Bootstrap 12-grid, Tailwind grid, etc.) in the renderer.**

---

## 4. Summary

- **Scaffolding (Tailwind, Bootstrap, etc.)** = chosen by the **engineering team** and implemented in the **renderer**.
- **Page-level / domain structure and column layout** = described in the **A2UI JSON** using **protocol vocabulary** (containers, grid, span, etc.).
- **“A Protocol for Agent-Driven Interfaces”** = the AI (or any producer) only outputs that protocol; it never outputs CSS classes or framework-specific scaffolding. Your renderer is what turns protocol primitives into your chosen layout system.

So: **protocol = abstract structure and layout. Implementation = your components + your scaffolding (Tailwind/Bootstrap/CSS).**
