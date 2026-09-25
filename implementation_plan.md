# InviteMe — SaaS Digital Wedding Invitation Builder
## Architecture & Implementation Plan

> **Stack**: Laravel 13 · PHP 8.4 · MySQL · React + TypeScript · Vite · Tailwind CSS 4 · dnd-kit · Tiptap

---

## Background

A fresh Laravel 13 project is already in place at `d:\laragon\www\inviteme` with:
- PHP 8.4.24, Composer 2.4.4
- MySQL database `inviteme` configured
- Vite + Tailwind CSS 4 already in `package.json`
- Laravel Boost must be installed first (per AGENTS.md rule)

The product is a **DIY digital wedding invitation builder** with the tagline:  
**«Design Gratis. Bayar Saat Siap Publish.»**

---

## Open Questions

> [!IMPORTANT]
> Please review these before I begin implementation:

1. **Frontend architecture**: The brief says React + TypeScript + Vite. Should the React SPA live **inside** the same Laravel project (served via Vite/Inertia), or as a **separate frontend** repo? I recommend a **single monorepo** approach using **Inertia.js** — this avoids CORS issues, simplifies auth, and matches the resource-constrained server.

2. **Subdomain routing**: The brief mentions `app.domain.com` and `admin.domain.com`. For MVP on a home server, should we use **path-based routing** (`domain.com/app`, `domain.com/admin`) instead, to simplify Apache VHost config?

3. **Laravel Boost**: This is required per `AGENTS.md`. It may replace some bootstrap instructions. I will install it and re-read updated guidelines before proceeding.

4. **Payment gateway**: Indonesian market — should I integrate **Midtrans** (most common) or **Xendit** for Phase 9? Or leave as a stub for now? (For Phase 9 execution: Should I build a full Midtrans Sandbox integration, or just simulate the payment flow without third-party API calls for this MVP?)
5. **Composer version**: Composer 2.4.4 is old (2022) and producing deprecation warnings with PHP 8.4. Should I update it, or leave it?
6. **Media Optimization**: Do you have a preference between GD or Imagick for `intervention/image` in Phase 8? (GD is universally supported, Imagick is often better but needs PECL extension).

---

## Proposed Architecture

### High-Level System Design

```
Internet → Cloudflare → Cloudflare Tunnel → Apache (Debian)
                                                   ↓
                                         Laravel 13 (Monolith)
                                                   ↓
                                    ┌──────────────────────────┐
                                    │  React SPA (via Inertia) │
                                    │  · Public Marketing Site │
                                    │  · User Dashboard        │
                                    │  · Visual Editor         │
                                    │  · Admin Dashboard       │
                                    └──────────────────────────┘
                                                   ↓
                                          MySQL Database
                                                   ↓
                                     Local Storage → future S3/R2
```

### Why Inertia.js (not API + standalone React)?

- Single codebase, single deployment
- Laravel handles auth/session natively — no JWT/Sanctum token juggling
- No CORS setup needed
- Works great on low-RAM home servers (no separate Node.js process)
- React stays on client side for all interactive UI (editor, countdown, gallery)
- Can be extracted to separate frontend later if needed

---

## Database Schema (ERD)

### Core Tables

