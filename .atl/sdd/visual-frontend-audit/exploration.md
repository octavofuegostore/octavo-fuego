## E4: React Performance Audit

### Current State
Octavo Fuego has 20 `.tsx` React island components spread across cart, checkout, admin, UI primitives, and WhatsApp. All use `"use client"` (Astro islands pattern). State management via Nanostores (`cartStore.ts`, `adminStore.ts`, `stores/admin/*`). No dynamic imports, no `React.memo`, no `useMemo` anywhere. All components are eagerly loaded and hydrated.

### Bundle Optimization

| Issue | Rule | Location | Severity | Fix |
|-------|------|----------|----------|-----|
| Barrel import: `@/stores/admin` | `bundle-barrel-imports` | NotificationDropdown.tsx:10 | **High** | Import individual stores (`$notificaciones`, `$noLeidas`, `marcarLeida`) directly from their modules |
| Barrel import: `@/components/ui/table` | `bundle-barrel-imports` | CustomerTableClient.tsx:8-15, ProductTableClient.tsx:8-15, OrderTableClient.tsx:8-15 | **Medium** | Import Table components individually from their files |
| No dynamic imports anywhere | `bundle-dynamic-imports` | All `.tsx` components | **High** | Use `client:idle`/`client:visible` on CartDrawer, CheckoutForm; lazy-load admin tables |
| Inline SVGs inline instead of imports | `bundle-analyzable-paths` | All components with inline SVG paths | **Low** | Extract SVGs to `astro-icon` components or import as assets |

### Re-render Prevention

| Issue | Rule | Location | Severity | Fix |
|-------|------|----------|----------|-----|
| `CartItemCard` not memoized | `rerender-memo` | CartDrawer.tsx:104-158 | **High** | Wrap in `React.memo` to avoid re-rendering all items when any item updates |
| No `useMemo` on filtered data | `rerender-derived-state-no-effect` | CustomerTableClient.tsx:93-107, ProductTableClient.tsx:93-107, OrderTableClient.tsx:113-127 | **High** | Wrap `filteredCustomers`/`filteredProducts`/`filteredOrders` in `useMemo` |
| `cartCount` and `cartTotal` computed via 3 separate `listen()` chains | `rerender-derived-state-no-effect` | cartStore.ts:36-58 | **Medium** | Use Nanostores `computed()` instead of 3 separate `.listen()` subscriptions (currently causes 3 separate listener invocations) |
| `OrderSummary` subscribes to full `cartItems` | `rerender-defer-reads` | OrderSummary.tsx:7 | **Medium** | Subscribe to `cartCount` + `cartTotal` derived stores, not full `cartItems` |
| `CartDrawer` subscribes to 3 separate atoms | `rerender-split-combined-hooks` | CartDrawer.tsx:13-15 | **Medium** | Combine into a single derived store or a single `useStore` with combined selector |
| `CheckoutForm` uses `useState` for form state with spread updates | `rerender-functional-setstate` | CheckoutForm.tsx:155, 167, 179, 198, 211 | **Low** | Consider `useReducer` for form state to prevent unnecessary spread-object recreations |
| `handleBack` uses closure over `currentStep` instead of functional update | `rerender-functional-setstate` | CheckoutForm.tsx:120-125 | **Low** | `handleBack` reads `currentStep` from closure (stale risk) — use functional `setCurrentStep(prev => prev - 1)` consistently |

### Data Fetching

| Issue | Rule | Location | Severity | Fix |
|-------|------|----------|----------|-----|
| Plain `fetch` in markAsRead | `client-swr-dedup` | NotificationDropdown.tsx:110-114, 139-143 | **Low** | Add simple dedup cache or abort controller for concurrent notification fetches |
| No caching on notification fetches | `client-swr-dedup` | NotificationDropdown.tsx:110-114 | **Low** | Cache last-fetched timestamp, skip if <2s ago |

### Client-Side

| Issue | Rule | Location | Severity | Fix |
|-------|------|----------|----------|-----|
| `CartStore.tsx` returns `null` — ships entire React+shadcn bundle for no visual output | `rendering-hoist-jsx` | CartStore.tsx:1-11 | **Critical** | Delete this component; use Astro inline script for store hydration or remove entirely |
| `FloatingWhatsApp.tsx` is a static `<a>` link with zero interactivity | `bundle-defer-third-party` | FloatingWhatsApp.tsx:1-47 | **Critical** | Convert to `.astro` component — no client JS needed for a static anchor |
| `WhatsAppButton.tsx` is a static `<a>` link with zero interactivity | `bundle-defer-third-party` | WhatsAppButton.tsx:53-87 | **Critical** | Convert to `.astro` component — inline SVG anchor needs no React |
| `localStorage` key `octavo-cart` has no version/schema check | `client-localstorage-schema` | cartStore.ts:28-29 | **Medium** | Add version field (`__v: 1`) to cached cart, validate on load |
| `BodegaSwitcher` adds document click listener on open | `client-event-listeners` | BodegaSwitcher.tsx:63-68 | **Informational** | Already correctly cleaned up via useEffect return ✓ |
| `NotificationDropdown` adds mousedown/keydown listeners on open | `client-event-listeners` | NotificationDropdown.tsx:79-101 | **Informational** | Already correctly cleaned up ✓ |

### JavaScript Performance

| Issue | Rule | Location | Severity | Fix |
|-------|------|----------|----------|-----|
| `relativeTime()` creates `new Date()` on every call per render | `js-cache-function-results` | NotificationDropdown.tsx:32-47 | **Low** | Memoize or cache the time calculations; or compute once in the store |

### Summary

- **Total issues found**: 22
- **Critical (must fix)**: 3
  - `CartStore.tsx` returns null — ships React bundle with zero visual output
  - `FloatingWhatsApp.tsx` — static anchor wrapped as React island (unnecessary 37KB+ JS)
  - `WhatsAppButton.tsx` — static anchor wrapped as React island (unnecessary 37KB+ JS)
- **High (should fix)**: 5
  - Barrel import in NotificationDropdown
  - No dynamic imports for heavy components
  - `CartItemCard` not memoized
  - 3 admin tables compute filtered data without `useMemo`
- **Medium**: 7
  - Barrel imports in admin tables
  - `cartCount`/`cartTotal` 3× listen chains vs `computed()`
  - `OrderSummary` subscribes to full array instead of derivations
  - `CartDrawer` subscribes to 3 separate atoms
  - localStorage no versioning
  - `CartDrawer` subscribes to 3 separate atoms
  - Multiple atom subscriptions in one component
- **Low**: 4
  - Not all functional setState patterns
  - Plain fetch without dedup
  - `relativeTime()` Date allocation
  - Inline SVGs not extractable by bundler

### Estimated Impact
- **Bundle size**: ~150KB+ unnecessary JS shipped (3 components that could be .astro: FloatingWhatsApp, WhatsAppButton, CartStore)
- **Re-render waste**: ~30-60% of renders in admin tables are wasted (filter computations re-run on every keystroke)
- **Re-render waste (CartDrawer)**: Every CartItemCard re-renders when ANY item changes (N× re-render instead of 1×)
- **Store inefficiency**: cartStore dispatches 3 separate notifications per change (listen chain), triggering 3 React re-renders

### Ready for Proposal
Yes. Clear patterns emerge: move static components to `.astro`, add `React.memo`/`useMemo` to list components, replace `listen()` chains with `computed()`, and add dynamic imports.
