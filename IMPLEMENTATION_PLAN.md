# Implementation Plan — Medieval Sim Mobile Lite

> Mənbə: 2026-08-31 tam audit (kod + `npm test` + `npm run sim` + real 375×812 telefon viewport-unda oynanış və DOM ölçmələri).
> Bu fayl iş boyunca **canlı sənəddir** — hər faza bitdikcə statusu yenilənir.

## Status

| Faza | Ad | Status |
|---|---|---|
| 0 | Ölçmə bazası | ✅ Bitdi |
| 1 | Kamera (BLOKER) | ✅ Bitdi — 24/24 region görünür |
| 2 | İlk oynanış yoxlaması (istifadəçi) | ⏭️ Keçildi (istifadəçi qərarı) |
| 3 | Balans + oturacaq ədaləti | ✅ **Tam düzəldildi** — tie-break kök səbəbi tapıldı |
| 4 | Juice: səs və animasiya | ✅ Bitdi |
| **S-a** | **Simultaneous — core + ölçmə** | ✅ **Bitdi. Verdikt: ADOPT** |
| **M** | **Xəritə keçidləri (chokepoint)** | ✅ **Bitdi** — `maxNeighbors=3` aktiv, 54.4% fəth, 2.8 pp spread |
| **L** | **Lobby region seçimi qüsuru** | ✅ **Bitdi** — 16/24/28 miqyaslandı (hər ölçüdə fəth ≥46%) |
| **S-b** | **Simultaneous — UI prototipi** | ✅ **Bitdi** — Əmr növbəsi, oxlar, simultaneous həll və animasiya |
| **G** | **4-oyunçu seat-ID qərəzi** | ✅ **HƏLL OLUNDU** — `round.ts` tie-break səbəbi aradan qaldırıldı (spread 2.8 pp) |
| 5 | Xəritəyə strateji məna (terrain/gəlir) | ⬜ Gözləyir |
| 6 | Döyüşə variasiya | 🕐 **Buzda** |
| 7 | Mobil möhkəmlik (Buraxılış Hazırlığı) | ✅ **Bitdi (Offline fontlar, back button dialog, capacitor sync)** |
| 8 | Layout və performans | ✅ **Bitdi (rAF gesture batching, live leaderboard)** |
| 9 | AI şəxsiyyətləri | ✅ **Bitdi** — Palitra və bot davranışlarına inteqrasiya olundu |
| ~~L2/L3~~ | ~~Simultaneity-ni bilən bot~~ | ❌ **L3 KILL** · L2 defer |

---

## 🔴🔴🔴 KRİTİK DÜZƏLİŞ (üçüncü ölçmə səhvi) — "oturacaq fərqi < 6" heç vaxt keçilməyib

İstifadəçinin sualı — *"çox güman ki ölçmələrin yanlış formula ilə ölçür"* — dəqiq nişan aldı.

**`oturacaq fərqi` metriki (max qazanma% − min qazanma%) N=500-də sabitləşmir.**
Digər bütün metriklər (fəth%, turn, churn) N=200-də artıq sabitdir — yalnız bu, ekstremum
statistikası olduğu üçün N=3000-ə qədər yığılmır:

```
N=500   → 5.6 bənd   ← Faza S qərar qapısında istifadə olunan, "hədd keçildi" deyilən rəqəm
N=2000  → 9.1 bənd
N=3000  → 9.2 bənd   ← sabitləşən doğru rəqəm
```

**Doğru baza: ~9.2 bənd.** Faza 3 və Faza S-dəki "< 6 hədd keçildi" elanları etibarsızdır.
Tam təhlil, yeni tapıntılar (2-oyunçu 63/37 qərəzi, 4-oyunçu naməlum mənbəli qərəz) və
Faza M-in niyə dayandırıldığı: [BALANCE.md](BALANCE.md) → "KRİTİK DÜZƏLİŞ" bölmələri.

**Xoş xəbər:** paytaxt ədaləti düzəlişinin özü (paytaxt dəstini bütöv seçmək + indeksə görə
sıralamaq) böyük N-də təkrar yoxlanıldı və **hələ də işləyir** — sadəcə qalan fərq öncə
deyildiyindən daha böyükdür (24.8 → ~9, 6 yox).

---

## ⚠️ Ən dərin tapıntı — oyunda sıfır qeyri-müəyyənlik var

Bütün sessiya boyu qurmadığım bir metrik nəhayət quruldu: **dəf edilmiş hücum nisbəti.**

| Model | Fəth edən hücum / partiya | Dəf edilmiş | Dəf nisbəti |
|---|---|---|---|
| Ardıcıl (hazırkı) | 41.9 | **0.0** | **0%** |
| Simultaneous | 40.1 | 5.1 | **11.3%** |

400 partiyada, ~17 min hücumda, ardıcıl modeldə **bir dənə də hücum uğursuz olmayıb.**

Səbəb zənciri: döyüş determinist → `previewCombat` nəticəni dəqiq verir → bot yalnız qalib
gələcəyi hücumu edir → insan da eyni proqnozu görür → **müdafiə heç vaxt uğur qazanmır.**

Nəticə: istifadəçinin ilk gündən istədiyi *"haranı müdafiə etmək"* qərarı bu dizaynda struktur
olaraq mövcud ola bilməz. Qarnizon yalnız **həddi** müəyyən edir, heç vaxt **döyüş nəticəsi** olmur.

### Həssaslıq təhlili — tapıntı botdan asılı deyil

`borderGarrison` 2..6 aralığında, 300 partiya × 10 konfiqurasiya:

| botGarrison | Ardıcıl dəf% | Simultaneous dəf% |
|---|---|---|
| 2 | **0.0** | 14.1% |
| 3 | **0.0** | 12.7% |
| 4 | **0.0** | 11.1% |
| 5 | **0.0** | 6.9% |
| 6 | **0.0** | 6.1% |

Ardıcıl model uğursuz hücum istehsal etməyə **struktur olaraq qadir deyil**.
Simultaneous heç bir konfiqurasiyada sıfır vermir.

