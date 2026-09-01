# AI Bot Paritet Qaydası (Zero-Cheating)

## 1. Bot Məcburiyyəti
* Bot heç vaxt qaydalardan kənar məlumat almamalıdır (Fog of War daxilində dumanlı ərazini görmür).
* Oyuna əlavə edilən hər yeni `Action` (məsələn, `BUILD`, `HIRE`, `MOVE`) **mütləq** `src/ai/bot.ts` daxilində dəstəklənməlidir.
* Əgər bot yeni mexanikanı bilmirsə, headless 10,000 simulyasiyada həmin mexanika simulyasiya olunmur və balans saxtalaşır.
