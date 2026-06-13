# Tasks: design-refresh-airbnb-style

## Phase 1: CSS Tokens

- [x] 1.1 Update `src/styles/global.css` with new color tokens
  - Verde Botánico: #6d5e4d ✅
  - Ceniza: #7b8084 ✅
  - Near-black: #222222 ✅

- [x] 1.2 Add 3-layer shadow system to global.css
  - --shadow-card (3 layers) ✅
  - --shadow-hover ✅

- [x] 1.3 Add border-radius tokens
  - --radius-button: 8px ✅
  - --radius-card: 20px ✅
  - --radius-badge: 14px ✅
  - --radius-pill: 20px ✅

- [x] 1.4 Add spacing tokens (base 8px) ✅

## Phase 2: Component Updates

- [x] 2.1 Restyle ProductCard.astro
  - Apply --shadow-card ✅
  - Set border-radius: var(--radius-card) ✅
  - Add hover translateY(-4px) ✅
  - Image aspect-ratio 1/1 ✅

- [x] 2.2 Update Button.astro
  - Primary: bg var(--near-black), hover var(--verde-botanico) ✅
  - Secondary: ghost style with border ✅
  - Radius: var(--radius-button) ✅

- [ ] 2.3 Create CategoryPills.astro component
  - Horizontal scroll container
  - Pill styling with active state

- [x] 2.4 Update Navbar styling ✅
- [x] 2.5 Update Footer styling ✅

## Phase 3: Page Updates

- [x] 3.1 Update Homepage (index.astro) ✅
  - Clean white sections ✅
  - 32px+ vertical spacing ✅
  - Apply shadow-card to featured products ✅

- [ ] 3.2 Update Tienda index
  - Add CategoryPills below header
  - Update product grid (4 columns)
  - Apply shadows to product cards

- [x] 3.3 Update Product detail page ✅

## Phase 4: Polish

- [x] 4.1 Add micro-interactions ✅
  - Card hover: translateY(-4px) ✅
  - Card click: scale(0.98) ✅
  - Button hover transitions ✅

- [x] 4.2 Verify responsive behavior ✅
- [x] 4.3 Test all shadow layers ✅
- [x] 4.4 Update trust badges/icons (Lucide) ✅

---

## Completed: 15/17 tasks

### Pending:
- 2.3 CategoryPills component (horizontal scroll filters)
- 3.2 Tienda index with pills and grid updates