```
users
├── id (ulid/bigint)
├── name
├── email (unique, indexed)
├── email_verified_at
├── password
├── role (enum: user, admin) — default: user
├── avatar
├── phone
├── timestamps
└── soft_deletes

invitations
├── id (ulid)
├── user_id → users.id
├── title
├── slug (unique, indexed)
├── status (enum: draft, published, suspended) — default: draft
├── design (json) — the full invitation JSON structure
├── theme (json) — theme overrides
├── published_at
├── expires_at
├── timestamps
└── soft_deletes

invitation_templates
├── id (ulid)
├── created_by → users.id (admin)
├── name
├── slug (unique)
├── description
├── category (string)
├── thumbnail_media_id → invitation_media.id
├── design (json) — template JSON structure
├── is_premium (boolean)
├── is_published (boolean)
├── sort_order
├── timestamps
└── soft_deletes

guests
├── id (ulid)
├── invitation_id → invitations.id
├── name
├── phone (nullable)
├── email (nullable)
├── group (nullable)
├── address (nullable)
├── token (unique, indexed) — random 8-char non-guessable
├── rsvp_status (enum: pending, confirmed, declined) — default: pending
├── timestamps
└── soft_deletes

rsvp_responses
├── id (ulid)
├── invitation_id → invitations.id
├── guest_id → guests.id (nullable — walk-in RSVP)
├── attendance (enum: yes, no)
├── attendee_count (int, default: 1)
├── message (text, nullable)
├── ip_address
├── submitted_at
└── timestamps

invitation_media
├── id (ulid)
├── user_id → users.id
├── invitation_id → invitations.id (nullable — user-level media)
├── filename (original name)
├── storage_path (relative path on disk/S3)
├── disk (string: local, s3) — for future migration
├── mime_type
├── size_bytes
├── width (nullable — images)
├── height (nullable — images)
├── alt_text (nullable)
├── timestamps
└── soft_deletes

orders
├── id (ulid)
├── user_id → users.id
├── invitation_id → invitations.id
├── plan (string: basic, premium)
├── amount (integer, in IDR cents/smallest unit)
├── currency (default: IDR)
├── status (enum: pending, paid, failed, refunded)
├── payment_gateway (string: midtrans, xendit, manual)
├── gateway_order_id (nullable)
├── gateway_payment_id (nullable)
├── paid_at (nullable)
├── timestamps
└── soft_deletes

plans (configurable — no hardcoded prices)
├── id (ulid)
├── key (string: basic, premium)
├── name
├── description
├── price (integer, IDR)
├── features (json)
├── is_active (boolean)
└── timestamps

analytics_events
├── id (bigint — high volume)
├── invitation_id → invitations.id
├── guest_id → guests.id (nullable)
├── event_type (enum: view, rsvp_open, rsvp_submit, link_click)
├── ip_address
├── user_agent
├── metadata (json, nullable)
└── created_at (no updated_at — append-only)
```

### Key Indexes
```sql
invitations: slug (unique)
guests: invitation_id, token (unique), (invitation_id, token) composite
rsvp_responses: invitation_id, guest_id
invitation_media: user_id, invitation_id
analytics_events: invitation_id, event_type, created_at
orders: user_id, invitation_id, status
```

---

## JSON Design Schema

```json
{
  "version": 1,
  "meta": {
    "title": "The Wedding Of Andi & Sarah",
    "coupleNames": "Andi & Sarah",
    "weddingDate": "2027-12-12T10:00:00+08:00",
    "slug": "andi-sarah"
  },
  "theme": {
    "primaryColor": "#8B5E5E",
    "secondaryColor": "#D4B896",
    "backgroundColor": "#FDF8F3",
    "fontHeading": "Playfair Display",
    "fontBody": "Inter",
    "accentColor": "#C8956C"
  },
  "settings": {
    "guestGreeting": "Kepada Yth.\n{{guest.name}}",
    "musicAutoplay": false,
    "showRsvp": true,
    "language": "id"
  },
  "blocks": [
    {
      "id": "block_uuid_001",
      "type": "hero",
      "visible": true,
      "props": {
        "title": "The Wedding Of",
        "coupleNames": "Andi & Sarah",
        "subtitle": "12 Desember 2027",
        "backgroundImage": "media_ulid_123",
        "overlayOpacity": 0.4,
        "textAlign": "center",
        "animation": "fade-in"
      }
    },
    {
      "id": "block_uuid_002",
      "type": "countdown",
      "visible": true,
      "props": {
        "targetDate": "2027-12-12T10:00:00+08:00",
        "label": "Menuju Hari Bahagia",
        "completedText": "Hari Ini!"
      }
    },
    {
      "id": "block_uuid_003",
      "type": "event",
      "visible": true,
      "props": {
        "events": [
          {
            "name": "Akad Nikah",
            "date": "2027-12-12",
            "time": "08:00",
            "venue": "Masjid Al-Hikmah",
            "address": "Jl. Contoh No. 1, Jakarta"
          },
          {
            "name": "Resepsi",
            "date": "2027-12-12",
            "time": "11:00",
            "venue": "Hotel Grand Mercure",
            "address": "Jl. Contoh No. 2, Jakarta"
          }
        ]
      }
    },
    {
      "id": "block_uuid_004",
      "type": "gallery",
      "visible": true,
      "props": {
        "images": ["media_ulid_124", "media_ulid_125"],
        "layout": "grid",
        "columns": 2
      }
    },
    {
      "id": "block_uuid_005",
      "type": "rsvp",
      "visible": true,
      "props": {
        "title": "Konfirmasi Kehadiran",
        "subtitle": "Mohon konfirmasi kehadiran Anda",
        "deadline": "2027-12-05"
      }
    }
  ]
}
```