⚠️ Diqqət: bot nə qədər ehtiyatlıdırsa, gərginlik o qədər azalır (14.1% → 6.1%).
Yəni "botu simultaneity üçün düşündürmək" gərginliyi **azalda** bilər — bax aşağıda L1/L2/L3.

---

## ⚠️ İki ölçmə səhvim (düzəldildi / geri götürüldü)

**Səhv 1 — təsnifat proksi ilə edilirdi.** `engine.ts` partiyanı `game.turn <= maxTurns` olduqda
"fəth" sayırdı. Bu, əsl bitmə şərti deyil, proksidir — və iki modeldə fərqli davranır:
`round.ts:257` `turn++` qalib yoxlamasından əvvəl gəlir, ona görə son raundda bitən fəth taymer
həlli kimi yazılırdı. Bütün əvvəlki müqayisələr simultaneous əleyhinə əyilmişdi.
**Düzəldildi** — indi sağ qalan oyunçu sayı ilə təsnif olunur. Təsir: +3 bənd simultaneous xeyrinə.

**Səhv 2 — `averageArmyLocked` (98%) metriki GERİ GÖTÜRÜLÜR.** Artefaktdır: 24 region, 4 oyunçu
və ~4.6 əlaqəlilik ilə bir regionun "daxili" olması praktiki olaraq mümkün deyil, ona görə metrik
konstruksiyaya görə ~100%-dir. Sübut: əlaqəliliyi 4.56 → 2.87 saldım, metrik yalnız 98% → 95% oldu.
Oyun dinamikasını yox, qraf həndəsəsini ölçür.

---

## Baseline (dəyişikliklərdən ƏVVƏL ölçülüb)

```
Erkən fəthlə bitən partiyalar:   1%        (300 partiya simulyasiyası)
Orta partiya uzunluğu:           60.9 turn
Liderin son ərazi payı:          58.1%
Eliminasiya / partiya:           0.38 / 3 mümkün
Sahiblik dəyişməsi / partiya:    501       (24 region → fəthlərin ~95%-i geri alınır)
Tam görünən region:              6 / 24    (375×812 viewport)
Xəritənin görünməyən hissəsi:    hər tərəfdən 408px (render eni 1191px, viewport 375px)
Maksimum pan çatımı:             56 CSS px → ~350px hər tərəfdə ƏBƏDİ əlçatmaz
```

---

## Ardıcıllıq prinsipi

Ardıcıllıq təsadüfi deyil: hər faza özündən sonrakının **qiymətləndirilməsini mümkün edir**.
Faza 1 bitmədən mexanika barədə qərar vermək mənasızdır, çünki lövhənin 75%-i görünmür.

**2026-08-31 əlavəsi:** Faza S (simultaneous raund) Faza 6-dan (döyüş variasiyası) əvvəl gəlməlidir.
Onlar naməlumluğun iki fərqli mənbəyidir və **bir-birini əvəzləyir**. Əvvəl Faza 6 tikilsə və sonra
Faza S qəbul edilsə, işin bir hissəsi geri alınmalı olacaq.

---

## Faza 0 — Ölçmə bazası

1. `src/sim/run.ts`-ə iki daimi metrik: `ownershipFlipsPerGame` (churn) və `avgLeaderShare`.
   Audit üçün ayrıca probe yazılmışdı — daimi alətə çevrilməlidir, çünki bütün mexanika qərarları bu rəqəmə baxacaq.
2. `npm run sim -- --games 300` → baseline `BALANCE.md`-yə yazılır.

**Risk:** yoxdur. Heç bir davranış dəyişmir.

---

## Faza 1 — Kamera (BLOKER)

Bu bitmədən heç nəyə keçilmir.

### 1.1 Transform-u işlək hala gətir — `src/ui/MapView.tsx`

**⚠️ İlkin diaqnoz yarımçıq idi.** Auditdə səbəb "SVG atributu vs CSS property" kimi göstərilmişdi.
İcra zamanı brauzerdə izolyasiya edildi: **əsl səbəb `transition: transform`-un özüdür.**

Sübut (eyni elementdə, ardıcıl ölçmə):

| Vəziyyət | style atributu | computed transform |
|---|---|---|
| `transition` var | `scale(1.8)` | `matrix(1,0,0,1,0,0)` ← tətbiq olunmur |
| `transition` silindi | `scale(1.8)` | `matrix(1.8,0,0,1.8,0,0)` ← işləyir |

SVG elementinin `transform`-una qoyulan CSS transition computed dəyəri əbədi identity matrisdə saxlayır.
Yəni `MapView.tsx`-dəki ~180 sətir pinch/pan/wheel məntiqi sıfır vizual effekt verirdi.

**Edilən:** `transition` tamamilə silindi, transform CSS property kimi (px vahidləri ilə) yazılır.
Hamar zoom easing sonra `zoom` dəyərinin JS tween-i ilə qaytarıla bilər (Faza 4 juice).

### 1.2 Xəritə nisbətini portretə çevir — `src/core/mapgen.ts`

Default `1600×900` → **`1000×1700`** (əvvəlcə 1000×1500 seçildi, sonra ölçmə ilə
1000×1700-ə dəqiqləşdirildi: telefonun oyun sahəsi nisbətinə daha yaxındır, letterbox 59px→21px).

**Bu seçim deyil, məcburiyyətdir:** yalnız `slice`→`meet` etsək, 16:9 xəritə 375px telefonda
`375×211px` render olunur — hamısı görünür, amma oxunmur. Portret viewBox ilə `375×638px` alınır.

*Yan təsir:* hər seed üçün xəritə forması dəyişir. Testlər keçir (onlar eyni seed-in öz-özünə
uyğunluğunu yoxlayır, konkret formanı yox).

### 1.3 `slice` → `meet` — `src/ui/MapView.tsx:296`

### 1.4 `clampPan`-ı düzəlt — `src/ui/MapView.tsx:41-54`

