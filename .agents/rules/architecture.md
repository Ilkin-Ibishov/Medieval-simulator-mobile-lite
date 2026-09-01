# Arxitektura Qaydaları və İnvariantlar (Mobile Lite)

> **HƏQİQƏTİN MƏNBƏYİ:** `src/core/types.ts` və `AGENTS.md`

## 1. Modul Sərhədləri
```
src/
├── core/   # Saf TypeScript. Sıfır DOM, sıfır React, sıfır I/O, sıfır Date.now(), sıfır Math.random().
├── ai/     # Zero-cheating scoring bot. İstehkamlar, duman kəşfiyyatı və cəbhə taktikası.
├── sim/    # Headless balans hesabatı, sweep və müqayisə testləri.
└── ui/     # React + SVG. Hardware-accelerated GPU layout containment. Yalnız vizual təbəqə.
```

## 2. Asılılıq Qaydası (Birtərəfli)
* `core` **heç vaxt** `ui`, `ai` və ya `sim`-dən import etmir.
* `ui` və `sim` yalnız `core/index.ts` barrel-i vasitəsilə daxil olur.

## 3. Data Flow və İnvariantlar
1. **Tək Giriş Nöqtəsi (I-2):** Bütün mutasiyalar yalnız `applyAction(g, action)` və ya simultan `resolveRound(g, orders)` vasitəsilə baş verir.
2. **Sabitlərin Tək Mənbəyi (I-3):** Bütün balans rəqəmləri yalnız `src/core/types.ts` (`RULES`) daxilindədir.
3. **Determinizm (I-1):** Təsadüfilik yalnız inyeksiya edilən `Rng` (mulberry32) vasitəsilə təmin edilir.
