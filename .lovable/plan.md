

# Fix: Header navigation broken on non-landing pages

## Problem
When you're on any page other than the landing (`/`), clicking the header links ("Como funciona", "Precios", "FAQ") and the "Empezar" button does nothing. This happens because they use `document.getElementById()` to scroll to sections that only exist on the Index page. The logo also just scrolls to top instead of navigating back to home.

## Pages affected
- `/quienes-somos` (AboutUs)
- `/packs/:packId` (PackDetail)
- `/packs/:packId/etapa/:stageId` (PackStageProducts)
- Any future page that uses the Header

## Solution

### File: `src/components/Header.tsx`

**1. Fix hash-based nav links**: When not on the landing page, navigate to `/#section` instead of just trying to scroll. This will take the user to the home page and then scroll to the correct section.

- In `handleNavClick`: check if we're on `/`. If not, use `navigate("/" + link.href)` (e.g. `navigate("/#precios")`) so the user is taken to the landing page with the hash anchor.
- If already on `/`, keep the current smooth scroll behavior.

**2. Fix "Empezar" button**: Same logic in `handleCtaClick` — if not on `/`, navigate to `/#precios` instead of silently failing.

**3. Fix logo click**: Change from `window.scrollTo` to `navigate("/")` when not on the home page. If already on `/`, scroll to top as before.

All three fixes use `useLocation()` from react-router to detect the current path. No new files or dependencies needed.

## Technical details

- Import `useLocation` from `react-router-dom`
- Get `const location = useLocation()`
- In `handleNavClick` for hash links: if `location.pathname !== "/"`, call `navigate("/" + link.href)`; else do the existing scroll
- In `handleCtaClick`: if `location.pathname !== "/"`, call `navigate("/#precios")`; else do the existing scroll
- Logo `<a>`: replace with an onClick that checks pathname — if `/`, scroll to top; else `navigate("/")`
