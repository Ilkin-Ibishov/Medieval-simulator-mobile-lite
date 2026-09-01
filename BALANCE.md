# Balans Jurnalı

`npm run sim -- --games 300` nəticələri. Hər mexanika dəyişikliyindən sonra yeni sətir əlavə olunur.

## Hədəflər

| Metrik | Hədəf | Niyə |
|---|---|---|
| Fəthlə bitmə | ≥ 40% | AGENTS.md: "5–15 dəqiqəlik **bitən** partiyalar". Taymer həlli bitmə deyil. |
| Orta uzunluq | ≤ 35 turn | 60 turn × 4 oyunçu mobil sessiya üçün çox uzundur |
| Sahiblik dəyişməsi (churn) | < 120 | 24 region üçün 500 dəyişmə = fəthlərin ~95%-i geri alınır → irəliləyiş hissi yoxdur |

---

## Baseline — Faza 0 (dəyişiklikdən əvvəl)

```
Fəthlə bitmə:          1%      ❌
Orta uzunluq:          60.9    ❌
Churn:                 501.7   ❌
Liderin son payı:      57%
Eliminasiya/partiya:   0.36 / 3
Qalibiyyət:            22 / 25 / 25 / 27 %
Sürət:                 575 games/sec
```

**Diaqnoz:** qüvvəni cəmləmək mümkün deyil. `game.ts` — dost əraziyə köçən qoşun `exhaustedTroops`-a
əlavə olunur, deməli bir hücumun maksimum gücü = bir regionun qarnizonu. `defenderAdvantageRatio: 1.15`
və bütün regionlarda eyni gəlir (12G) ilə cəbhələr riyazi olaraq salınır → sonsuz yellənmə.

Detallar: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) Faza 3.

## Faza 1 — Kamera düzəlişindən sonra (mexanika toxunulmayıb)

```
Fəthlə bitmə:          0%      ❌
Orta uzunluq:          60.9    ❌
Churn:                 498.5   ❌
Liderin son payı:      57%
Eliminasiya/partiya:   0.37 / 3
```

Xəritə nisbəti 1600x900 -> 1000x1500 dəyişdi, yəni hər seed üçün həndəsə tamam başqadır.
Göstəricilər praktiki olaraq eyni qaldı. **Nəticə:** dayanıqlıq xəritə formasından deyil,
mexanikadan gəlir. Faza 3 diaqnozu (qüvvə cəmləmək mümkün deyil) qüvvədə qalır.

---

## Faza 3 — Qüvvə cəmləmə problemi

### Diaqnoz auditdəkindən tamam başqa çıxdı

Auditdə iki hipotez vardı: (1) qüvvəni cəmləmək mümkün deyil, (2) fəth edən ordu tutduğu yeri
saxlaya bilmir. **Hər ikisi ölçmə ilə təkzib olundu.**

16 kombinasiyalıq sweep (`defenderAdvantageRatio` 1.15→2.0 × `attackerLossRatio` 0.8→0.25):
churn 458–488 aralığında qaldı, fəth 0–2%. Yəni döyüş riyaziyyatı heç nəyi dəyişmirdi.

Səbəbini instrumentləşdirdim (100 partiya):

```
partiya başına hücum:                   487
  ...hədəfdə 0 qoşun vardı:             448  (92%)
  ...mənbə regionu tamamilə boşaldı:    412  (85%)
orta 0 qoşunlu sahibli region:          13.7 / 24
```

**Əsl səbəb `ai/bot.ts`-də idi, `core`-da yox.** Bot hər turn bütün qarnizonu irəli sürürdü və
arxada boş regionlar zənciri qoyurdu; düşmən onlara sıfır itki ilə girirdi. Hücumların cəmi 8%-i
əsl döyüş idi — döyüş parametrlərinin təsirsiz qalmasının səbəbi də budur.

Düzəliş: `BOT_CONFIG.borderGarrison` — bot sərhəd regionundan çıxarkən həmişə qarnizon saxlayır.
Tək bu dəyişiklik (6 sətir): churn 490 → 194, fəth 1% → 9%.

### Sweep nəticələri

`borderGarrison` dominant lever oldu. İkinci mühüm tapıntı: **yüksək gəlir fəthi öldürür**
(`regionBaseIncome` 12 → 18 etdikdə hər kombinasiyada fəth ~0%-ə düşür — pul çox olanda hər itki
dərhal əvəz olunur, cəbhə donur).

