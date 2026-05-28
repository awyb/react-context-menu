import { useState } from "react";
import { ContextMenuProvider, useContextMenu } from "../src/index";
import type { MenuItem } from "../src/types";

/* -------- demo global styles -------- */
const styles = {
  page: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: 40,
    maxWidth: 800,
    margin: "0 auto",
    color: "#333",
  },
  header: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  sub: { color: "#666", marginBottom: 32, lineHeight: 1.6 },
  section: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  sectionHeader: {
    padding: "10px 16px",
    background: "#f9fafb",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#555",
  },
  area: (bg: string) =>
    ({
      flex: 1,
      background: bg,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 180,
      cursor: "context-menu",
      userSelect: "none",
      color: "#555",
      fontSize: 15,
      fontWeight: 500,
      border: "2px dashed #d1d5db",
    }) as React.CSSProperties,
  listItem: {
    padding: "10px 16px",
    borderBottom: "1px solid #eee",
    cursor: "context-menu",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  },
  lastItem: { borderBottom: "none" },
  hint: { color: "#999", fontSize: 12 },
  customArea: {
    padding: 32,
    background: "#fef3c7",
    borderRadius: 8,
    textAlign: "center" as const,
    cursor: "context-menu",
    border: "2px dashed #f59e0b",
    marginBottom: 24,
  },
  log: {
    background: "#1e293b",
    color: "#e2e8f0",
    borderRadius: 8,
    padding: "12px 16px",
    fontFamily: "ui-monospace, monospace",
    fontSize: 13,
    minHeight: 40,
  },
  logEmpty: { color: "#64748b" },
  actions: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap" as const,
  },
  btn: {
    padding: "8px 20px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    color: "#333",
  },
};

/* -------- demo components -------- */

function ContentArea({ title, color }: { title: string; color: string }) {
  const { openContextMenu } = useContextMenu();

  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      {
        key: "new",
        name: "New",
        icon: "",
        show: true,
        children: [
          {
            key: "file",
            name: "File",
            icon: "📝",
            show: true,
            onClick: () => alert(`New File in ${title}`),
          },
          {
            key: "folder",
            name: "Folder",
            icon: "📁",
            show: true,
            onClick: () => alert(`New Folder in ${title}`),
          },
          { key: "sep-child", type: "divider" },
          {
            key: "image",
            name: "Image",
            icon: "🖼️",
            show: true,
            onClick: () => alert(`New Image in ${title}`),
          },
        ],
      },
      { key: "sep1", type: "divider" },
      {
        key: "rename",
        name: "Rename",
        icon: "✏️",
        show: true,
        onClick: () => alert(`Rename ${title}`),
      },
      {
        key: "dup",
        name: "Duplicate",
        icon: "📋",
        show: true,
        onClick: () => alert(`Duplicate ${title}`),
      },
      { key: "sep2", type: "divider" },
      {
        key: "copy",
        name: "Copy",
        icon: "📄",
        keyboard: "Ctrl+C",
        show: true,
        onClick: () => alert(`Copy ${title}`),
      },
      {
        key: "paste",
        name: "Paste",
        icon: "📌",
        keyboard: "Ctrl+V",
        show: true,
        disabled: true,
      },
      { key: "sep3", type: "divider" },
      {
        key: "delete",
        name: "Delete",
        icon: "🗑️",
        keyboard: "Del",
        show: true,
        onClick: () => alert(`Delete ${title}`),
      },
    ]);
  };

  return (
    <div onContextMenu={onContext} style={styles.area(color)}>
      Right-click in the <strong style={{ margin: "0 4px" }}>{title}</strong>{" "}
      area
    </div>
  );
}

function ListItem({ label, index: idx }: { label: string; index: number }) {
  const { openContextMenu } = useContextMenu();

  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      {
        key: "edit",
        name: "Edit",
        icon: "✏️",
        show: true,
        onClick: () => alert(`Edit ${label}`),
      },
      {
        key: "open",
        name: "Open",
        icon: "📂",
        show: true,
        onClick: () => alert(`Open ${label}`),
      },
      { key: "sep", type: "divider" },
      {
        key: "organize",
        name: "Organize",
        icon: "📦",
        show: true,
        children: [
          {
            key: "sort",
            name: "Sort by",
            icon: "🔤",
            show: true,
            children: [
              {
                key: "name",
                name: "Name",
                show: true,
                onClick: () => alert(`Sort by Name`),
              },
              {
                key: "date",
                name: "Date",
                show: true,
                onClick: () => alert(`Sort by Date`),
              },
              {
                key: "size",
                name: "Size",
                show: true,
                onClick: () => alert(`Sort by Size`),
              },
            ],
          },
          {
            key: "group",
            name: "Group",
            show: true,
            onClick: () => alert(`Group items`),
          },
        ],
      },
      { key: "sep2", type: "divider" },
      {
        key: "delete",
        name: "Delete",
        icon: "🗑️",
        show: true,
        disabled: idx === 0,
        onClick: () => alert(`Delete ${label}`),
      },
    ]);
  };

  return (
    <div
      onContextMenu={onContext}
      style={{ ...styles.listItem, ...(idx === 2 ? styles.lastItem : {}) }}
    >
      <span>{label}</span>
      <span style={styles.hint}>{idx === 0 ? "disabled" : "right-click"}</span>
    </div>
  );
}