### Block Type Registry (Initial)

| Type | Description |
|------|-------------|
| `hero` | Hero section with couple names, date, background |
| `couple_profile` | Bride & groom photos + bio |
| `text` | Rich text block (Tiptap) |
| `image` | Single image with caption |
| `gallery` | Multi-image gallery (grid/masonry/slider) |
| `countdown` | Live countdown timer |
| `event` | Event schedule (akad/resepsi) |
| `location` | Venue with embedded Google Maps |
| `love_story` | Timeline of relationship milestones |
| `video` | Embedded YouTube/video |
| `music` | Background music player |
| `rsvp` | RSVP form |
| `gift` | Digital gift/bank transfer info |
| `divider` | Visual divider/separator |
| `spacer` | Vertical spacer |

---

## Folder Structure

```
inviteme/                          ← Laravel root
├── app/
│   ├── Console/Commands/
│   ├── Enums/
│   │   ├── InvitationStatus.php
│   │   ├── RsvpAttendance.php
│   │   └── UserRole.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── Api/
│   │   │   │   ├── InvitationController.php
│   │   │   │   ├── TemplateController.php
│   │   │   │   ├── GuestController.php
│   │   │   │   ├── MediaController.php
│   │   │   │   ├── RsvpController.php
│   │   │   │   └── OrderController.php
│   │   │   ├── Admin/
│   │   │   │   ├── AdminUserController.php
│   │   │   │   ├── AdminInvitationController.php
│   │   │   │   ├── AdminTemplateController.php
│   │   │   │   └── AdminOrderController.php
│   │   │   └── PublicController.php
│   │   ├── Middleware/
│   │   │   ├── EnsureAdmin.php
│   │   │   └── TrackInvitationView.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Invitation.php
│   │   ├── InvitationTemplate.php
│   │   ├── Guest.php
│   │   ├── RsvpResponse.php
│   │   ├── InvitationMedia.php
│   │   ├── Order.php
│   │   ├── Plan.php
│   │   └── AnalyticsEvent.php
│   ├── Policies/
│   │   ├── InvitationPolicy.php
│   │   └── GuestPolicy.php
│   └── Services/
│       ├── InvitationService.php
│       ├── GuestTokenService.php
│       ├── MediaService.php
│       ├── DesignRendererService.php
│       └── TemplateService.php
├── database/migrations/
├── resources/
│   ├── js/                        ← React + TypeScript SPA
│   │   ├── app.tsx
│   │   ├── types/
│   │   ├── pages/
│   │   │   ├── Landing/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Editor/
│   │   │   ├── Public/
│   │   │   └── Admin/
│   │   ├── components/
│   │   │   ├── blocks/            ← Block renderers (shared editor + public)
│   │   │   │   ├── HeroBlock.tsx
│   │   │   │   ├── CountdownBlock.tsx
│   │   │   │   ├── GalleryBlock.tsx
│   │   │   │   └── ...
│   │   │   ├── editor/
│   │   │   │   ├── BlockPanel.tsx
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── PropertiesPanel.tsx
│   │   │   │   └── EditorToolbar.tsx
│   │   │   └── ui/
│   │   ├── hooks/
│   │   └── lib/
│   │       ├── blockRegistry.ts   ← Central block type → component map
│   │       ├── designSchema.ts    ← TypeScript types for JSON schema
│   │       └── api.ts
│   └── css/
│       └── app.css
└── routes/
    ├── web.php                    ← Inertia routes
    ├── api.php                    ← REST API routes
    └── admin.php                  ← Admin routes
```

---