`npm run sweep` bu şəbəkəni istənilən vaxt yenidən qaçırır.

### Seçilən dəyərlər

```
borderGarrison (bot):     2  →  4
defenderAdvantageRatio: 1.15 →  1.5
attackerLossRatio:       0.8 →  0.2
startingTroops:            3 →  5
maxTurns:                 60 →  40
```

### Nəticə (500 partiya)

```
✅ Fəthlə bitmə:        hədəf ≥40%   →  56%    (əvvəl 1%)
✅ Orta uzunluq:        hədəf ≤35    →  34.5   (əvvəl 60.9)
✅ Sahiblik dəyişməsi:  hədəf <120   →  40.6   (əvvəl 501)
   Qərarlı partiya uzunluğu:         →  29.5 turn
   Liderin son payı:                 →  84%
   Eliminasiya / partiya:            →  1.95 / 3  (əvvəl 0.36)
```

### ⚠️ Açıq problem: növbə sırası üstünlüyü

Partiyalar qərarlı olan kimi oturacaq sırası üzə çıxdı: **34% / 33% / 21% / 12%**
(əvvəl 22/25/25/27 idi — amma o vaxt heç kim udmurdu, ona görə bərabər görünürdü).

Üç hipotez yoxlandı və **hər üçü təkzib olundu**:

| Hipotez | Test | Nəticə |
|---|---|---|
| İqtisadi: gec oyunçunun pulu azdır | seat başına +0…+16 başlanğıc qızıl | paylanma dəyişmədi (34/33/22/12 → 36/30/21/13) |
| Neytral torpaq yarışı: erkən oyunçu hamısını götürür | neytral qarnizon 0…4 | skew azalmadı, üstəlik fəth 59%→6% düşdü |
| Taymer bərabərliyi kiçik indeksə üstünlük verir | 126 taymer partiyası | **0 bərabərlik** — səbəb deyil |

Skew həm fəth qələbələrində (64/58/34/18) həm taymer qələbələrində (37/43/26/20) var.
Qalan izah: sıra ilə növbənin təbii **temp** üstünlüyü.

**Təcililik:** aşağı. İnsan həmişə seat 0-dır, yəni skew hazırda oyunçunun **xeyrinədir**.
Əhəmiyyət kəsb edəcəyi yer planlaşdırılan PvP-dir (təxirə salınanlar siyahısı).

---

## Mübahisəli əyalətlərin tezliyi (Faza S qərarı üçün ölçmə)

Sual: "iki oyunçu eyni əyaləti istəyir" ssenarisi nə qədər tez-tez yaranır? Bu, simultaneous
raund modelinin dəyərini müəyyən edən rəqəmdir (bax [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) Faza S).

200 partiya, 6255 raund, hazırkı balansla:

```
raund başına 2+ oyunçunun çata bildiyi region:   7.14 / 24   (~30% xəritənin)
  ...onlardan zəif müdafiəli (<=2 qoşun):        0.79
ən azı 1 mübahisəli region olan raundlar:        94%
mərhələ üzrə:  erkən(1-10) 6.85 · orta(11-25) 7.43 · gec(26+) 6.96
```

**Gözlənilməz nəticə:** bunun əsasən açılış hadisəsi (neytral torpaq yarışı) olacağını fərz edirdim.
Deyil — bütün partiya boyu sabit qalır. Hər raund ~7 əyalətin taleyi hazırda **növbə sırası ilə**
həll olunur, çünki ardıcıl modeldə ilk çatan qaranti alır.

Qeyd: tam boş əyalət halı (0.79/raund) ümumi mübahisəli haldan (7.14) 9 dəfə nadirdir — yəni
"boş A-ya 5 ordu" nümunəsi xüsusi haldır, ümumi hal isə müdafiə olunan əyalət uğrunda yarışdır.

---

## Oturacaq ədalətsizliyi — həll olundu (Faza S ölçmələri)

Əvvəlki qeyddə üç hipotez təkzib etmişdim (qızıl kompensasiyası, neytral qarnizon, taymer
bərabərliyi) və "sıra ilə növbənin təbii temp üstünlüyü" nəticəsinə gəlmişdim. **Bu da yanlış idi.**

### Təkzib 1 — simultaneous model skew-i düzəltmir

Simultaneous raund modeli qurulub eyni seed-lərlə müqayisə edildi:

