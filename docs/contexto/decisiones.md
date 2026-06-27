# Decisiones

### CoreBook.pdf como única fuente de reglas — Vigente (OBLIGATORIA)
- **Qué:** Todo dato/regla de Daggerheart sale del `CoreBook.pdf` oficial. Usar `grep` sobre `corebook.txt` y citar página (`===== PAGE N =====`).
- **Por qué:** Exactitud de reglas (creación, niveles, dominios, cartas, daño, Hope/Fear). No usar memoria si contradice el libro.

### Auth usuario + PIN con JWT (jose) — Vigente
- **Qué:** Login propio user+PIN, sesión en cookie JWT firmada.
- **Descartado:** Firebase Auth cliente (se evita el SDK cliente por completo).

### Firestore solo Admin SDK (server-side) — Vigente
- **Por qué:** Seguridad; ninguna credencial ni lógica de datos en el cliente.

### Build con webpack, no Turbopack — Vigente
- **Por qué:** compatibilidad con Serwist (`@serwist/next`).

### Habilidades (features) de ancestría/comunidad/clase/subclase en i18n estructurado — Vigente
- **Qué:** El texto mecánico de las habilidades vive en `dh.ancestryFeat` / `dh.communityFeat` / `dh.classFeat` / `dh.subclassFeat` (objetos/arrays `{name,text}` leídos con `t(key,{returnObjects:true})`). UI labels en `feat.*`. Render con `src/components/FeatureSection.tsx` (reutilizado en hoja y wiki).
- **Por qué:** Cada entidad guardaba solo nombre + `_desc` + `_lore` (sabor), nunca la habilidad de regla (ej. Marino → «Conoce la marea»). Estructura anidada evita cientos de claves planas y soporta features variables por entidad.
- **Descartado:** Claves i18n planas por feature (inmanejable con 1-3 features variables) y archivo TS de datos aparte (duplica estructura; rompe consistencia i18n).
