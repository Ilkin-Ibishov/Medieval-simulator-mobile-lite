# Handoff — Medieval Sim Mobile Lite

> Bu sənəd başqa bir AI agentinə (Antigravity) işi davam etdirmək üçün verilir.
> Aşağıdakı mətni həmin agentə **prompt kimi birbaşa yapışdır**.

---

## PROMPT (buradan aşağını agentə ver)

Sən **Medieval Sim Mobile Lite** layihəsini davam etdirəcəksən — React + TypeScript + Vite,
Capacitor ilə Android-ə paketlənən, prosedural Voronoi xəritəli, tək-oyunçu (indi) turn-based
strategiya oyunu. Layihə qovluğu: `C:\Programming\Medieval-simulator-mobile-lite`.

Başlamazdan əvvəl bu üç faylı **tam oxu**, sırayla:

1. **`AGENTS.md`** — layihənin "həqiqətin mənbəyi". Beş pozulmaz invariant var (determinizm,
   `applyAction` tək giriş nöqtəsi, balans sabitlərinin tək mənbəyi `RULES`, saf SVG/DOM,
   `core` saflığı). Bunları pozma. Sonunda "Açıq Memarlıq Qərarı" bölməsi var — oxu.
2. **`IMPLEMENTATION_PLAN.md`** — canlı sənəd, faza-faza status cədvəli, hər fazanın nə
   ölçdüyü və niyə həmin qərara gəldiyi. **Status cədvəlindən başla**, sonra "🔴🔴🔴ç KRİTİK
   DÜZƏLİŞ" bölməsini diqqətlə oxu.
3. **`BALANCE.md`** — bütün simulyasiya ölçmələrinin tarixçəsi, o cümlədən üç ölçmə səhvinin
   tam izahı (aşağıda xülasə edilib).

## Metodologiya — bunu poz, hər şey dağılır

Bu layihədə **iddia deyil, ölçü** hakimdir. Hər balans qərarı `npm run sim`, `npm run sweep`
və ya `npm run compare` ilə təsdiqlənməlidir (`src/sim/`). Kod dəyişikliyindən sonra:

```bash
npm run typecheck && npm test && npm run sim -- --games 500
```

**⚠️ Nümunə ölçüsü xəbərdarlığı (əvvəlki sessiyada 3 dəfə səhv edilib):**
- Fəth%, orta turn, churn kimi metriklər N=200-də sabitdir.
- **Amma `oturacaq fərqi` (seat win-rate spread, max−min 4 faiz) N=2500-dən aşağı sabitləşmir.**
  N=500-də ölçülüb "hədd keçildi" deyilmiş, sonra N=3000-də ~9.2 bənd olduğu üzə çıxıb (5.6 yox).
  Bax `BALANCE.md` → "KRİTİK DÜZƏLİŞ" üçün tam yığılma cədvəli. `src/sim/compare.ts`-də
  `GAMES = 2500` artıq bu səbəbdən qoyulub — **azaltma**.
- `runSimulation` **determinist**-dir (həmişə seed 1..N) — "təkrar sınaq" statistik mənada
  yeni nümunə vermir, sadəcə daha böyük/kiçik sabit cəm verir. "Səs-küy" görsən, əslində
  N-i artırıb yığılmanı yoxla.

## Hazırkı vəziyyət (bitmiş fazalar)

`npm run typecheck` və `npm test` (20/20) təmizdir. Bitmiş: Faza 0 (ölçmə bazası), Faza 1
(kamera — zoom/pan/portret xəritə), Faza 3 (mexanika balansı — fəth 1%→45%, churn 501→42),
Faza 4 (səs/animasiya juice — nəticə-əsaslı səslər, görünən AI növbəsi), Faza S-a
(simultaneous raund core-u `src/core/round.ts`-də qurulub, testlənib, ölçülüb).

## AÇIQ İŞ — buradan davam et

### 1. Faza M — DAYANDIRILIB, kök səbəb açıq (ən yüksək prioritet)