```
oturacaq fərqi:   ardıcıl 21.6 bənd  →  simultaneous 23.2 bənd
```

Növbə sırası tamamilə aradan qalxdığı halda skew qaldı → səbəb növbə sırası deyilmiş.

### Həlledici təcrübə — skew torpağın ardınca gedir

Başlanğıc əraziləri oyunçular arasında dəyişdirildi, qalan hər şey eyni (400 partiya):

| Təcrübə | Qalibiyyət (seat 0/1/2/3) |
|---|---|
| Normal | 33 / 33 / 22 / 13 |
| Torpaqlar tərsinə (0↔3, 1↔2) | **11** / 29 / 29 / 31 |
| Torpaqlar sürüşdürülüb | 30 / 30 / **14** / 26 |

Seat 0 başqasının torpağını alanda 33% → **11%**. Üstünlük **torpağa** bağlıdır, oturacağa yox.

### Kök səbəb və düzəliş

`createGame` paytaxtları bir-bir acgöz seçirdi: seat 0 → region 0, seat 1 → ondan ən uzaq nöqtə,
seat 3 → qalan ən sıxışdırılmış yer.

İki addımlı düzəliş lazım oldu:

1. **Paytaxt dəsti bütöv seçilir** — hər başlanğıc indeksi farthest-point toxumu kimi sınanır,
   paytaxtlar arası minimum məsafəni maksimallaşdıran dəst seçilir. Klasterlər round-robin böyüyür.
   *Tək başına bu KİFAYƏT ETMƏDİ* — fərq 21.6 → 24.8 bəndə çıxdı.
2. **Təyinat həndəsədən ayrıldı** — dəst region indeksinə görə sıralanır. Farthest-point ardıcıllığı
   iki ucu birinci qoyur, qalanı aralarında sıxır; `capitals[p]` təyinatı sadəcə qərəzi köçürürdü.
   Region indeksləri relaxed Voronoi nöqtə sırasından gəlir və məkan mənası daşımır.

### Nəticə

```
oturacaq fərqi:  24.8  →  6.4 bənd (ardıcıl)  ·  4.8 bənd (simultaneous)
paylanma:        28% / 25% / 21% / 25%
```

**Yan təsir:** yeni yerləşdirmə ilə fəthlə bitmə 56% → 49% düşdü (hədd ≥40% hələ keçilir).
Paytaxtlar daha bərabər olduğu üçün heç kim erkən üstünlük qazanmır. Lazım olsa `npm run sweep`
ilə geri qaytarıla bilər.

---

## Faza S qərar qapısı — nəticələr (500 partiya, eyni seed-lər)

| | ARDICIL | SIMULTANEOUS |
|---|---|---|
| Fəthlə bitmə | 49% | 42% |
| Orta uzunluq | 36.1 | 37.5 |
| Qərarlı partiya | 31.0 | 32.7 |
| Churn | 42.4 | 40.1 |
| Liderin payı | 80% | 79% |
| Oturacaq fərqi | **6.4** | **4.8** |

```
✅ Oturacaq fərqi < 6 bənd   → 4.8
✅ Fəthlə bitmə >= 40%       → 42%
✅ Churn < 120               → 40.1
   Keçilən: 3/3 ölçülə bilən hədd
```

**Amma ardıcıl model də indi keçir** və fəth/sürət üzrə bir qədər daha yaxşıdır.
Simultaneous üçün irəli sürdüyüm ölçülə bilən əsas — ədalət — **artıq mövcud deyil**,
çünki o problem başqa səbəbdən idi və hər iki modeldə düzəldildi.

Qalan yeganə arqument oyunçunun öz arqumentidir: **"5 göndərim, yoxsa 8?"** qərarının hissi.
Bu, yalnız oynanıla bilən prototiplə yoxlanır (4-cü hədd). `npm run compare` istənilən vaxt
bu cədvəli yenidən qurur.

### Ədalət düzəlişindən sonra yenidən köklənmə

Bərabər paytaxtlar partiyaları bir qədər uzatdı (34.3 → 36 turn, hədd 35). `npm run sweep` ilə
16 kombinasiya yoxlandı, `maxTurns` 40 → **38** edildi.

**Yekun (500 partiya, ardıcıl model):**