İndi SVG user unit-lərini CSS piksellərlə müqayisə edir (vahid qarışığı → pan barmaqdan 0.744× yavaş).
Real content bounds-dan hesablanacaq: istənilən regiona çatmaq mümkün, xəritəni tam itirmək mümkün deyil.

**HƏDD:** 375×812 viewport-da tam görünən region **24/24** (indi 6/24).

**Risk:** orta — `transform-origin` + `meet` kombinasiyasında pinch focal point hesabı yenidən yoxlanmalıdır.

### ✅ Faza 1 nəticəsi (brauzerdə ölçülüb, 375×812)

| Metrik | Əvvəl | İndi |
|---|---|---|
| Tam görünən region | 6 / 24 | **24 / 24** |
| Xəritənin ekrandan kənarı | hər tərəfdən 408px | 0 |
| Zoom düyməsi | heç bir effekt | 1.0 → 4.0 işləyir |
| Ardıcıl 3 zoom klik | — | 1.0 → 2.2 → 2.6 (yığılır) |
| Pan / barmaq nisbəti | 0.744× (yavaş) | **1.00×** |
| Clamp | 56px, xəritənin 60%-i əlçatmaz | hər künc əlçatan, xəritə ekrandan çıxmır |

Əlavə düzəlişlər (Faza 8-dən irəli çəkildi, çünki işlək kamera üçün zəruri idi):

- Touch listener `useEffect` dependency `[pan, zoom]` → `[]` + latest-value ref-lər.
  Əvvəl hər `touchmove` kadrında 4 listener silinib yenidən əlavə olunurdu.
- Zoom düymələri funksional formaya keçdi — sürətli ardıcıl kliklər artıq köhnə dəyəri oxumur.
- Focal-point zoom hesabı konteyner **mərkəzindən** ölçülür (transform origin xəritə mərkəzidir),
  əvvəl sol-yuxarı küncdən ölçülürdü → pinch yanlış nöqtəyə zoom edirdi.
- `onWheel`-dən `preventDefault()` silindi (React wheel-i passive bağlayır, onsuz da işləmirdi).

**Balans yoxlaması:** xəritə həndəsəsi dəyişdi, mexanika göstəriciləri praktiki olaraq eyni qaldı
(fəth 1%→0%, churn 501→498, orta turn 60.9). Bu, dayanıqlığın xəritə formasından yox,
**mexanikadan** gəldiyini təsdiqləyir → Faza 3 diaqnozu qüvvədə qalır.

---

## Faza 2 — İlk oynanış yoxlaması (İSTİFADƏÇİ)

İstifadəçi 3-5 partiya oynayır. Mən heç nə etmirəm.

**Səbəb:** indiyə qədər oynanan hər partiya lövhənin dörddə biri ilə olub.
Tam xəritədən sonra Faza 3-ün prioritetləri dəyişə bilər.

---

## Faza 3 — Qüvvə cəmləmə problemi

Partiyaların 99%-i taymerlə bitir, çünki bir hücumun maksimum gücü = **bir regionun qarnizonu**.
Kök səbəb: `game.ts:206` — dost əraziyə köçən qoşun `exhaustedTroops`-a əlavə olunur.
`defenderAdvantageRatio: 1.15` + bütün regionlarda eyni gəlir (12G) → cəbhələr riyazi olaraq salınır.

### ⚠️ Vacib düzəliş

Auditdə "reinforcement `exhausted` etməsin" deyilmişdi. Testlər oxunandan sonra aydın oldu ki,
`game.test.ts:166` ("prevents troops from marching multiple times in the same turn") məhz bunu qoruyur —
yəni bu, təsadüfi qalıq DEYİL, **qəsdən qoyulmuş qayda**.

### 3.1 Sim hakim olsun

`RULES`-a müvəqqəti flag, hər iki mexanizm simulyasiyada müqayisə olunur:

- **Variant A:** dost əraziyə köçmə `exhausted` etmir (zəncirvari hərəkət → mövcud qaydanı pozur)
- **Variant B:** *çoxmənbəli hücum* — eyni turn-də bir neçə qonşudan eyni hədəfə hücum tək birləşmiş
  döyüşdə həll olunur (hər əsgər hələ də turn-də bir dəfə hərəkət edir → **mövcud qayda qorunur**)

Gözlənti: B daha yaxşıdır, çünki `core`-un öz invariantını pozmur. Amma iddia yox, ölçü.

### 3.2 Qalibi təmizə köçür

Flag silinir, `game.test.ts`-ə yeni davranış üçün test əlavə olunur.

**HƏDD:** `npm run sim -- --games 300` →

- Erkən fəth **≥ 40%** (indi 1%)
- Orta turn **≤ 35** (indi 60.9)
- Churn **< 120** (indi 501)

Heç bir variant həddi keçmirsə → diaqnoz səhvdir, dayan və istifadəçiyə bildir.
Sonra `defenderAdvantageRatio` / `regionBaseIncome` istiqamətinə bax — amma yalnız ölçü diaqnozu yanlış çıxarandan sonra.

**Risk:** yüksək. Oyunun mərkəzi mexanikası. Ən azı bir test yenidən yazılacaq.

---

### ✅ Faza 3 nəticəsi — diaqnoz kökündən dəyişdi

**Planda yazılan hər iki hipotez ölçmə ilə təkzib olundu.** 16 kombinasiyalıq döyüş-parametr
sweep-i churn-u 458–488 aralığından çıxara bilmədi — yəni problem döyüş riyaziyyatında deyildi.

İnstrumentləşdirmə göstərdi ki, hücumların **92%-i 0 qoşunlu regiona qarşıdır** və 85%-i öz
mənbə regionunu boşaldır. Bot bütün qarnizonu irəli sürüb arxada pulsuz torpaq qoyurdu.
**Problem `ai/bot.ts`-də idi, `core`-da yox** — yəni nə bir invariant, nə bir test dəyişdirilmədi.