`src/core/mapgen.ts`-də `pruneToChokepoints()` funksiyası **yazılıb amma söndürülüb**
(`RULES.maxNeighbors = 99` — no-op dəyər, `src/core/types.ts`-də). Səbəb: xəritə
əlaqəliliyini azaltmaq (keçidlər yaratmaq) fəthi yaxşılaşdırır (46%→55%) amma **izahsız
oturacaq ID qərəzini gücləndirir** (7.4→9.1 bənd).

Bu qərəz özü daha böyük, həll olunmamış tapıntıdır:

- **2 oyunçuda**: ardıcıl model 63/37 (fərq 25.2!) — klassik növbə-sırası üstünlüyü,
  simultaneous demək olar həll edir (53/47). **Bu, Lobby-nin "2 Lord" seçimində real,
  göndərilə bilən qüsurdur.**
- **4 oyunçuda (default rejim)**: ardıcıl 30/25/25/21 (fərq 8.5), simultaneous demək olar
  eyni (8.7) — simultaneous BURADA heç nəyi düzəltmir. Kök səbəb **tapılmayıb**.

Yoxlanıb rədd edilib: torpaq keyfiyyəti (4 sikl permutasiya testi ilə sübut edilib ki, qərəz
**torpağa yox, oyunçu ID-sinə bağlıdır**), region indeksinin həndəsəsi, `bot.ts`-in özü
(bütün `botId` istifadələri saf bərabərlikdir), taymer bərabərlik tie-break-i (cəmi 2000
partiyada 7 bərabərlik).

**Sənin tapşırığın:** kök səbəbi tap. Başlanğıc nöqtələri:
- `src/core/round.ts` R4 qaydasında `a.playerId < best.playerId` tie-break-i — aşağı ID-ni
  üstün tutur. Bunu neytrallaşdırıb (məs. region-based tie-break) təsirini ölç.
- Klaster böyütmə topologiyası — `src/core/game.ts`-də round-robin `p = (k+step)%playerCount`
  artıq var, amma kim kimin **yanında** olduğu (pinsersiya riski) ölçülməyib.
- Ölçmə üçün `src/sim/compare.ts`-i N=2500+ ilə işlət, seat spread-i player-count üzrə
  (2/3/4/5) parçala — bu artıq bir dəfə edilib, nəticələr `BALANCE.md`-də.

Kök səbəb tapılana qədər `maxNeighbors`-u 99-dan aşağı salma.

### 2. Faza L — Lobby region seçimi qüsuru (ucuz, təsdiqlənmiş)

Balans yalnız 24 regionda köklənib. Ölçülüb (`IMPLEMENTATION_PLAN.md` Faza L):

| Region | Fəth% |
|---|---|
| 16 | 47% |
| 24 (default) | 49% |
| **32 ("Böyük")** | **21%** |
| 40 | 4% |
| 48 | 1% |

Lobby-nin "Böyük (32)" seçimi hazırda əsasən taymerlə bitən oyun verir. `src/ui/Lobby.tsx`.
İki variant: (a) balansı region sayına görə miqyasla, (b) "Böyük"ü ~28-ə endir.
**HƏDD:** Lobby-də təklif olunan HƏR ölçüdə fəth ≥ 40%.

### 3. Faza S-b — Simultaneous UI prototipi

Core (`src/core/round.ts`, `resolveRound`) hazırdır, 7 test keçir, sim müqayisəsi edilib.
Qərar qapısının əsl əsası: **dəf edilmiş hücum nisbəti** — ardıcıl modeldə 17 min hücumda
**0%** dəf edilmiş hücum (döyüş tam determinist, `previewCombat` nəticəni dəqiq göstərir,
bot yalnız qalib gələcəyi hücumu edir), simultaneous-da **11.3%**. Bu, oyunun yeganə
qeyri-müəyyənlik mənbəyidir.