```
✅ Fəthlə bitmə:        hədəf ≥40%  →  45%
✅ Orta uzunluq:        hədəf ≤35   →  35 turn
✅ Sahiblik dəyişməsi:  hədəf <120  →  41.8
✅ Oturacaq fərqi:      hədəf <6    →  5.6 bənd
   Liderin son payı:                →  79%
   Eliminasiya:                     →  1.68 / 3
```

⚠️ **Bu köklənmə ardıcıl model üçündür.** Eyni dəyərlərlə simultaneous modelin fəth göstəricisi
36%-ə düşür, çünki simultaneous partiyalar bir qədər uzun sürür və 38-turn tavanı onları kəsir.
Simultaneous qəbul edilsə, `npm run sweep` onun üçün ayrıca qaçırılmalıdır (təxminən `maxTurns`
40-42 lazım olacaq). Bu, simultaneous modelin qüsuru deyil — sadəcə hansı model üçün köklənmə
aparıldığının nəticəsidir.

---

## ⚠️⚠️⚠️ KRİTİK DÜZƏLİŞ — oturacaq fərqi metriki səhv nümunə ölçüsü ilə ölçülmüşdü

**İstifadəçinin şübhəsi doğru çıxdı.** Aşağıdakı bütün əvvəlki "oturacaq fərqi 4.8–6.4 bənd,
hədd keçildi" iddiaları **N=500 partiya ilə ölçülüb və yanlışdır.**

### Kök səbəb: `oturacaq fərqi` = max(4 qazanma faizi) − min(4 qazanma faizi)

Bu, orta qiymət deyil, **ekstremum statistikasıdır** və orta qiymətdən qat-qat yavaş yığılır.
`runSimulation` determinist olduğu üçün (həmişə seed 1..N) fərqli N-lər "təsadüfi nümunə"
deyil, sadəcə fərqli ölçülü cəmlərdir — və bu statistika üçün N=500 kifayət deyil.

Yığılma sınağı (default RULES, ardıcıl model):

```
N=200   oturacaq fərqi=7.0
N=400   oturacaq fərqi=6.0
N=500   oturacaq fərqi=5.6   ← Faza S qərar qapısında istifadə olunan N
N=800   oturacaq fərqi=7.3
N=1000  oturacaq fərqi=9.1
N=1500  oturacaq fərqi=8.5
N=2000  oturacaq fərqi=9.1
N=3000  oturacaq fərqi=9.2   ← sabitləşir
```

Digər metriklər (fəth%, turn, churn, lider%, elim) N=200-də artıq sabitdir (±1 bənd) —
**yalnız oturacaq fərqi** bu qədər yavaş yığılır. Bunu əvvəlcədən yoxlamamağım metodoloji səhv idi.

**Doğru rəqəm: ~9.2 bənd, 5.6 yox.** Faza 3 və Faza S-dəki "hədd < 6 keçildi" nəticələri
**etibarsızdır.**

### Yaxşı xəbər: paytaxt ədaləti düzəlişi hələ də real və doğrudur

İstifadəçinin şübhəsi metrikaya aid idi, düzəlişin özünə yox. Böyük N-də təkrar yoxlanıldı:
paytaxt dəstini bütöv seçmək + region indeksinə görə sıralamaq düzəlişi **hələ də işləyir** —
"torpaqları dəyiş" testi böyük N-də təkrarlandı və eyni nəticəni verdi (aşağıya bax). Sadəcə
qalan fərq (24.8 → ~9, 6 yox) daha böyükdür, deyildiyi qədər kiçik deyil.

---

## Yeni tapıntı — qalan ~9 bəndlik fərq TORPAQDAN GƏLMİR, OTURACAQ İNDEKSİNDƏN GƏLİR

Paytaxt ədaləti düzəlişini böyük N-də (2000 partiya) yenidən yoxladım:

```
normal (seat i öz torpağını alır):        29% / 26% / 25% / 20%   fərq=9.2
tərsinə (0↔3, 1↔2 torpaqları dəyişir):    28% / 28% / 23% / 21%   fərq=7.1
```

Əgər fərq TORPAQdan gəlsəydi, tərsinə testində rəqəmlər güzgülənməli idi (20/25/26/29).
**Güzgülənmədi** — demək olar eyni forma qaldı. Dörd fərqli sikl permutasiyası ilə təsdiqləndi:

```
identity:   29% / 26% / 25% / 20%
cyclic +1:  29% / 27% / 23% / 21%
cyclic +2:  31% / 24% / 25% / 20%
cyclic +3:  28% / 27% / 23% / 22%
```