| Metrik | Əvvəl | İndi | Hədəf |
|---|---|---|---|
| Fəthlə bitmə | 1% | **56%** | ≥40% ✅ |
| Orta uzunluq | 60.9 | **34.5** | ≤35 ✅ |
| Churn | 501 | **40.6** | <120 ✅ |
| Eliminasiya | 0.36/3 | **1.95/3** | — |

Yeni alət: `npm run sweep` — RULES + BOT_CONFIG şəbəkəsi üzrə simulyasiya qaçırır.
`src/sim/engine.ts` (saf məntiq) `run.ts`-dən (CLI) ayrıldı ki, sweep import edə bilsin.

**Açıq problem:** növbə sırası üstünlüyü (34/33/21/12%). Üç hipotez yoxlanıb təkzib olundu —
detallar `BALANCE.md`-də. Təcililik aşağı, çünki insan həmişə seat 0-dır; PvP-də əhəmiyyət kəsb edəcək.

---

## Faza 4 — Juice: səs və animasiya

### 4.1 Səsi niyyətdən nəticəyə köçür — `App.tsx`, `ActionHUD.tsx:78-82`

Səslər `ActionHUD`-dan çıxıb `handleApplyAction`-a keçir, `nextState.events`-in son elementinə görə seçilir:

- `CONQUEST` → **`playConquest()`** ← bu funksiya yazılıb, kod bazasında **heç yerdən çağırılmır**
- `BATTLE` (dəf edildi) → clash + alçalan məğlubiyyət tonu
- `BANKRUPTCY`, `ELIMINATION` → yeni səslər (hadisələr `core`-da var, səsləri yoxdur)

**Hazırkı qüsur:** `playBattleClash()` `applyAction`-dan ƏVVƏL çalınır → qalib və məğlub hücum
eyni səslənir, fəth səssizdir.

### 4.2 Səs mühərriki gigiyenası — `sound.ts`

- Master `GainNode` (qlobal səviyyə + düzgün mute)
- `enabled=false` → `AudioContext.suspend()`
- ±3% təsadüfi detune, clash üçün qısa noise burst
- Səs/haptika ayarı `localStorage`-a
- Lobby-yə **haptika toggle-ı** (indi yalnız səs var, `haptics.enabled` heç vaxt dəyişmir)

### 4.3 AI növbəsini görünən et — `App.tsx`

Hazırda botun bütün turn-u tək `setTimeout(200ms)` içində tətbiq olunur — nə ox, nə animasiya, nə səs.
Action-lar 250-300ms addımlarla növbə ilə tətbiq olunacaq. `computeBotActions` artıq massiv qaytarır.

### 4.4 Döyüş animasiyası — `MapView.tsx`

- Qoşun sayı üçün count-up tween (200ms) — indi ani dəyişir
- İtkilər üçün qırmızı float-up rəqəm (`-3`)
- Hücum oxu boyunca sürüşən marker

Hamısı `ui/` daxilində, `core` toxunulmur (I-5).

---

### ✅ Faza 4 nəticəsi (brauzerdə ölçülüb)

**4.1 — səs niyyətdən nəticəyə köçdü.** `App.applyWithFeedback()` `applyAction`-un qaytardığı yeni
`events`-i oxuyur və ona görə səs seçir. `ActionHUD` artıq döyüş səsi çalmır (düymə basılanda
nəticə hələ məlum deyil). `playConquest()` nəhayət çağırılır. Yeni səslər: `playRepelled`,
`playBankruptcy`, `playElimination`, `playDisband`.

**4.2 — səs mühərriki gigiyenası.** Master `GainNode`, `setEnabled()` → `AudioContext.suspend()`,
hər səsdə ±8 cent jitter, clash üçün bandpass noise burst. Yeni `ui/settings.ts` — səs və
**titrəyiş** ayarı `localStorage`-a yazılır (əvvəl titrəyiş toggle-ı ümumiyyətlə yox idi).

**4.3 — AI növbəsi görünən oldu.** Bot əmrləri bir-bir tətbiq olunur, hər biri öz oxunu çəkir.
Brauzerdə ölçüldü: 3.4 saniyədə **7 fərqli lövhə vəziyyəti** (əvvəl hamısı tək kadrda idi),
34 kadrın 28-ində ox, 16-sında fəth pulse-u.

⚠️ **Bu, yeni risk yaratdı və ölçüldü.** 100 partiya üzrə bir bot növbəsindəki MOVE sayı:
median **0**, p90 **2**, p99 **4**, maks **10**. Sabit 320ms-də ən pis hal AI raundunu ~9.6 saniyə
dondurardı. Ona görə növbə başına vaxt büdcəsi qoyuldu (`AI_TURN_BUDGET_MS = 1600`):
az hərəkətli növbə oxunaqlı 320ms, sıx növbə sıxılır. Faktiki ölçülən orta AI raundu: **2.2s**.

**4.4 — döyüş animasiyası.** Qoşun sayları rAF ilə 260ms tween olunur (ani dəyişmir),
itkilər regionun üstündən qırmızı uçan rəqəm kimi çıxır. 260 kadr nümunəsində floater 64,
pulse 70, ox 114 kadrda göründü.

**Yol boyu tapılan qüsur:** Lobby-də iki toggle eyni tick-də basılanda biri itirdi
(stale closure — zoom düymələrindəki eyni səhv). Funksional `setState` ilə düzəldildi,
brauzerdə təsdiqləndi (hər ikisi çevrilir, reload-dan sonra qalır).

**Balansa təsir yoxdur:** sim 58% / 34.3 turn / 40.3 churn — dəyişməz.

---

## Faza S — Simultaneous raund prototipi (QƏRAR QAPISI)

> Mənşə: istifadəçi təklifi, 2026-08-31. Ardıcıl növbələr əvəzinə bütün oyunçular eyni raunda
> əmr verir, əmrlər birgə həll olunur. Faza 6-dan ƏVVƏL qərar verilməlidir.

