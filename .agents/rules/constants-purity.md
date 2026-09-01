# Balans Sabitlərinin Saflığı (I-3)

## Qayda:
Kodda heç vaxt hardcode balans ədədi (`10`, `12`, `1.5`, `25`, `15`) yazılmamalıdır.
Bütün ədədlər `RULES.unitCost`, `RULES.fortCost`, `RULES.watchtowerCost` və s. kimi çağırılmalıdır.
Bu, `sweep.ts` mühərrikinin parametrləri avtomatik axtarması üçün həyati vacibdir.