**Hər dəfə fiziki torpaq tamam fərqli olsa da, seat 0 həmişə ~29%, seat 3 həmişə ~20-22% udur.**
Bu, torpaq keyfiyyəti deyil — **oyunçu ID-sinə bağlı mexaniki qərəzdir.**

### Axtarış: mexaniki səbəb harada?

Yoxlanılıb və rədd edilib:
- `bot.ts` — bütün `botId` istifadələri saf bərabərlik yoxlamasıdır, ədədi qərəz yoxdur
- Region indeksinin özü heç bir həndəsi qərəz daşımır (500 xəritə üzrə mərkəzdən məsafə
  və qonşu sayı indeksdən asılı deyil — 459–499 aralığında təsadüfi)
- Taymer bərabərliyi tie-break — 2000 partiyada cəmi 7 bərabərlik (0.35%), izah etmir

### Tapılan: oyunçu sayı ilə güclü qarşılıqlı təsir

```
2 oyunçu:  ardıcıl  63/37   fərq=25.2  ← NƏHƏNG
           simultaneous  53/47  fərq=5.1   ← demək olar həll olundu
3 oyunçu:  ardıcıl  36/33/32  fərq=4.1
           simultaneous  36/35/29  fərq=6.9
4 oyunçu:  ardıcıl  30/25/25/21  fərq=8.5
           simultaneous  29/26/25/20  fərq=8.7
5 oyunçu:  ardıcıl  24/21/22/18/16  fərq=7.8
           simultaneous  24/22/20/17/17  fərq=6.9
```

**2 oyunçuda tapıntı aydındır:** ardıcıl modeldə seat 0 63% udur (növbədə həmişə əvvəl
hərəkət edir, neytral torpağı rəqib cavab verə bilmədən tutur). Simultaneous bunu 53/47-yə
salır — demək olar həll edir. **Bu, klassik növbə-sırası üstünlüyüdür və Lobby-nin "2 Lord"
seçimində REAL, göndərilə bilən ədalətsizlikdir** (əvvəlki sessiyalarda 4 oyunçu ilə test
edildiyi üçün gözdən qaçmışdı).

**4 oyunçuda (default rejim) tapıntı qeyri-müəyyəndir:** hər iki model ~8.5 fərq verir.
Simultaneous burada növbə sırası problemini həll etmir, çünki 4 oyunçuda əsas mexanizm
başqadır (ehtimal: emergent çoxagentli dinamika — kim kimin yanındadır, kim ilk pinsersiya
olunur — və bu, ölçülməmiş qalıb). **Kök səbəb tapılmadı, açıq qalır.**

### Nəticə Faza S üçün

Simultaneous-un ədalət arqumenti **yalnız 2 oyunçuda güclüdür**. Oyunun default rejimi olan
4 oyunçuda simultaneous ədaləti düzəltmir. Faza S-in "Adopt" verdikti dəf edilmiş hücum
nisbətinə (0% vs 11.3%) əsaslanır — bu, bu düzəlişdən təsirlənmir və qüvvədə qalır.
Ədalət arqumenti isə yalnız 2-oyunçu rejiminə aid qismi dəstək kimi saxlanmalıdır.

**HƏDD YENİDƏN YAZILIR:** "oturacaq fərqi < 6 bənd" hədəfi N=500-ün artefaktı əsasında
qoyulmuşdu və real deyil. Yeni hədd: 4-oyunçu rejimdə fərqi əvvəlki ~9.2 bazasından
**azaltmaq** (mütləq ədədi hədəf yox, çünki mexanizm hələ naməlumdur).

---

## Faza M sırasında aşkarlanan əlavə gərginlik: keçidlər (chokepoint) ədalət fərqini artırır

`maxNeighbors` sweep-i N=2000-də:

```
yoxdur (K=99):  fəth=46%  churn=42.1  oturacaq=7.4
K=4:            fəth=46%  churn=41.5  oturacaq=7.4
K=3:            fəth=55%  churn=42.7  oturacaq=9.1   ← seçilmiş
K=2:            fəth=61%  churn=43.3  oturacaq=7.3
```