## API Structure

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/user
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Invitations
```
GET    /api/invitations                    — list user's invitations
POST   /api/invitations                    — create invitation
GET    /api/invitations/{id}               — get invitation
PUT    /api/invitations/{id}               — update metadata
DELETE /api/invitations/{id}               — soft delete
PUT    /api/invitations/{id}/design        — save design JSON
POST   /api/invitations/{id}/publish       — trigger publish (after payment)
POST   /api/invitations/{id}/clone-template — apply template to invitation
```

### Templates
```
GET    /api/templates                      — list published templates
GET    /api/templates/{id}                 — get template
```

### Guests
```
GET    /api/invitations/{id}/guests        — list guests
POST   /api/invitations/{id}/guests        — add guest
PUT    /api/invitations/{id}/guests/{gid}  — update guest
DELETE /api/invitations/{id}/guests/{gid}  — remove guest
POST   /api/invitations/{id}/guests/{gid}/generate-link — generate token
```

### Media
```
GET    /api/invitations/{id}/media         — list media
POST   /api/invitations/{id}/media         — upload media
DELETE /api/media/{id}                     — delete media
```

### RSVP (Public — no auth)
```
GET    /api/public/{slug}                  — get public invitation data + resolve guest token
POST   /api/public/{slug}/rsvp            — submit RSVP
```

### Orders / Payment
```
POST   /api/orders                         — create order
GET    /api/orders/{id}                    — get order status
POST   /api/orders/{id}/pay               — initiate payment
POST   /api/webhooks/payment              — payment gateway webhook
```

### Admin
```
GET    /api/admin/users
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}

GET    /api/admin/invitations
GET    /api/admin/templates
POST   /api/admin/templates
PUT    /api/admin/templates/{id}
DELETE /api/admin/templates/{id}

GET    /api/admin/orders
GET    /api/admin/stats
```

---

## Web Routes (Inertia)

```
GET  /                           → Landing page (marketing)
GET  /login                      → Login page
GET  /register                   → Register page

GET  /dashboard                  → User dashboard
GET  /invitations                → My invitations
GET  /invitations/create         → Create invitation wizard
GET  /invitations/{id}/editor    → Visual editor
GET  /invitations/{id}/guests    → Guest management
GET  /invitations/{id}/rsvp      → RSVP dashboard
GET  /invitations/{id}/analytics → Analytics
GET  /templates                  → Template gallery

GET  /admin                      → Admin dashboard
GET  /admin/*                    → Admin routes (role guarded)

GET  /{slug}                     → Public invitation renderer
```

---

## Architectural Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Low RAM (1.45 GB) | Avoid Redis, queue only essential jobs, use DB driver for queue/cache/session |
| JSON design field growth | Use MySQL JSON type with proper indexing; set `design` column as `longText` JSON |
| Composer 2.4.4 deprecation warnings | Will upgrade Composer if it causes install failures |
| Template cloning | Deep-copy JSON, reassign block IDs with `Str::uuid()`, keep media references |
| Guest token collision | Use `Str::random(12)` with retry-on-collision; add unique constraint |
| Public invitation performance | Cache rendered invitation data; serve media via CDN path |
| Block extensibility | Central `blockRegistry.ts` map — add new block = add 1 file + 1 registry entry |
| Inertia vs pure API | If subdomain routing needed later, can expose same controllers as pure JSON API |
| Security: mass assignment | All models use `$fillable` explicitly, never `$guarded = []` |
| XSS in rich text | Tiptap output sanitized via `HTMLPurifier` on server save |

---

## Implementation Phases

### ✅ Phase 0 — Bootstrap (NOW)
1. Install Laravel Boost (required by AGENTS.md)
2. Re-read updated AGENTS.md guidelines
3. Install Laravel Sanctum + Inertia + React
4. Install frontend deps (dnd-kit, Tiptap, Lucide, etc.)
5. Configure `.env` properly

### Phase 1 — Foundation
- User model with `role` enum
- All database migrations
- Laravel Sanctum auth (login/register/logout)
- Inertia setup with React + TypeScript
- Basic layout components (nav, sidebar)

### Phase 2 — Invitation Core
- Invitation CRUD
- Slug generation
- Design JSON storage
- Basic invitation renderer

