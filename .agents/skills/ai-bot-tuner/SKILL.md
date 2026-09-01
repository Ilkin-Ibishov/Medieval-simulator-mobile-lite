---
name: ai-bot-tuner
description: Design, calibrate, and debug scoring-based AI bot logic, fortification heuristics, and frontier tactics.
---

# AI Bot Tuner Skill

## 1. Bot Decision Structure (`src/ai/bot.ts`)
1. **İlkin İqtisadiyyat və Qoşun Yığımı:** Təhlükə altında olan sərhəd əyalətlərində ordu yığımı.
2. **Taktiki İstehkamlar:**
   - Yüksək təhlükəli cəbhə bölgələrində və ya paytaxtda Qala (`FORT`) tikintisi.
   - Dumanlı sərhədlərdə Müşahidə Qülləsi (`WATCHTOWER`) tikintisi.
3. **Daxili Qoşunların Konsentrasiyası:** Daxili əyalətlərdən sərhədlərə ordu köçürməsi.
4. **Fəth və Hücum:** `previewCombat` yoxlaması ilə əmin qələbə olan əyalətlərə hücum.
