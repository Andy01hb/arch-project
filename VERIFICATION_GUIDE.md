# 🧪 Visual Verification Guide

Follow these steps to verify the visual overhaul.

## 1. Local Development
Run the development server to see changes instantly:

```bash
cd store
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 2. Page-by-Page Checklist

### 🏠 Home Page
- [ ] **Hero Animation**: Confirm text fades up and background mesh spins slowly.
- [ ] **Interactive Buttons**: Hover over "Explore Catalog" to see arrow movement.
- [ ] **Trusted By**: Verify icons (AutoCAD, Revit) display correctly in a row.

### 🛍️ Catalog (`/catalogo`)
- [ ] **Sidebar**: Check sticky positioning on desktop (if content is long enough).
- [ ] **Grid**: Resize window to see 1 -> 2 -> 3 column responsiveness.
- [ ] **Filters**: Click a category (e.g., "All") to see the blue indicator.

### 📄 Product Details (`/products/1`)
- [ ] **Blueprint Fallback**: If image fails, verify the blue grid pattern appears.
- [ ] **Typography**: Check "Inter" font rendering (clean, modern).
- [ ] **Add to Cart**: Click button, verify it turns green with "Added!" text.

### ℹ️ About (`/about`)
- [ ] **Storytelling**: Scroll down to see the "Code/Blueprint" abstract visual.
- [ ] **Stats**: Hover over numbers to see subtle lift effect.

## 3. Dark Mode Consistency
- Verify background is deep black/zinc (`#0a0a0a`) everywhere.
- No white flashes on page transitions.
- Text should be `zinc-400` (gray) for secondary text, White for headings.

## 4. Mobile Responsiveness
- Open Chrome DevTools (F12) -> Toggle Device Toolbar.
- [ ] **Navbar**: Hamburger menu opens/closes smoothly.
- [ ] **Grid**: Products stack vertically on mobile.
- [ ] **Padding**: Ensure content isn't touching screen edges.

---
**Troubleshooting**
- If icons assume squares: `lucide-react` might need a restart of the dev server.
- If styles look plain: Ensure `globals.css` loaded correctly in `layout.tsx`.
