## Owner Experience Enhancements Specification

Status: Ordering Tutorial on Shop Page — COMPLETED; Offering Type & Showcase Priority — COMPLETED; Search Preference & Batch Meta — COMPLETED

Next Focus: Owner Replies to Reviews — IN PROGRESS; Shop Online/Offline Toggle — NEXT; Map Clustering — NEXT

### Goal
Deliver high‑value improvements for store owners without changing code yet. This document defines UX, data, and behavior requirements for:
- Shop setup checklist with progress and go‑live gate
- Product sizes/options parity with Services
- Owner replies to reviews
- Shop on/off visibility toggle
- Map clustering (Airbnb‑style) with shop logos in clusters for search results
- In‑shop ordering tutorial

### Non‑Goals
- Implementation in code (this is a planning spec)
- Payment processor changes
- Large redesigns that deviate from current brand/look

### Design System and UI Guidelines
- Follow existing project styles (colors, typography, spacing, shadows) so new UI looks native.
- Use the existing component patterns and spacing scale from `Frontend/src/components/*` and page styles in `Frontend/src/pages/*`.
- Icons: use Lucide icons consistently for actions, states, and checklist items (per project preference) [[memory:7840669]].
- Keep mobile first: touch targets ≥ 44px, sticky primary actions, readable contrast.

---

## 1) Shop Setup Checklist

### Purpose
Guide owners to complete essential steps before going live and provide an at‑a‑glance progress meter afterward.

### Checklist Items (MVP)
- Ordering tutorial on shop page — DONE
- Shop offering type: Products only, Services only, or Both (REQUIRED)
- Showcase priority: Show Products first or Services first (REQUIRED when Both) — DONE
- Owner replies to reviews — IN PROGRESS (spec finalized; implementation queued)
- Shop Online/Offline toggle — PENDING
- Map clustering with shop logos — PENDING
- Shop profile: name, description, category
- Branding: logo, banner
- Location and hours: address, opening hours
- Contact: phone/email and preferred method
- Fulfillment: pickup and/or delivery configuration
- Payment readiness: payout details set (if applicable)
- First items published: at least 3 products or services with photos
- Policies: refund/cancellation and terms acknowledged

### Recently Implemented Enhancements
- Shop Page Tutorial with data-tutorial anchors and overlay — implemented.
- Shop Offering & Showcase Priority (backend + frontend create/edit/manage + display badges) — implemented.
- Search improvements:
  - Preference-aware sorting for products/services in results — implemented.
  - Shop logo and "Prefers Products/Services" hint on item cards — implemented.
  - Batch `/shops/meta` endpoint and frontend integration to avoid N+1 — implemented.

### Upcoming Enhancements (Queued)
- Owner Replies to Reviews:
  - Backend: add `OwnerReply` model (reviewId, ownerId, text, createdAt, editedAt), endpoints: POST/PUT/DELETE, rate-limit; expose reply in review fetch.
  - Frontend: reply editor in `ShopReviews`, owner badge, collapse/expand, notifications.
- Shop Online/Offline Toggle:
  - Backend: add endpoint to toggle `isActive` for owner; audit; cache invalidation.
  - Frontend: toggle in dashboard header; public offline banner with optional message.
- Map Clustering with Logos:
  - Frontend: cluster renderer with logo collage, animated zoom-to-bounds; virtualization for marker density.

### Behavior
- Progress meter shows X/Y completed with a visual ring or bar.
- “Go live” button disabled until all required items are completed; show tooltip listing missing items.
- Each item opens its corresponding editor; show inline validation and success state upon completion.
- Persistent banner on the owner dashboard until live.

### Data
- Store `checklistCompletion` object per shop with boolean flags and `completedAt` timestamps.
- Derive `isReadyForLaunch` from required flags.

### UX Details
- Card on dashboard with: progress ring, missing items list, primary action “Complete setup”.
- Use subtle success chips for completed items, warning chips for missing.