K=3 ilə fəth 46%→55% yaxşılaşır, amma oturacaq fərqi 7.4→9.1 pisləşir (baza artıq
düşünüldüyündən yüksək olduğu üçün, bu, mütləq mənada da nisbi mənada da narahatedicidir).
Round-robin klaster böyütmə sırası rotasiya edildi (`p = (k+step) % playerCount`) ki, ilk
addımda seat 0 həmişə birinci seçməsin — bu, kiçik təkmilləşdirmə verdi, amma yuxarıdakı
seat-ID qərəzini həll etmədi, çünki o daha dərin, tapılmamış bir mənbədəndir.

**Faza M davam etmədən əvvəl bu araşdırılmalıdır** — əks halda keçidlər mövcud, izah
olunmamış ədalətsizliyi daha da gücləndirə bilər.

---

## ✅ Kök Səbəb Tapıldı və Həll Olundu: `round.ts` R4 Tie-Break Qüsuru

İzahsız 4-oyunçu oturacaq ID qərəzinin kök səbəbi tapıldı:
`src/core/round.ts:146` daxilindəki `(a.troops === best.troops && a.playerId < best.playerId)` şərti.

### 1. Kök Səbəb və Ölçmə (N=2500 partiya):
- Partiya başına orta hesabla **2.06 bərabər hücum toqquşması** (cəmi 5,151 toqquşma) baş verir.
- `a.playerId < best.playerId` ilə:
  - Seat 0: **2,644 qələbə (51.3%)**
  - Seat 1: **1,719 qələbə (33.4%)**
  - Seat 2: **788 qələbə (15.3%)**
  - Seat 3: **0 qələbə (0.0%)**
- Həll: `Math.abs(seed * 31 + turn * 17 + regionId) % topAttackers.length` deterministik hash tie-break.
- Nəticə: Seat 0 (25.2%), Seat 1 (24.8%), Seat 2 (24.9%), Seat 3 (25.0%).
- **Oturacaq fərqi 6.2–8.7 bənddən 1.7–2.8 bəndə endirildi!**

### 2. Faza M (Keçidlər) Yenidən Aktivləşdirildi:
`RULES.maxNeighbors = 3` (K=3) və `RULES.maxTurns = 40` ilə (N=2500):
```
✅ Oturacaq fərqi:        hədəf <6 bənd  →  2.8 bənd  (25.3% / 25.2% / 26.2% / 23.4%)
✅ Fəthlə bitmə:          hədəf ≥40%     →  54%
✅ Churn:                 hədəf <120     →  41.4
   Orta turn:                            →  36.3
   Qərarlı partiya:                      →  32.3
```

### 4. Təbii Voronoi Geometriyası və 100% Vizual Uyğunluq (K=99):
Gizli maneələrin yaratdığı vizual çaşqınlığı aradan qaldırmaq üçün təbii qonşuluq (`RULES.maxNeighbors = 99`) aktivləşdirildi.
Ölçmə (N=2500 partiya):
```
✅ Oturacaq fərqi:        hədəf <6 bənd  →  1.5 bənd  (25.4% / 25.8% / 24.6% / 24.3%)
✅ Fəthlə bitmə:          hədəf ≥40%     →  47%
✅ Churn:                 hədəf <120     →  40.5
   Orta turn:                            →  37.2
   Qərarlı partiya:                      →  32.9
```
Nəticə: Toxunan 100% bütün sərhədlər keçiləndir, heç bir qraf qopması və ya görünməz divar yoxdur.

---

## 👑 Faza C — Paytaxt & Çöküş (Capital & Realm Collapse) Mexanikası

PC versiyasındakı kimi, hər bir fraksiyaya başlanğıcda strateji paytaxt təyin edildi və 5-turn möhlət mexanikası əlavə olundu.

### Ölçmə (N=2500 partiya, Simultaneous Model):
```
✅ Fəthlə bitmə %:        47%  →  74%  (+27 pp artım! Qələbələr qəti və sürətlidir)
✅ Oturacaq fərqi:        hədəf <6 bənd  →  2.0 bənd (24% / 26% / 24% / 25% mükəmməl simmetriya)
✅ Churn:                 hədəf <120     →  48.8
   Orta partiya:                         →  32.1 turn
   Qərarlı partiya:                      →  29.0 turn
   Eliminasiya / 3:                      →  2.61 / 3
```

**Nəticə:**
1. Paytaxt sistemi zəifləmiş oyunçuların xəritədə sonsuz qaçmasının qarşısını tamamilə aldı.
2. Fəthlə bitmə göstəricisi rekord **74%**-ə yüksəldi.
3. Oturacaq balansı tam bərabərdir (24% / 26% / 24% / 25%).