### ✅ Ölçmə mərhələsi bitdi — və nəticə əsası dəyişdi

**Görülən iş:**
- `src/core/round.ts` — `resolveRound(state, orders)`, ardıcıl yolun YANINDA, əvəzinə deyil
- `src/core/__tests__/round.test.ts` — 7 test, dördü məhz adjudication halları üçün.
  Ən vacibi: tək hücumçu halında **dəqiq `previewCombat`-a bərabərdir**, yəni tanış 1v1
  riyaziyyatı dəyişmir və döyüş preview-u dürüst qalır
- `src/sim/engine.ts` — `model: 'sequential' | 'simultaneous'`; bot dəyişmədən işlədilir
- `npm run compare` — hər iki modeli eyni seed-lərlə qaçırıb hədləri yoxlayır

**Adjudication qaydaları (planda açıq olan 4 hal, qərar verildi):**

| Qayda | Qərar |
|---|---|
| R1 | Yola düşmə gəlişdən əvvəl. Qarnizonu yürüşə çıxan əyalət BOŞ olur; yan-yana keçən iki ordu yerlərini dəyişir. Hücum arxaya real risk yaradır |
| R2 | Eyni oyunçunun bir hədəfə göndərdiyi kolonlar döyüşdən ƏVVƏL birləşir — qüvvə cəmləmək nəhayət mümkündür |
| R3 | Sahibin öz gəlişləri qarnizonu gücləndirir |
| R4 | Ən güclü qüvvə əyaləti alır. Tək hücumçu halında bu, mövcud düsturun dəqiq eynisidir |

Hire hərəkətdən əvvəl həll olunur (yeni qoşun müdafiə edir), amma MOVE raund başlanğıcı
qoşununa görə yoxlanılır (yeni yığılan yürüş edə bilmir — mövcud qayda qorunur).

### ⚠️ Ən vacib tapıntı: mənim əsas arqumentim çöküb

Faza S üçün irəli sürdüyüm **ölçülə bilən** əsas oturacaq ədalətsizliyini (34/33/21/12) həll
etməsi idi. Ölçdüm: **simultaneous onu düzəltmir** (21.6 → 23.2 bənd).

Həlledici təcrübə göstərdi ki, skew **torpağın** ardınca gedir, oturacağın yox — seat 0 başqasının
başlanğıc torpağını alanda 33%-dən 11%-ə düşür. Səbəb `createGame`-in acgöz paytaxt yerləşdirməsi
idi və **hər iki modelə aiddir**. Düzəldildi (detallar `BALANCE.md`):

```
oturacaq fərqi:  24.8  →  6.4 bənd (ardıcıl)  ·  4.8 bənd (simultaneous)
```

**Nəticə:** ardıcıl model də indi 3/3 hədddən keçir və fəth (49% vs 42%) ilə sürət (36.1 vs 37.5)
üzrə bir qədər daha yaxşıdır. Simultaneous-un ölçülə bilən üstünlüyü qalmadı.

Qalan yeganə arqument **istifadəçinin öz arqumentidir** — "5 göndərim, yoxsa 8?" qərarının hissi.
O arqument bu tapıntıdan zərər görmür; zərər görən mənim əlavə etdiyim ədalət arqumentimdir.
Cavabı yalnız oynanıla bilən UI prototipi verir (4-cü hədd).

**Qalan iş (UI):** əmrləri dərhal tətbiq etmək əvəzinə növbəyə yığmaq, gözləyən əmrləri xəritədə
ox kimi göstərmək, "Növbəni Bitir" = təsdiqlə. Bu, oyunun qarşılıqlı təsir modelini dəyişdiyi üçün
istifadəçi qərarı gözlənilir.

---

### Niyə qəbul edildi

İlkin qiymətləndirməm mənfi idi. **İki səhvim düzəldildi:**

**Səhv 1 — "botlara qarşı heç nə vermir".** Yanlış. Fərq gizlilikdə deyil, öhdəlik toqquşmasındadır:
indi `previewCombat` sənə öz hərəkətinin nəticəsini **qaranti** verir. Simultaneous-da vermir —
rəqib (bot olsa belə) eyni hədəfə əmr verə bilər. Bu, rəqibin insan olub-olmamasından asılı deyil.

**Səhv 2 — xərc şişirdilib.** "34 istinad, 9 fayl" demişdim. `core`-da cəmi **6 istinad** var,
4-ü trivialdır (başlanğıc dəyər, clone, növbə keçidi). Qalanı UI-da "kimin növbəsidir" yazısıdır.
Üstəlik **bot artıq `Action[]` qaytarır** — simultaneous həllin tələb etdiyi formatdır.

### Ölçmə: ssenari nə qədər tez-tez yaranır

200 partiya, 6255 raund:

```
raund başına 2+ oyunçunun çata bildiyi region:   7.14 / 24   (~30% xəritənin)
  ...onlardan zəif müdafiəli (<=2 qoşun):        0.79
ən azı 1 mübahisəli region olan raundlar:        94%
mərhələ üzrə:  erkən(1-10) 6.85 · orta(11-25) 7.43 · gec(26+) 6.96
```

Fərz edirdim ki, bu açılış hadisəsidir (neytral torpaq yarışı). **Deyil — bütün partiya boyu sabitdir.**
Hər raund ~7 əyalətin taleyi hazırda növbə sırası ilə həll olunur; simultaneous-da əsl qərara çevrilir.

### Niyə Faza 6-nı əvəzləyir

| | Faza 6 — döyüş variasiyası | Faza S — toqquşan öhdəlik |
|---|---|---|
| Naməlumluğun mənbəyi | ±20% zər | rəqibin niyyəti |
| Oxuna bilirmi? | xeyr — səs-küy | **bəli** — qoşun sayları görünür, rəqib modelləşdirilə bilir |
| Məharət ifadəsi | azalır | **artır** |
| Uduzanda hiss | "bəxtim gətirmədi" | "səhv hesabladım" |