---

## 2) Product Sizes/Options Parity with Services

### Purpose
Give products the same flexible option system as services (sizes, add‑ons, time‑based or inventory‑based availability), preserving familiar UX.

### Data Model (conceptual)
- OptionGroup: id, name (e.g., Size, Flavor), selectionType (single|multiple), isRequired, maxSelectable, displayOrder.
- Option: id, groupId, label, priceModifier (flat or percentage), skuSuffix, availability (always|schedule), stockTracking (on|off), initialStock.
- Product: has many OptionGroups. Variant SKU can be assembled as baseSKU + option skuSuffixes.

### Pricing and Inventory
- Support base price + option modifiers.
- Optional sale price and scheduling per product.
- Optional stock tracking at option level with low‑stock threshold and alerts.

### UI/UX
- In editor: same grouping UI as services (groups with rows of options).
- In PDP (product page): render groups as chips or radio/checkbox controls to match service part styling.
- Show dynamic price as selections change; disable out‑of‑stock options.
- Bulk operations: CSV import/export for options; drag‑to‑reorder groups and options.

### Validation
- Required groups must have a selection before Add to Cart is enabled.

---

## 2b) Shop Offering Type & Showcase Priority

### Purpose
Allow each shop to explicitly choose whether it offers Products, Services, or Both, and pick which to showcase first to customers.

### Data Model (conceptual)
- Shop.offeringType: `products` | `services` | `both`
- Shop.showcasePriority: `products` | `services` (applies when `offeringType = both`)

### Behavior
- If `offeringType = products`, hide Services tab/sections across the UI and default to Products.
- If `offeringType = services`, hide Products tab/sections and default to Services.
- If `offeringType = both`, show both tabs and default active tab based on `showcasePriority`.
- Search and discovery continue to work; presentation order on the shop page follows `showcasePriority`.
- Search results preference-aware sorting for item results — IMPLEMENTED.

### UI/UX
- Shop Edit/Management: Settings card with radio options for Offering Type and a secondary radio for Showcase Priority (enabled only when `both`).
- Shop Page: Tabs respect visibility (only show relevant tabs) and initial active tab respects `showcasePriority`.
- Consistent with existing styling in `ShopPage.jsx` tabs and management settings patterns.

### Validation
- `offeringType` is required.
- `showcasePriority` is required only if `offeringType = both`.

---

## 3) Owner Replies to Reviews

### Purpose
Allow owners to respond to reviews publicly, improving trust and resolution.

### Behavior
- One official owner reply per review; owner can edit or delete their reply (audit timestamps kept).
- Editing allowed within 15 minutes for typo fixes; after that, edits are versioned (show “edited” label).
- Owner badge displayed next to reply; replies are nested under the original review.
- Notifications: owner receives a notification when a new review arrives; reviewer receives a notification when owner replies.

### Implementation Notes
- Backend
  - Data: `owner_replies` table: id, reviewId, ownerId, shopId, text, createdAt, updatedAt, edited (bool).
  - Endpoints: `POST /api/reviews/{id}/reply`, `PUT /api/reviews/{id}/reply`, `DELETE /api/reviews/{id}/reply`.
  - Permissions: owner of the shop or admin; input validation + rate limiting.
- Frontend
  - `ShopReviews`: add inline reply box for owners; show reply under review; edit/delete for owner; “edited” indicator.
  - Analytics: replyCreated, replyEdited, replyDeleted.

### UI/UX
- In owner dashboard: Reviews list with filter (all/with reply/without reply/stars).
- Inline reply editor beneath each review with character count and submit/cancel.
- On shop page: show replies collapsed after 2 lines with “Read more”.

### Moderation/Safety
- Abuse report flow available on both reviews and replies.
- Basic rate limiting to prevent spam.

---

## 4) Shop On/Off Toggle (Visibility)

### Purpose
Let owners temporarily pause their shop without deleting it.

