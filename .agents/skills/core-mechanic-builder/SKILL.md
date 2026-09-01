---
name: core-mechanic-builder
description: Guide the implementation of new game mechanics, fortifications, and resources following the 6-step extension recipe.
---

# Core Mechanic Builder Skill

Follow this strict 6-step recipe whenever introducing a new mechanic or resource to Medieval Sim:

```
1. types.ts     -> Define types (e.g. BuildingType), RULES constants, Action variant
2. rules.ts     -> Pure query functions (getRegionVisibility 2-hop, previewCombat fort bonus)
3. game.ts      -> canApply, applyAction mutation, resolveRound simultaneous execution
4. ai/bot.ts    -> AI candidate generation and evaluation scoring (MANDATORY)
5. sim/run.ts   -> Telemetry metrics and sweep search grid
6. ui/          -> ActionHUD building buttons, MapView SVG badges, combat previews
```