İkisini birlikdə tətbiq etmək həddindən artıq naməlumluqdur. Ona görə Faza 6 dondurulur.

### Taymer qərarı

| Rejim | Taymer |
|---|---|
| Multiplayer | **Məcburi** — növbəti oyunçunu gözlətməmək üçün |
| Tək oyunçu | **Yoxdur.** Yalnız Lobby-də opsional ayar (çətinlik/zövq seçimi) |

Bu, mobil pauza-edilməzlik narahatlığını tam bağlayır (bax Faza 7.1 — "gələn zəng partiyanı öldürməsin").

### Bir həll modeli, iki deyil

SP və MP üçün ayrı modellər `core`-u ikiqat mürəkkəbləşdirər və balansı iki dəfə qurmaq tələb edərdi.
**Seçim: hər yerdə simultaneous.** Tək oyunçuda AI dərhal əmr verdiyi üçün həll anidir, taymer sadəcə söndürülür.
Yan fayda: oturacaq ədalətsizliyi (34/33/21/12) konstruktiv olaraq yox olur.

### İş siyahısı (`simultaneous` branch-ında)

1. `resolveRound(state, orders)` — `core`-da. `applyAction` yerində qalır (I-2 pozulmur, raund
   səviyyəsində yeni giriş nöqtəsi əlavə olunur)
2. **Adjudication qaydaları** — əsl iş buradadır, hər biri üçün qərar lazımdır:

   | Vəziyyət | Sual |
   |---|---|
   | X → A, eyni vaxtda A-nın qarnizonu → X-in B-sinə | Ordular yan-yana keçir? Hər ikisi boş yeri tutur? |
   | Üç oyunçu A-ya 5/5/5 | Ən güclü alır? Qarşılıqlı məhv? Heç kim? |
   | X iki regiondan A-ya 5+3, Y 7 | Əvvəl birləşir, sonra döyüşür? |
   | X hücum edir, mənbəyi boşalır, Y oraya girir | Hər hücum arxaya risk edir |

   ⚠️ Sonuncu hal **Faza 3-də tapılan 490 churn-un mexanizmidir** — indi AI qüsuru yox, oyunçunun
   bilərəkdən götürdüyü risk kimi. Ya əla gərginlikdir, ya churn-un qayıtması. Ölçülməlidir.

   ⚠️ Qayda dəsti **proqnozlaşdırıla bilən** qalmalıdır. Diplomacy-nin adjudication kitabçası məhz
   burada nəhəngləşib və bu, AGENTS.md-nin "ultra-yüngül, Lite" kimliyi ilə ziddiyyət riskidir.

3. UI: hərəkəti dərhal tətbiq etmək əvəzinə növbəyə yığ, gözləyən əmrləri xəritədə ox kimi göstər,
   "Növbəni Bitir" = əmrləri təsdiqlə
4. Bot: dəyişməz (artıq `Action[]` qaytarır)
5. Taymer: yalnız MP; SP-də Lobby ayarı

### Qərar qapısı — əvvəlcədən təyin olunmuş hədlər

| Ölçü | Hədd | İndiki (ardıcıl model) |
|---|---|---|
| Oturacaq paylanması fərqi | **< 6 bənd** | 22 (34/33/21/12) |
| Fəthlə bitmə | **≥ 40%** saxlanır | 56% |
| Churn | **< 120** saxlanır | 40.6 |
| **İstifadəçi 3 partiya oynayır** | "5 göndərim, yoxsa 8?" sualı **real** hiss olunur | — |

İlk üçü keçilib sonuncu keçilmirsə: mexanizm ədalətlidir amma darıxdırıcıdır → ardıcıl modelə qayıt.
İş branch-da olduğu üçün heç nə itmir.

**Balans sıfırlanır:** hazırkı 56% / 34.5 turn / 40.6 churn rəqəmləri ardıcıl həlli fərz edir.
Prototipdən sonra `npm run sweep` yenidən qaçırılmalıdır — alət hazırdır, dəyərlər dəyişəcək.

### Ölçə bilmədiklərim

- Adjudication qaydalarının hansı variantının yaxşı olduğu — hər hal üçün 2-3 məqbul cavab var
- Raund-daxili reaktivliyin itməsinin qiyməti: indi hücum edib nəticəni görüb növbəti qərarı verirsən;
  simultaneous-da hamısını kor verirsən. İstənilən çətinlikdir, amma "boşa gedən raund" hissi yarada bilər
- "Daha əyləncəlidir?" — nə arqument, nə simulyasiya cavab verir. Yalnız oynanıla bilən prototip

---

## Faza M — Xəritə keçidləri (chokepoint)

Voronoi xəritəsi **çox əlaqəlidir**: orta 4.57 qonşu (min 2, maks 8). Cəbhələr geniş,
keçid nöqtəsi yoxdur, irəli çıxmaq çətindir.

Kənarları budayıb ölçdüm (250 partiya hər variant):

| Orta qonşu | Fəth% | Turn |
|---|---|---|
| 4.56 (orijinal) | 49% | 34.6 |
| 3.90 | 54% | 34.0 |
| **2.87** | **59%** | **32.6** |

**İş:** `mapgen.ts`-də qonşuluq hesablandıqdan sonra hər regionun ən uzaq sərhədlərini
"keçilməz" (dağ/çay) kimi işarələ, hər region üçün ~K ən yaxın qonşunu saxla.

⚠️ **Qraf bağlılığı qorunmalıdır.** Probe-da K=2 ilə 250 xəritədən 1-i parçalandı —
budamadan sonra bağlılıq yoxlanmalı, parçalanma varsa kənar geri qaytarılmalıdır.

⚠️ Bu, **fəaliyyəti artırmır** (döyüş/raund 0.73 → 0.69, dəyişməz). Yalnız qərarlılıq və sürət verir.
Ordu kilidlənməsini də azaltmır — o metrik onsuz da artefakt idi (yuxarıya bax).

**HƏDD:** fəth ≥ 55%, orta turn ≤ 34, `npm test` yaşıl, bütün xəritələr bağlı.

