# Medieval Sim Mobile Lite — Agent Təlimatı və Konteksti

> **HƏQİQƏTİN MƏNBƏYİ:** Bu fayl və `src/core/types.ts`

Bu layihə **Medieval Simulator**-un ultra-yüngül, sürətli, Antiyoy / Age of Conquest tərzində mobil üçün optimallaşdırılmış versiyasıdır.

---

## 1. Layihənin Mahiyyəti

* **Janr:** Mobil Turn-based Əyalət Strategiyası (Lite / Grand Conquest). Offline, tək oyunçu (və gələcək Liderlik/PvP), mobil-first (Capacitor → Android APK / Google Play).
* **Əsas Döngü:** Əyalət gəliri (Qızıl) → Qoşun maaşı (Upkeep) → Döyüş və Sürətli Genişlənmə → 5–15 dəqiqəlik bitən partiyalar.
* **Xəritələr:**
  1. **👑 Böyük Dozia Kampaniyası (Nativ Atlas):** 117 sıfır-drift əyalət, 10 tarixi krallıq, dinamik üzən dövlət adları, təmizlənmiş daxili tikişlər və ada dəniz yolları.
  2. **⚡ Sürətli Təsadüfi Oyun (Prosedural Voronoi):** 16–28 region, sürətli vizual toxunuş və axıcı 60fps animasiyalar.
* **Canlı İctimai Link:** [https://medieval-sim-lite.vercel.app](https://medieval-sim-lite.vercel.app)
* **GitHub Repozitoriyası:** [https://github.com/Ilkin-Ibishov/Medieval-simulator-mobile-lite](https://github.com/Ilkin-Ibishov/Medieval-simulator-mobile-lite)

---

## 2. Beş Pozulmaz İnvariant (Non-Negotiable Invariants)

1. **I-1 · Determinizm:** `src/core/` daxilində `Math.random()`, `Date.now()`, `new Date()`, `setTimeout` **tamamilə qadağandır**. Təsadüfilik yalnız inyeksiya edilən `Rng` (mulberry32) vasitəsilə təmin edilir. Eyni seed = eyni partiya.
2. **I-2 · `applyAction` Tək Giriş Nöqtəsidir:** UI, AI bot və simulyator vəziyyəti (state) **yalnız** `applyAction(g, action)` və ya simultaneous rejimdə `resolveRound(g, orders)` vasitəsilə dəyişir.
3. **I-3 · Balans Sabitlərinin Tək Mənbəyi:** Bütün rəqəmlər yalnız `src/core/types.ts` (`RULES`) daxilindədir.
4. **I-4 · Saf SVG & DOM:** Xəritə elementləri sorğulana bilən DOM və SVG elementləridir (`data-region`, `data-owner`, `data-troops`, `data-visibility`).
5. **I-5 · Core Saf, UI Axmaqdır:** Bütün oyun qaydaları və hesablamalar `core`-dadır (`rules.ts`, `game.ts`). `ui/` heç bir oyun məntiqi saxlamır və `core` heç vaxt `ui`, `ai` və ya `sim`-dən import etmir.

---

## 3. Əsas Sistemlər və Qaydalar

### A. Taktiki İstehkamlar (Fortifications System)
* **`BUILD` Action:** `{ type: 'BUILD', regionId: number, building: 'NONE' | 'WATCHTOWER' | 'FORT' }`.
* **🗼 Müşahidə Qülləsi (Watchtower · 15G):** Fog of War-da görmə məsafəsini **2-hop dərinliyinə** qaldırır (qonşuların qonşularını da kəşf edir).
* **🏰 Qala (Fortress · 25G):** Həmin ərazidə müdafiə olunan qoşunlara **`+RULES.fortDefenseBonus` (+2)** döyüş gücü verir. `previewCombat` və simultan `resolveRound` tərəfindən dəstəklənir.
* **Dağılma:** Əyalət düşmən tərəfindən fəth edildikdə mövcud istehkam dağıdılır (`reg.building = undefined`).

### B. Duman və Kəşfiyyat (Fog of War)
* 3 səviyyəli görünüş:
  * `VISIBLE`: Birbaşa oyunçuya məxsus ərazi.
  * `BORDER`: Oyunçunun ərazilərinə və ya Müşahidə Qülləsinə qonşu ərazi (canlı kəşfiyyat).
  * `FOGGED`: Dərin kəşf edilməmiş ərazi (qoşun sayı və hərəkətlər gizlədilir, DOM təmiz saxlanılır).

### C. Master Dəniz Atlası və Kartoqrafiya
* **Dərin Prussiya Dənizi:** Radial gradient (`#141f2b` $\rightarrow$ `#0f1721` $\rightarrow$ `#080c10`) və Portolan koordinat naviqasiya toru.
* **Sahil Qabarması (Coastal Waterlines):** İkiqat su zolağı halo qatı (`#1e3448` & `#325370`).
* **Dinamik Dövlət Başlıqları:** Xəritə sahə payına görə nisbi font miqyası ($\text{Ratio} = \frac{N_{\text{owned}}}{N_{\text{total}}}$) və BFS Largest Connected Cluster Centroid yerləşməsi.
* **Mobil Smart Auto-Focus:** Oyuna başladıqda kameranın avtomatik oyunçunun krallığına fokuslanması (`zoom: 1.45`), `👑 Krallığım` və `🌍 Bütün Xəritə` sürətli kamera keçid çipləri.

---

## 4. Əsas Əmrlər

```bash
npm run typecheck                # tsc --noEmit (0 xəta)
npm test                         # vitest run (bütün 35 test yaşıl)
npm run sim -- --games 200       # Balans və sürət hesabatı
npm run sweep                    # RULES + BOT_CONFIG şəbəkəsi üzrə balans sweep-i
npm run build                    # Production build
npx cap sync android             # Android aktivlərini sinxronlaşdır
npx vercel --prod --yes          # Canlı production deploy
```