### States
- Online: visible in search/maps, can receive orders.
- Offline: hidden from discovery and maps; direct shop link shows an offline banner with optional custom message and disabled ordering.

### Behavior
- Toggle from owner dashboard header; confirm dialog explains impact.
- Optional schedule: set an offline window (start/end); auto‑revert to Online after end.
- Search indexing honors visibility immediately; cache invalidation queued.

### Implementation Notes
- Backend: `PATCH /api/shops/{slug}/status` already present for admin. Add owner endpoint `PATCH /api/shops/{id}/visibility` (authz: owner) with body `{ isActive, message?, until? }`.
- Frontend: Dashboard header toggle + optional schedule modal; public banner on `ShopPage` when offline (with message/eta).

### UI/UX
- Clear status chip (Online/Offline) in dashboard header.
- When offline, show a public‑facing card with expected return time and contact info (if provided).

---

## 5) Map Clustering with Shop Logos (Search Results)

### Purpose
Improve map usability in dense areas, similar to Airbnb clusters, and aid brand recognition.

### Behavior
- Cluster nearby shop markers into cluster bubbles showing a count.
- Cluster icon shows up to N (e.g., 3–4) small shop logos in a collage when available; otherwise, use default cluster styling.
- Clicking a cluster zooms in to bounds until markers separate; if still dense, recurse until individual markers are shown.
- Applies to search results map (and any map showing multiple shops).

### UI/UX
- Marker: use existing shop pin style; hover/click shows mini card.
- Cluster bubble: rounded shape with count, light brand background, subtle border/shadow; collage of logos when available.
- Performance: virtualize marker rendering; debounce map movements.

### Implementation Notes
- Use Google Maps MarkerClusterer or Leaflet MarkerCluster. Provide custom renderer that composes up to 4 logos; fallback to count-only.
- On click: compute cluster bounds and animate to fit; adjust zoom threshold to avoid over-zoom.

### Data and States
- Each shop marker contains: id, name, logo URL, lat/lng, online/offline state (style offline differently).
- When cluster is clicked, animate zoom and pan to cluster bounds.

---

## 6) Ordering Tutorial on Shop Page

### Purpose
Help first‑time visitors understand how to place an order.

### Trigger
- First visit to a shop page or when explicitly launched from a “How ordering works” link. Respect user choice: “Skip” and “Don’t show again” persisted.

### Flow (example 4–6 steps)
1) Welcome: brief intro, highlight shop status (Online/Offline), delivery/pickup availability.
2) Browse: highlight categories/filters and product/service cards.
3) Customize: highlight options/sizes area and dynamic price updates.
4) Add to cart: highlight Add to Cart; show where the cart lives.
5) Checkout: highlight checkout button and key steps (contact, schedule, payment).
6) Support: where to find policies and contact.

### Implementation Notes (selected feature)
- Use existing `TutorialProvider`, `TutorialOverlay`, `TutorialPrompt`, and `TutorialTrigger` components.
- Ensure `shopPageTutorialSteps` targets exist in `ShopPage.jsx` using `data-tutorial` attributes for: header, tabs, add to cart, order now, cart, place order, contact, reviews.
- Persist completion in `localStorage` key scoped per shop, e.g., `tutorial_completed_shop_<shopId>`.
- Gate auto‑prompt to first visit; allow manual restart via trigger.

### UX/Design
- Use in‑context guided tour with spotlight/overlay and tooltips matching project styling.
- Keyboard accessible; mobile friendly; progress dots and back/next controls.
- Persist completion in local storage per shop.

---

## 7) Smart Search Bar & Adaptive Landing Layout

### Purpose
Deliver intent-aware search that adapts the landing page layout to the user’s query (shops vs products vs services). For product/service intents, visually blend item discovery with shop identity.