---

## Faza L — Lobby region seçimi qüsuru

Balans yalnız 24 regionda köklənib. Region sayının təsiri (250 partiya hər ölçü):

| Region | Fəth% | Turn |
|---|---|---|
| 16 | 47% | 34.1 |
| **24** | **49%** | 34.6 |
| **32** | **21%** | 37.9 |
| 40 | 4% | 38.9 |
| 48 | 1% | 39.0 |

**Lobby "Kiçik (16) / Orta (24) / Böyük (32)" təklif edir.** "Böyük (32)" oyunçuya fəth ehtimalı
**21%** olan — yəni əsasən taymerlə bitən — oyun verir. Bu, göndərilə bilən qüsurdur.

Səbəb: Voronoi əlaqəliliyi region sayı ilə **artır** (16-da 4.24 → 48-də 5.00) — cəbhələr genişlənir.

**İki variant:** (a) balansı region sayına görə miqyasla (`maxTurns`, `borderGarrison`),
(b) "Böyük"ü 28-ə endir. Faza M-dən sonra qərar ver — keçidlər böyük xəritələri xilas edə bilər.

**HƏDD:** Lobby-də təklif olunan HƏR ölçüdə fəth ≥ 40%.

---

## Faza S — verdikt DƏYİŞDİ: Adopt

Əvvəlki qeyd: *"simultaneous-un ölçülə bilən üstünlüyü qalmadı"*. **Bu yanlış idi** — düzgün şeyi
ölçməmişdim. Dəf edilmiş hücum metriki qurulduqda mənzərə tamam dəyişdi (yuxarıdakı bölməyə bax).

Uyğun köklənmə ilə (simultaneous ~2 turn uzun sürür, ona görə `maxTurns` 40 vs 38):

| | Ardıcıl @38 | Simultaneous @40 |
|---|---|---|
| Fəthlə bitmə | 45% | 47% |
| Orta uzunluq | 35.1 | 37.5 |
| Churn | 41.9 | 40.1 |
| Oturacaq fərqi | 5.8 | 6.0 |
| **Dəf edilmiş hücum** | **0%** | **11.3%** |

Balans üzrə eynidirlər. Bütün fərq son sətirdədir — və o sətir oyunun **yeganə**
qeyri-müəyyənlik mənbəyidir.

### Bot "simultaneity üçün düşünməlidir?" — üç səviyyə

| Səviyyə | Nədir | Verdikt |
|---|---|---|
| **L1** — özü ilə uyğunluq (R1: mənbəni boşaltma) | ✅ **Artıq var** — `borderGarrison` bunu örtür; bot simultaneous-da qırıq deyil, sadəcə istismar etmir |
| **L2** — riskə həssas hədəf seçimi | 🕐 **Defer** — S-b "hiss" qapısından sonra |
| **L3** — rəqib modelləşdirməsi | ❌ **KILL** — dörd bot eyni proqnozlaşdırıcı ilə deqenerativ tarazlığa düşür (Faza 3-dəki stalemate-in o biri üzü); "Lite" kimliyi ilə ziddiyyət; ölçülmüş istiqamət gərginliyi **azaldır** (ehtiyatlılıq ↑ → dəf% 14.1→6.1) |

**Ölçmə etibarlılığı üçün ağıllı bot LAZIM DEYİL** — həssaslıq təhlili 11.3%-in bot
konfiqurasiyasından asılı olmadığını göstərdi.

**Əvəzinə Faza 9 (bot şəxsiyyətləri) prioritetdə qaldırıldı:** insanın "AI düşünür" kimi hiss etdiyi
şey tək botun dərinliyi yox, **botlar arasındakı fərqdir**. `bot.ts:14`-dəki `BotPersonality`
artıq elan olunub və heç yerdə işlədilmir — ~30 sətirlik iş.

---

## Faza 5 — Xəritəyə strateji məna

Hazırda 24 regionun hamısının gəliri eynidir (12G), yarısı 0 qoşunlu neytraldır → ilk ~8 turn qərarsız klik mərhələsi.

- `Region`-a `terrain: 'PLAIN' | 'HILL' | 'FOREST'` və dəyişkən `income` (8/12/18)
- Təpə/meşə müdafiəyə bonus
- Bütün rəqəmlər `RULES`-a (I-3 pozulmur)
- Neytral regionlara kiçik qarnizon (1-2) — pulsuz torpaq alma bitsin
- `MapView`-da terrain üçün vizual fərq

**HƏDD:** Faza 3-ün hədləri pozulmamalıdır.

---

## Faza 6 — Döyüşə variasiya 🕐 BUZDAN ÇIXDI, SONRAYA

> **Yenilənmiş mövqe:** dondurma səbəbi "Faza S ilə əvəzləyicidir" idi. İndi bilirik ki, oyunda
> qeyri-müəyyənlik **tamamilə sıfırdır**, yəni mənbə lazımdır. Simultaneous artıq 11.3% verir —
> üstünə zər əlavə etmək lazım olmaya bilər. **S-b oynanılandan sonra yenidən ölç və qərar ver.**
> Ehtimal: yalnız "kəşfiyyat dumanı" hissəsi qalar.

> ~~Faza S-in qərar qapısına qədər dondurulub.~~ Faza S ilə bu, naməlumluğun iki fərqli
> mənbəyidir və **bir-birini əvəzləyir**, tamamlamır — öhdəlik toqquşmasının üstünə zər səs-küyü
> qoymaq həddindən artıqdır. Faza S rədd edilsə, bu faza olduğu kimi qüvvəyə minir.
> Faza S qəbul edilsə, bu faza yəqin ki ləğv olunur (bəlkə yalnız "kəşfiyyat dumanı" hissəsi qalar).


Hazırda döyüş tam determinist: `attacker > defender × 1.15`. Nə risk, nə gərginlik.
`Rng` infrastrukturu qurulub, yalnız `mapgen`-də işlədilir.

