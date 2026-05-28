# @newnpmjs/react-context-menu

![demo](https://raw.githubusercontent.com/awyb/react-context-menu/main/demo/screenshot.png)

A lightweight, zero-dependency React context menu (right-click menu) component. Comes with a global provider pattern so you can open menus from anywhere in your app.

## Installation

```bash
npm install @newnpmjs/react-context-menu
```

## Peer Dependencies

- `react >= 16.8`

No other runtime dependencies.

## Quick Start

Wrap your app with `ContextMenuProvider`, then use `useContextMenu` anywhere to open a right‑click menu.

```tsx
import { ContextMenuProvider, useContextMenu } from '@newnpmjs/react-context-menu'

function App() {
  return (
    <ContextMenuProvider>
      <MyComponent />
    </ContextMenuProvider>
  )
}

function MyComponent() {
  const { openContextMenu } = useContextMenu()

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    openContextMenu(e.clientX, e.clientY, [
      { key: 'edit', name: 'Edit', show: true, onClick: () => alert('Edit') },
      { key: 'sep1', type: 'divider' },
      {
        key: 'delete',
        name: 'Delete',
        show: true,
        disabled: true,
        onClick: () => alert('Delete'),
      },
    ])
  }

  return <div onContextMenu={handleContextMenu}>Right-click me</div>
}
```

## API

### `ContextMenuProvider`

Wrap your component tree with this provider. It manages the menu state and renders the menu overlay.

```tsx
<ContextMenuProvider>
  <App />
</ContextMenuProvider>
```

### `useContextMenu()`

Returns an object with two methods:

| Method | Signature | Description |
|--------|-----------|-------------|
| `openContextMenu` | `(x: number, y: number, menus: MenuItem[]) => void` | Opens the context menu at the given coordinates |
| `closeContextMenu` | `() => void` | Closes the menu programmatically |

## Menu Items

### Types

```ts
interface BaseMenuItem {
  key: string
  name?: string
  onClick?: () => void
  disabled?: boolean
  icon?: string | ReactNode
  keyboard?: string
  children?: MenuItem[]
}

interface MenuItemMenu extends BaseMenuItem {
  type?: 'menu'   // default
  show: boolean
}

interface MenuItemDivider
  extends Omit<BaseMenuItem, 'name' | 'onClick' | 'icon' | 'keyboard' | 'disabled'> {
  type: 'divider'
}

type MenuItem = MenuItemMenu | MenuItemDivider
```

### Fields

| Field | Type | Applies to | Description |
|-------|------|------------|-------------|
| `key` | `string` | all | Unique identifier for the menu item |
| `name` | `string` | menu | Display text |
| `show` | `boolean` | menu | Whether the item is visible. `false` hides the item entirely |
| `disabled` | `boolean` | menu | When `true`, dims the item and prevents click/submenu |
| `icon` | `string \| ReactNode` | menu | Emoji string, image URL (auto-detected), or any React element |
| `keyboard` | `string` | menu | Keyboard shortcut hint (e.g. `⌘Z`), rendered as italic text |
| `onClick` | `() => void` | menu | Callback when the item is clicked |
| `children` | `MenuItem[]` | menu | Submenu items — hover to reveal a nested menu |
| `type` | `'menu' \| 'divider'` | all | `'menu'` (default) or `'divider'` for a separator line |

### Icon usage

The `icon` field accepts three forms:

```tsx
// 1. Emoji string
{ key: 'copy', name: 'Copy', icon: '📋', show: true }

// 2. Image URL (auto-detected by http/https/data: prefix)
{ key: 'save', name: 'Save', icon: 'https://example.com/save-icon.png', show: true }

// 3. React element (component, JSX, etc.)
{ key: 'bold', name: 'Bold', icon: <BoldIcon />, show: true }
```

### Submenus

Nest menu items via `children` to create submenus:

```tsx
openContextMenu(e.clientX, e.clientY, [
  {
    key: 'text',
    name: 'Text',
    show: true,
    children: [
      { key: 'bold', name: 'Bold', show: true, onClick: () => exec('bold') },
      { key: 'italic', name: 'Italic', show: true, onClick: () => exec('italic') },
      { key: 'sep', type: 'divider' },
      { key: 'clear', name: 'Clear formatting', show: true, onClick: () => exec('clear') },
    ],
  },
  { key: 'insert', name: 'Insert image', show: true, onClick: () => insert() },
])
```

## Features

- **Zero dependencies** — only requires React
- **Submenu support** — nested menus with hover delay and position flipping
- **Overflow prevention** — menu auto-adjusts to stay within the viewport; submenus flip to the left when near the right edge
- **Auto-close** — closes on outside click, scroll, or window blur
- **Keyboard shortcut hints** — display shortcut text per item
- **Dividers** — separate item groups with `type: 'divider'`
- **Disabled state** — dimmed items with `disabled: true`
- **Self-contained styles** — CSS injected once via `useEffect`, no external stylesheet needed

## License

MIT