function LogArea({ logs }: { logs: string[] }) {
  const { openContextMenu } = useContextMenu();

  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      {
        key: "clear",
        name: "Clear Log",
        icon: "🧹",
        show: true,
        onClick: () => alert("Cleared!"),
      },
      {
        key: "copy-all",
        name: "Copy All",
        icon: "📋",
        show: true,
        keyboard: "Ctrl+A",
        onClick: () => alert("Copied!"),
      },
      { key: "sep", type: "divider" },
      {
        key: "export",
        name: "Export",
        icon: "📤",
        show: true,
        onClick: () => alert("Exported!"),
      },
    ]);
  };

  return (
    <div onContextMenu={onContext} style={styles.log}>
      {logs.length === 0 ? (
        <span style={styles.logEmpty}>Right-click here for log actions</span>
      ) : (
        logs.map((l, i) => <div key={i}>{l}</div>)
      )}
    </div>
  );
}

/* -------- app -------- */

function AppContent() {
  const { openContextMenu } = useContextMenu();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleMenu: MenuItem[] = [
    {
      key: "light",
      name: "Light Mode",
      icon: "☀️",
      show: true,
      onClick: () => setTheme("light"),
    },
    {
      key: "dark",
      name: "Dark Mode",
      icon: "🌙",
      show: true,
      onClick: () => setTheme("dark"),
    },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>react-context-menu-popup</h1>
      <p style={styles.sub}>
        A lightweight, zero-dependency React context menu.{" "}
        <strong>Right-click</strong> anywhere to open a menu.
      </p>

      {/* action buttons */}
      <div style={styles.actions}>
        <button
          style={styles.btn}
          onClick={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            openContextMenu(rect.left, rect.bottom + 4, toggleMenu);
          }}
        >
          Click to open menu (not right-click)
        </button>
        <button
          style={styles.btn}
          onClick={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            openContextMenu(rect.left, rect.bottom + 4, [
              { key: "hello", name: `Theme: ${theme}`, icon: "ℹ️", show: true },
              {
                key: "a",
                name: "Item A",
                icon: "🔤",
                show: true,
                disabled: theme === "dark",
              },
              {
                key: "b",
                name: "Item B",
                icon: "🔡",
                show: true,
                disabled: theme === "light",
              },
            ]);
          }}
        >
          Open another menu
        </button>
      </div>

      {/* content areas */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <ContentArea title="Blue" color="#dbeafe" />
        <ContentArea title="Green" color="#d1fae5" />
      </div>

      {/* list */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>File List</div>
        <ListItem label="Item 1 (delete disabled)" index={0} />
        <ListItem label="Item 2" index={1} />
        <ListItem label="Item 3" index={2} />
      </div>

      {/* custom area */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          openContextMenu(e.clientX, e.clientY, [
            {
              key: "custom1",
              name: "Custom Action 1",
              icon: "⭐",
              show: true,
              onClick: () => alert("Custom 1"),
            },
            {
              key: "custom2",
              name: "Custom Action 2",
              icon: "🌟",
              show: true,
              onClick: () => alert("Custom 2"),
            },
            {
              key: "custom3",
              name: "Custom Action 3",
              icon: "✨",
              show: true,
              disabled: true,
            },
          ]);
        }}
        style={styles.customArea}
      >
        <strong>Custom Area</strong>
        <p style={{ margin: "8px 0 0", color: "#92400e", fontSize: 14 }}>
          This area has its own set of context menu actions
        </p>
      </div>

      {/* log area */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>Log Console</div>
        <LogArea logs={[]} />
      </div>

      {/* footer */}
      <p
        style={{
          textAlign: "center",
          color: "#999",
          fontSize: 13,
          marginTop: 40,
        }}
      >
        react-context-menu-popup v0.1.0 &mdash; Right-click anywhere above
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ContextMenuProvider>
      <AppContent />
    </ContextMenuProvider>
  );
}