- `resolveCombat(att, def, rng)` — `applyAction` üçün, itkilərə ±20% variasiya.
  Seed state-dən deterministik törədilir → **I-1 pozulmur**
- `previewCombat(att, def)` — UI üçün **aralıq** qaytarır ("~4-7 itki", "Qələbə şansı: yüksək")
- `PYRRHIC_VICTORY` etiketi UI-da nəhayət göstərilir (hesablanır, heç vaxt render olunmur)

**HƏDD:** `determinism.test.ts` dəyişməz keçir. `game.test.ts:36` aralıq yoxlamasına yenidən yazılır.

---

## Faza 7 — Mobil möhkəmlik (buraxılış blokeri)
 
| # | İş | Fayl | Status |
|---|---|---|---|
| 7.1 | **Save/resume** — `GameState` `localStorage`-a (artıq saf JSON). Gələn zəng partiyanı öldürməsin | `App.tsx` | ✅ Bitdi |
| 7.2 | Hardware Back-də təsdiq — `ExitConfirmModal` ilə təsadüfi çıxışın qarşısı alındı | `ExitConfirmModal.tsx`, `App.tsx` | ✅ Bitdi |
| 7.3 | `useHardwareBack` sızması — `onBackRef` və `isMounted` ilə listener sızmaları aradan qaldırıldı | `useHardwareBack.ts` | ✅ Bitdi |
| 7.4 | **Fontları yerli et** — Google Fonts CDN silindi, yerli sistem şriftləri tətbiq edildi (100% Offline) | `index.html`, `styles.css` | ✅ Bitdi |
| 7.5 | **Capacitor Sync** — Android layihəsi ilə tam sinxronizasiya və splash/status bar sazlandı | `capacitor.config.ts`, `android/` | ✅ Bitdi |

---

## Faza 8 — Layout və performans

> **Faza 2-dən əvvəl irəli çəkildi** — bu qüsurlar oynanış testini korlayacaqdı.

| # | İş | Status |
|---|---|---|
| 8.1 | ~~ActionHUD alt paneli örtür~~ | ❌ **YANLIŞ TAPINTI** — örtmə yoxdur |
| 8.2 | Üst panel 375px-də sətir qırırdı | ✅ hündürlük 69px → 59px, tək sətir |
| 8.3 | Alt paneldə mətn düymələrlə üst-üstə düşürdü | ✅ ipucu mətni ≤420px-də gizlənir |
| 8.4 | Region adları kəsilirdi | ✅ 24/24 region tam görünür |
| 8.4b | Xəritə şaquli sahəni doldurmurdu | ✅ letterbox 59px → 21px, xəritə 562px → 638px |
| 8.4c | Aktiv oyunçu chip-i "Səni…" kimi kəsilirdi | ✅ qısa etiket + "Hesabat" ≤420px-də ikona çevrilir |
| 8.5 | Pan/zoom hər `touchmove`-da React state yeniləyir → 48 SVG node re-render | ✅ **Bitdi** (rAF + scheduleUpdate throttler) |
| 8.6 | Touch listener-lər hər kadrda silinib əlavə olunurdu | ✅ deps `[pan,zoom]` → `[]` + latest-value ref-lər |
| 8.7 | `prefers-reduced-motion` bloku yoxdur | ✅ əlavə edildi |
| 8.8 | `.map-viewport` iç-içə iki dəfə; `.game-main-area` ölü CSS idi | ✅ `<main>` düzgün sinfə keçdi, `height:100%`+`flex:1` konflikti həll olundu |
| 8.9 | Oyun ərzində reytinq paneli yoxdur | ✅ **Bitdi** (`TurnReport.tsx` canlı fraksiya cədvəli) |
| 8.10 | Mətn uyğunsuzluğu: Lobby "5-10 dəq", AGENTS.md "5-15 dəq" | ✅ 5–15 dəqiqə olaraq sinxronlaşdırıldı |

---

## Faza 9 — AI şəxsiyyəti

`bot.ts:14` `BotPersonality { aggression, greed }` elan edilib, **heç yerdə istifadə olunmur**. Hər üç bot eynidir.
`PLAYER_PALETTES`-dəki hər lorda personality bağlanır və `computeBotActions`-a keçirilir (~30 sətir).

**HƏDD:** qalibiyyət paylanması balanslı qalır (indi 22/25/25/27%), oyun tərzləri fərqlənir.

---

## Təxirə salınanlar (tripwire ilə)

| İş | Nə vaxt açılır |
|---|---|
| **Multiplayer / Liqa** | 🔔 **TRIPWIRE ATƏŞ AÇDI** — şərt "fəth ≥ 40%" idi, ölçülən **56%**. PvP artıq legitim mövzudur; giriş nöqtəsi Faza S-dir. Ardıcıllıq arqumenti hələ qüvvədədir: tək oyunçu save/resume-suz PvP daşıya bilməz (Faza 7) |
| Fon musiqisi / ambience | Faza 4 bitdikdən sonra, əgər səs mənzərəsi boş qalırsa |
| Kampaniya / progression | Tək partiya döngüsü əyləncəli hiss olunandan sonra |

---

## Hər mərhələdə yoxlama

```bash
npm run typecheck && npm test && npm run sim -- --games 300
```

Faza 1, 4 və 8-də əlavə olaraq oyun real telefon viewport-unda açılıb DOM ölçüləri götürülür —
bu auditin ən böyük tapıntıları kod oxumaqla yox, **oynamaqla** üzə çıxdı.

## Etməyəcəklərim (soruşmadan)

- `core` memarlığını dəyişmək — beş invariant qalır; Faza 3 və 6-da onlara toxunanda əvvəlcə istifadəçiyə bildir
- Yeni kitabxana əlavə etmək (animasiya/səs) — hər şey mövcud stack-də
- Vizual dizaynı yenidən qurmaq — mövcud qızıl/tünd estetika yaxşıdır, yalnız layout qüsurları
- Android/Capacitor konfiqurasiyasına toxunmaq