### Behavior
- Query parsing detects intent: `shop` vs `product` vs `service` based on keywords, categories, and history.
- Results mode:
  - Shops mode: use existing shop card layout (logo, cover, rating, distance).
  - Products/Services mode: use the same card structure but place the item image in the hero/cover slot while retaining the shop’s name/logo and metadata.
- Switching modes triggers layout transition; map clustering still applies.
- Debounced input with suggested queries and recent searches.
- Preference-aware ordering for item results (based on shop priority) — IMPLEMENTED.
- Batch shop meta endpoint to avoid N+1 — IMPLEMENTED.

### Data & Ranking
- Combined index: shops, products, services with type field.
- Ranking signals: text relevance, proximity, popularity (views/orders), availability (online/open now).
- Facets: category, price range, open now, distance.

### UI/UX
- Search bar: pill style with Lucide search icon and clear button; suggestions dropdown with grouped results (shops, products, services).
- Result cards in products/services mode:
  - Hero image: product/service image replaces the cover area.
  - Shop identity strip: shop logo + name, rating, and quick visit link.
  - Action: “View item” opens PDP/Service details; secondary “Visit shop”.
- Maintain existing visual language (spacing, shadows, rounded corners, hover states).

### Accessibility
- ARIA roles for combobox and listbox; keyboard navigation across suggestions and facets.

### Analytics
- Track query intent, mode switches, suggestion clicks, and card clicks by type.

---

## Accessibility
- All new interactive elements keyboard navigable, focus visible.
- ARIA roles for clusters, markers, and tutorial steps.
- Sufficient color contrast for badges, chips, and cluster bubbles.

## Analytics & Events
- Checklist step completion events with step id and duration.
- Option selection events (group/option ids) for PDP insights.
- Review reply created/edited/deleted events.
- Shop visibility toggled with reason/schedule metadata.
- Map interactions: cluster click, zoom level after click, marker open.
- Tutorial: started, stepViewed, completed, dismissed.

## Acceptance Criteria (MVP)
- Checklist visible on dashboard with progress and go‑live gate; required items enforced.
- Shop can set Offering Type (Products, Services, Both) and Showcase Priority; shop page tabs reflect choices and default tab follows priority. — DONE
- Products support option groups mirroring services; PDP enforces required selections and displays dynamic price.
- Owner can post a single public reply per review; replies visible on shop page.
- Owner can toggle shop Online/Offline; search/map visibility updates; offline public message shown.
- Search results map clusters in dense areas; clicking clusters zooms in; cluster icons can display shop logos.
- Ordering tutorial appears for first‑time visitors with a skippable, accessible guided flow. — DONE
- Smart Search Bar adapts landing layout by intent (shops vs products vs services); when showing products/services, the card uses the shop’s name/logo with the item image placed in the visual slot. Preference-aware sorting and batch meta — PARTIAL (sorting + meta done; adaptive layout pending).

## Rollout Plan
1) Foundations: ensure pages expose stable `data-tutorial` targets (shop header, tabs, cart, review button, contact, place order) and shared components for tabs/cards are used by both products and services. — DONE
2) Ordering tutorial on shop page: wire steps, prompt, overlay; persist per-shop completion. — DONE
3) Shop offering type & showcase priority: add settings; tabs respect visibility and default state; update tutorial steps to branch based on offering type. — DONE
4) Product sizes/options parity with services: align PDP forms; ensure tutorial step 3 highlights options consistently.
5) Owner replies to reviews: add reply UI and surface in shop reviews; tutorial points to reviews section.
6) Shop Online/Offline toggle: affect visibility and shop page banner; tutorial welcome step reflects status.
7) Map clustering with logos: search results clustering and zoom behavior; tutorial landing steps mention clustered map interactions.
8) Smart search bar & adaptive landing: detect intent; adjust layout and card image slot; ensure tutorial covers both modes. — PARTIAL (preference-aware sorting + batch meta done)
9) Checklist UI: progress computation includes offering type/priority; go-live gate enforced.
10) QA on mobile/desktop; accessibility check; analytics validation.