**Qalan iş (UI, hələ toxunulmayıb):**
- Əmrləri dərhal tətbiq etmək əvəzinə növbəyə yığ
- Gözləyən əmrləri xəritədə ox kimi göstər (`MapView.tsx`-də `actionArrow` mexanizmi
  Faza 4-də artıq qurulub, təkrar istifadə edilə bilər)
- "Növbəni Bitir" = bütün əmrləri təsdiqlə, `resolveRound` çağır
- Bot dəyişməz qalır (artıq `Action[]` qaytarır)
- Taymer YALNIZ multiplayer üçün; SP-də Lobby-də opsional ayar (istifadəçinin tələbi)

**Balans təkrar köklənməli:** simultaneous ~2 turn uzun sürür, `maxTurns` fərqli lazımdır
(ardıcıl 38 vs simultaneous ~40, `npm run compare`-də görünür).

### 4. Faza 6 — Döyüşə variasiya (buzda, S-b-dən sonra qiymətləndir)

`previewCombat` tam determinist. Simultaneous artıq 11.3% qeyri-müəyyənlik verirsə, buna
zər əlavə etmək lazım olmaya bilər. **S-b oynanılandan sonra qərar ver.**

### 5. Faza 9 — AI şəxsiyyətləri (prioritetdə qaldırılıb, ucuz)

`src/ai/bot.ts:14`-də `BotPersonality { aggression, greed }` elan olunub, **heç yerdə
işlədilmir**. `PLAYER_PALETTES`-dəki hər lorda bağla, `computeBotActions`-a keçir (~30 sətir).
Səbəb: "AI düşünür" hissini bot-un rəqib-modelləşdirməsindən (KILL edilib, aşağıya bax)
qat-qat ucuz verir.

### 6. Faza 7 — Mobil möhkəmlik (buraxılış blokeri, toxunulmayıb)

Save/resume (`GameState` artıq saf JSON, `localStorage`-a yazılmalıdır), Hardware Back
təsdiq dialoqu, `useHardwareBack` closure sızması, fontları CDN-dən yerliyə köçürmək
(Lobby "100% Offline Parity" yazır, amma Google Fonts CDN-dən yüklənir), "Növbəni Bitir"
mühafizəsi (xərclənməmiş qızıl xəbərdarlığı).

## Rədd edilmiş / öldürülmüş qərarlar (təkrar açma)

- **L3 — bota rəqib modelləşdirməsi öyrətmək**: ❌ KILL. Dörd bot eyni proqnozlaşdırıcı ilə
  deqenerativ tarazlığa düşür (heç kim hücum etmir). Ehtiyatlılıq artdıqca dəf nisbəti azalır
  (14.1%→6.1%, ölçülüb) — bu istiqamət gərginliyi **azaldır**, artırmır.
- **Neytral region qarnizonu**: ❌ rədd edilib, fəthi 59%→6% salır.
- **Oturacaq başına başlanğıc qızıl kompensasiyası**: ❌ təkzib edilib, paylanmanı dəyişmir.

## Alətlər

```bash
npm run dev            # Vite dev server
npm run typecheck       # tsc --noEmit
npm test                # vitest, 20 test
npm run sim -- --games 500     # tək model balans hesabatı
npm run sweep            # RULES + BOT_CONFIG şəbəkəsi üzrə balans axtarışı
npm run compare          # ardıcıl vs simultaneous qərar qapısı (N=2500)
```

Hər dəyişiklikdən sonra `BALANCE.md`-yə nəticəni yaz, `IMPLEMENTATION_PLAN.md` status
cədvəlini yenilə. Bu, sənədləşdirmə vərdişi deyil — layihənin yaddaşıdır, çünki hər fazanın
əvvəlki fazaların nəticəsinə etibar etməsi lazımdır.

Sual yaransa və ya iddia ölçülə bilmirsə, təxmin etmə — ölçüm alətlərinə yeni metrik əlavə et
(`src/sim/engine.ts`-dəki `SimStats` interfeysinə bax, nümunə üçün mövcud metriklərə bax).
