import {
  createContext,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  type ReactNode,
} from "react";
import type { MenuItem } from "./types";

/* ---------- CSS injection (self-contained, no external stylesheet needed) ---------- */
const STYLE_ID = "rcm-styles";

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.rcm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
}
.rcm-menu {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 4px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  max-width: 200px;
  max-height: calc(100vh - 10px);
  animation: rcm-fade-in 0.12s ease-out forwards;
}
@keyframes rcm-fade-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
.rcm-item {
  all: unset;
  display: flex;
  height: 36px;
  width: 160px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 4px;
  padding: 4px 16px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  font-family: inherit;
  box-sizing: border-box;
}
.rcm-item:hover { background: #e0f2fe; }
.rcm-item:active { background: #bae6fd; }
.rcm-item.rcm-disabled {
  cursor: not-allowed;
  color: #9ca3af;
}
.rcm-item.rcm-disabled:hover { background: transparent; }
.rcm-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.rcm-item-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
}
.rcm-item-icon img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: block;
}
.rcm-item-keyboard {
  flex-shrink: 0;
  font-style: italic;
  color: #94a3b8;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  margin-left: 8px;
}
.rcm-item-arrow {
  flex-shrink: 0;
  font-size: 10px;
  color: #94a3b8;
  margin-left: 4px;
}
.rcm-item-active,
.rcm-item-active:hover {
  background: #bae6fd;
}
.rcm-submenu {
  position: absolute;
  top: 0;
  left: 100%;
  min-width: 160px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 4px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  animation: rcm-fade-in 0.12s ease-out forwards;
}
.rcm-separator {
  height: 1px;
  background: #d1d5db;
  margin: 4px 0;
}
`;
  document.head.appendChild(style);
}

/* ---------- Components ---------- */

function MenuItemIcon({ icon }: { icon: string | ReactNode }) {
  if (typeof icon === "string") {
    const isImage =
      icon.startsWith("http://") ||
      icon.startsWith("https://") ||
      icon.startsWith("data:");
    if (isImage) {
      return (
        <span className="rcm-item-icon">
          <img src={icon} alt="" />
        </span>
      );
    }
    return <span className="rcm-item-icon">{icon}</span>;
  }
  return <span className="rcm-item-icon">{icon}</span>;
}

function SubmenuPositioner({ children, onEnter, onLeave }: {
  children: ReactNode;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    if (rect.right > innerWidth) {
      el.style.left = "auto";
      el.style.right = "100%";
    }
    if (rect.bottom > innerHeight) {
      el.style.top = `${-(rect.bottom - innerHeight)}px`;
    }
  }, []);

  return (
    <div
      ref={ref}
      className="rcm-submenu"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

function MenuList({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const openSubmenu = (key: string) => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setActiveSubmenu(key), 150);
  };

  const closeSubmenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveSubmenu(null), 200);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      {items.map((item) => {
        if (item.type === "divider") return <div key={item.key} className="rcm-separator" />;
        if (!item.show) return null;

        const hasSubmenu = !item.disabled && Array.isArray(item.children) && item.children.length > 0;

        return (
          <div
            key={item.key}
            className={`rcm-item${item.disabled ? " rcm-disabled" : ""}${activeSubmenu === item.key ? " rcm-item-active" : ""}`}
            style={{
              display: "flex",
              position: hasSubmenu ? "relative" as const : undefined,
            }}
            onClick={() => {
              if (!item.disabled) {
                if (item.onClick) item.onClick();
                if (!hasSubmenu || item.onClick) onClose();
              }
            }}
            onMouseEnter={() => {
              if (hasSubmenu) {
                cancelClose();
                openSubmenu(item.key);
              }
            }}
            onMouseLeave={() => {
              if (hasSubmenu) closeSubmenu();
            }}
          >
            <MenuItemIcon icon={item.icon} />
            <span className="rcm-item-name">{item.name ?? ""}</span>
            {item.keyboard && <span className="rcm-item-keyboard">{item.keyboard}</span>}
            {hasSubmenu && <span className="rcm-item-arrow">▶</span>}
            {hasSubmenu && activeSubmenu === item.key && (
              <SubmenuPositioner onEnter={cancelClose} onLeave={closeSubmenu}>
                <MenuList items={item.children!} onClose={onClose} />
              </SubmenuPositioner>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ---------- Context ---------- */
interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  menus: MenuItem[];
}

interface ContextMenuCtx {
  openContextMenu: (x: number, y: number, menus: MenuItem[]) => void;
  closeContextMenu: () => void;
}

const Ctx = createContext<ContextMenuCtx | null>(null);

/* ---------- Provider ---------- */
export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    menus: [],
  });

  const menuRef = useRef<HTMLDivElement>(null);

  const openContextMenu = (x: number, y: number, menus: MenuItem[]) => {
    setState({ visible: true, x, y, menus });
  };

  const closeContextMenu = () => {
    setState((prev) => ({ ...prev, visible: false }));
  };

  /* Inject CSS once */
  useEffect(() => {
    injectStyles();
  }, []);

  /* Prevent overflow */
  useLayoutEffect(() => {
    if (!state.visible || !menuRef.current) return;

    const { innerWidth, innerHeight } = window;
    const rect = menuRef.current.getBoundingClientRect();

    let newX = state.x;
    let newY = state.y;

    if (state.x + rect.width > innerWidth) {
      newX = innerWidth - rect.width - 4;
    }
    if (state.y + rect.height > innerHeight) {
      newY = innerHeight - rect.height - 4;
    }

    if (newX !== state.x || newY !== state.y) {
      setState((prev) => ({ ...prev, x: newX, y: newY }));
    }
  }, [state.visible, state.x, state.y]);

  /* Auto-close on scroll, blur */
  useEffect(() => {
    if (!state.visible) return;

    const close = () => closeContextMenu();

    window.addEventListener("scroll", close, true);
    window.addEventListener("blur", close);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("blur", close);
    };
  }, [state.visible]);

  return (
    <Ctx.Provider value={{ openContextMenu, closeContextMenu }}>
      {children}
      {state.visible && (
        <>
          <div
            className="rcm-overlay"
            onClick={closeContextMenu}
            onContextMenu={(e) => {
              e.preventDefault();
              // Hide overlay temporarily so elementFromPoint sees through it
              const overlay = e.currentTarget as HTMLElement;
              overlay.style.pointerEvents = "none";

              const target = document.elementFromPoint(
                e.clientX,
                e.clientY,
              );

              closeContextMenu();

              if (target) {
                const ev = new MouseEvent("contextmenu", {
                  bubbles: true,
                  cancelable: true,
                  clientX: e.clientX,
                  clientY: e.clientY,
                });
                target.dispatchEvent(ev);
              }
            }}
          />
          <div
            ref={menuRef}
            className="rcm-menu"
            onClick={(e) => e.stopPropagation()}
            style={{ top: state.y, left: state.x }}
          >
            <MenuList items={state.menus} onClose={closeContextMenu} />
          </div>
        </>
      )}
    </Ctx.Provider>
  );
}

/* ---------- Hook ---------- */
export function useContextMenu(): ContextMenuCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useContextMenu must be used within <ContextMenuProvider>");
  }
  return ctx;
}