### Phase 3 — Visual Editor
- Block panel + canvas + properties panel
- dnd-kit drag/drop block reordering
- Block add/remove/duplicate
- All 15 initial block types
- Autosave + explicit save
- Undo/redo (Zustand history)
- Mobile/desktop preview toggle

### Phase 4 — Templates
- Template CRUD (admin)
- Template gallery (public)
- Clone template → invitation

### Phase 5 — Public Invitation
- `/{slug}` route → React renderer
- Guest token resolution
- Personalized greeting with `{{guest.name}}`
- Mobile-first design

### Phase 6 — Guests
- Guest CRUD
- Token generation
- Shareable URL generation
- Guest list UI

### Phase 7 — RSVP
- Public RSVP form
- RSVP storage
- Dashboard statistics

### Phase 8 — Media
- Upload API
- Media library UI
- Image optimization (GD/Imagick)
- Storage abstraction (local → S3-ready)

### Phase 9 — Payment (stub)
- Plan/pricing config in DB
- Order creation flow
- Payment webhook handler (Midtrans-ready)
- Publish entitlement check

### Phase 10 — Admin
- Admin middleware/gate
- User management
- Invitation management
- Template management
- Orders overview
- Basic analytics dashboard

---

## Phase 8 & 9 Detailed Plan

### Phase 8 (Media)
1. **Dependencies**: Install `intervention/image` (v3).
2. **Backend**:
   - Update `InvitationMedia` model.
   - Build `MediaController` (`index`, `store`, `destroy`).
   - Media will be stored locally in `storage/app/public/media` for the MVP.
   - Image optimization: compress images and resize them to max 1920px before saving.
3. **Frontend**:
   - Build `/media` page (`resources/js/pages/Media/Index.tsx`) for users to manage their uploads.
   - Build a reusable `MediaPicker` modal component to allow users to select images from their library when editing blocks (e.g., Hero background, Gallery images) inside the Visual Editor.

### Phase 9 (Payments)
1. **Database Config**: Seed `plans` table with a basic and premium tier.
2. **Backend**:
   - Build `BillingController` (to show plans and billing history).
   - Build `OrderController` (`store`, `checkout`).
   - Build a `PaymentService` stub. Depending on your answer to Question #4, this will either integrate with Midtrans Sandbox or simply simulate a successful payment locally.
3. **Frontend**:
   - Build `/billing` page (`resources/js/pages/Billing/Index.tsx`).
   - Build Checkout UI flow.
4. **Publish Entitlement**: Update `InvitationController@publish` to require a paid `Order` before allowing an invitation to be published.

### Phase 10 (Admin Dashboard)
1. **Middleware & Routing**:
   - Create `EnsureAdmin` middleware to guard `/admin/*` routes.
   - Register Admin routes in `routes/web.php` (or a dedicated `routes/admin.php`).
2. **Backend Controllers**:
   - `Admin\DashboardController`: Overview stats (total users, total orders, revenue).
   - `Admin\UserController`: List users, change roles, suspend/ban users.
   - `Admin\TemplateController`: Create/edit/delete master templates (using the same Editor UI, but saving to `invitation_templates`).
   - `Admin\OrderController`: View all transactions.
3. **Frontend Views**:
   - `Admin/Layout.tsx`: Admin-specific layout and sidebar.
   - `Admin/Dashboard.tsx`: High-level analytics and charts.
   - `Admin/Users/Index.tsx`: User management table.
   - `Admin/Templates/Index.tsx`: Template management gallery.
   - `Admin/Orders/Index.tsx`: Transaction history.
4. **Testing**: Ensure regular users get 403 Forbidden when accessing `/admin`.

---

## Verification Plan

### After Phase 0–1
- Run `php artisan migrate` successfully
- Visit `/login` and `/register` in browser
- Create user, verify role column exists

### After Phase 2–3
- Create invitation, open editor
- Add/remove/reorder blocks
- Save design, reload and verify JSON persisted

### After Phase 4–5
- Select template → clone → editor opens
- Visit `/{slug}` as anonymous → invitation renders
- Visit `/{slug}?to={token}` → personalized greeting shows

### After Phase 6–7
- Add guest, generate token, copy link
- Visit link → see personalized name
- Submit RSVP → appears in dashboard

---

*Last updated: 2026-09-21*
