# Agent Context Self-Healing & Living Documentation

> **Status:** Məcburi Qayda (Inviolable Invariant)

1. **State & Types Sync:** `src/core/types.ts` dəyişdikdə `AGENTS.md`, `.agents/skills/` və müvafiq sənədlər dərhal sinxronlaşdırılmalıdır.
2. **Kartoqrafiya & UI Sync:** Yeni UI panelləri, SVG layları və ya kamera naviqasiyaları əlavə edildikdə sənədlər yenilənməlidir.
3. **Verification Gate:** Hər tapşırıq `npm run typecheck` və `npm test` (35/35 yaşıl) ilə doğrulanmalıdır.
