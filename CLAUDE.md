# HB Physio — Project Reference

## What This Is
Internal lead management system for a physiotherapy clinic team. Managers create patient leads; physiotherapists claim and update them. Hebrew RTL UI, mobile-first.

**Live URL:** https://orhaliva206.github.io/hb-physio/
**GitHub:** https://github.com/OrHaliva206/hb-physio
**Auto-deploy:** push to `main` → GitHub Actions builds + deploys to `gh-pages`

---

## Passwords
| Role | Password |
|------|----------|
| Manager | `manager123` |
| Physio | `physio456` |

Defined in `src/config.js` as `MANAGER_PASS` / `PHYSIO_PASS`.

---

## Tech Stack
- **Vite + React 18**, Tailwind CSS, Lucide React icons
- **No backend** — localStorage only (leads, auth, notifications, profiles)
- **AI parsing:** Groq LLM (`llama-3.3-70b-versatile`) + Groq Whisper (`whisper-large-v3`) for voice
- **Env var:** `VITE_GROQ_API_KEY` — set in `.env.local` locally, GitHub Actions secret `GROQ_API_KEY` for CI
- **Font:** Heebo (Google Fonts), RTL Hebrew UI (`<html lang="he" dir="rtl">`)

---

## File Structure
```
src/
├── config.js                  # Passwords, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABEL
├── App.jsx                    # AuthProvider > LeadsProvider > AppRouter
├── context/
│   ├── AuthContext.jsx        # Auth state + profiles registry
│   └── LeadsContext.jsx       # Leads, toasts, notifications, addNote, updatePriority
├── utils/
│   ├── auth.js                # validatePassword()
│   ├── aiParser.js            # Groq LLM → JSON lead fields (falls back to mock)
│   ├── whisper.js             # Groq Whisper audio transcription
│   └── pushNotification.js   # Web Notifications API (requestPermission + send)
├── data/
│   └── mockLeads.js           # 4 Hebrew sample leads (all statuses, priority, notes)
├── hooks/
│   ├── useSpeechRecognition.js  # Web Speech API (unused, kept)
│   └── useNotifications.js      # Re-exports toasts from LeadsContext
└── components/
    ├── AppShell.jsx            # Header (bell + logout), main layout
    ├── auth/
    │   └── LoginScreen.jsx     # ProfilePicker → PasswordScreen → NameScreen
    ├── leads/
    │   ├── LeadFeed.jsx        # Sort (date/location) + filter + urgent-first sort
    │   ├── LeadCard.jsx        # Card + StatusDropdown + NotesSection + urgent banner
    │   ├── LeadFilter.jsx      # Free-text address filter
    │   └── StatusBadge.jsx     # Color badge
    ├── manager/
    │   ├── AddLeadPanel.jsx    # Collapsible panel: textarea / voice / manual
    │   ├── LeadEditForm.jsx    # Editable fields + priority toggle + publish
    │   └── VoiceButton.jsx     # MediaRecorder → Whisper → Groq parse → form fill
    └── ui/
        ├── Toast.jsx           # ToastContainer + auto-dismiss toasts
        └── Spinner.jsx         # Loading state
```

---

## Lead Data Model
```js
{
  id,              // crypto.randomUUID()
  createdAt,       // ISO string
  name,            // שם מטופל
  phone,           // טלפון (displayed with dir="ltr")
  address,         // כתובת / מיקום
  complaint,       // סיבת פנייה
  preferredHours,  // שעות מועדפות
  blackoutTimes,   // זמנים חסומים
  recurring,       // boolean
  status,          // 'open' | 'handling' | 'contacted' | 'flexible'
  claimedBy,       // display name | null
  priority,        // 'normal' | 'urgent'
  notes,           // [{ id, text, author, createdAt }]
  rawText,         // original paste/transcript
}
```

---

## Auth & Profile System
- **localStorage keys:** `hb_auth` (current session), `hb_profiles` (all registered users)
- First visit: enter password → physio enters name → profile saved
- Next visit: profile picker shows saved profiles → one tap = logged in, no password
- Manager auto-saves as "מנהל" profile on first login
- Logout clears `hb_auth` but keeps `hb_profiles`

---

## Status System
| Key | Label | Color |
|-----|-------|-------|
| `open` | פתוח | Blue |
| `handling` | מטפל - יוצר קשר בקרוב | Amber |
| `contacted` | נוצר קשר | Green |
| `flexible` | גמיש, מטפל/ת אחר יכולים ליצור קשר | Orange |

Cards have `border-s-4` (RTL logical) colored by status.

---

## Features Implemented
1. **Lead feed** — sort by date/location, filter by address, urgent leads float to top
2. **Add lead** — paste text (AI parse), voice recording (Whisper → Groq), or manual form
3. **Status dropdown** — per card, color-coded, updates claimedBy
4. **Urgent priority** — red top banner "דחוף — יצירת קשר מיידי" + animated flame; manager toggles on card or in create form
5. **Notes/הערות** — collapsible per-lead comments section; all roles can add; shows author + relative time
6. **Bell notifications** — manager sees log of status changes by physios; red badge count; "נקה הכל"
7. **Push notifications** — Web Notifications API; browser prompts manager for permission on login; fires on every status change
8. **Profile system** — persistent profiles in localStorage; one-tap login after first registration
9. **Delete leads** — manager only, with Hebrew confirm dialog
10. **Toast notifications** — auto-dismiss 4s, fires on add/update/delete

---

## RTL Rules (Important)
- Always use Tailwind **logical properties**: `ps-`, `pe-`, `ms-`, `me-`, `border-s`, `border-e`, `start-`, `end-`, `text-start`
- Never use physical `pl-`, `pr-`, `border-l`, `border-r`
- Phone numbers: wrap in `<span dir="ltr">` to prevent digit reversal

---

## Deployment
```yaml
# .github/workflows/deploy.yml
# Builds with VITE_GROQ_API_KEY from GitHub secret GROQ_API_KEY
# Deploys to gh-pages branch via peaceiris/actions-gh-pages@v3
```
- `vite.config.js` has `base: '/hb-physio/'`
- To update secret: `gh secret set GROQ_API_KEY`

---

## Pending / Future Work
- [ ] **PWA** — add `vite-plugin-pwa` + manifest for "Add to Home Screen" native app experience
- [ ] **Supabase backend** — replace localStorage with real DB for cross-device sync
- [ ] **Real-time updates** — Supabase subscriptions so physios see leads update live
- [ ] **Push notifications on iOS** — requires PWA (Add to Home Screen) on iOS 16.4+
- [ ] **Lead assignment** — manager explicitly assigns a lead to a specific physio
- [ ] **Analytics** — how many leads per physio, conversion rates
