# Medieval Sim Mobile Lite — Agent Təlimatı və Konteksti

> **HƏQİQƏTİN MƏNBƏYİ:** Bu fayl və `src/core/types.ts`

Bu layihə **Medieval Simulator**-un ultra-yüngül, sürətli, Antiyoy / Age of Conquest tərzində mobil üçün optimallaşdırılmış versiyasıdır.

---

## 1. Layihənin Mahiyyəti

* **Janr:** Mobil Turn-based Əyalət Strategiyası (Lite / Fast-paced). Offline, tək oyunçu (və gələcək Liderlik/PvP), mobil-first (Capacitor → Android APK / Google Play).
* **Əsas Döngü:** Əyalət gəliri (Qızıl) → Qoşun maaşı (Upkeep) → Döyüş və Sürətli Genişlənmə → 5–15 dəqiqəlik bitən partiyalar.
* **Xəritə:** 100% prosedural Voronoi (16–36 region), sıfır ağır topoqrafiya yükü, sürətli vizual toxunuş və axıcı 60fps animasiyalar.

---

## 2. Beş Pozulmaz İnvariant (Non-Negotiable Invariants)

1. **I-1 · Determinizm:** `src/core/` daxilində `Math.random()`, `Date.now()`, `new Date()`, `setTimeout` **tamamilə qadağandır**. Təsadüfilik yalnız inyeksiya edilən `Rng` (mulberry32) vasitəsilə təmin edilir. Eyni seed = eyni partiya.
2. **I-2 · `applyAction` Tək Giriş Nöqtəsidir:** UI, AI bot və simulyator vəziyyəti (state) **yalnız** `applyAction(g, action)` vasitəsilə dəyişir.
3. **I-3 · Balans Sabitlərinin Tək Mənbəyi:** Bütün rəqəmlər yalnız `src/core/types.ts` (`RULES`) daxilindədir.
4. **I-4 · Saf SVG & DOM:** Xəritə elementləri sorğulana bilən DOM və SVG elementləridir (`data-region`, `data-owner`, `data-troops`).
5. **I-5 · Core Saf, UI Axmaqdır:** Bütün oyun qaydaları və hesablamalar `core`-dadır (`rules.ts`, `game.ts`). `ui/` heç bir oyun məntiqi saxlamır və `core` heç vaxt `ui`, `ai` və ya `sim`-dən import etmir.

---

## 3. Əsas Əmrlər

```bash
npm run typecheck                # tsc --noEmit (0 xəta)
npm test                         # vitest run (bütün testlər yaşıl)
npm run sim -- --games 200       # Balans və sürət hesabatı
npm run sweep                    # RULES + BOT_CONFIG şəbəkəsi üzrə balans sweep-i
npm run build                    # Production build
```

---

## 4. Açıq Memarlıq Qərarı (2026-08-31)

> Bu bölmə invariantları **dəyişmir** — qərar hələ verilməyib. Amma kodda dəyişiklik edən hər kəs
> bundan xəbərdar olmalıdır.

**Faza S — simultaneous raund modeli** qiymətləndirilir: ardıcıl növbələr əvəzinə bütün oyunçular
eyni raunda əmr verir, əmrlər birgə həll olunur.

Qəbul edilərsə **I-2-yə düzəliş** lazım olacaq: `applyAction(g, action)` yerində qalır, amma raund
səviyyəsində ikinci giriş nöqtəsi əlavə olunur — `resolveRound(g, orders)`. Tək giriş nöqtəsi
prinsipi pozulmur, sadəcə iki səviyyəyə bölünür (tək əmr / raund).

Qərar qapısı, ölçmələr və adjudication halları: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) → Faza S.
Balans rəqəmləri: [BALANCE.md](BALANCE.md).

**Nəticələnənə qədər:** `core`-da növbə məntiqinə struktur dəyişiklik etmə. Faza 4 (juice),
7 (mobil möhkəmlik) və 8 (layout) hər iki modeldə eyni işlədiyi üçün təhlükəsizdir.
