# DHApp — reglas de proyecto

## Fuente canónica del juego: CoreBook (REGLA OBLIGATORIA)

**TODO** el contexto, reglas, datos y contenido de Daggerheart que se plasme en la app
DEBE salir del libro oficial `CoreBook.pdf` (raíz del repo, solo local, gitignored).

- El PDF pesa ~175 MB y no se puede leer directo. Hay una extracción de texto buscable en
  `corebook.txt` (también gitignored). **Usa `grep` sobre `corebook.txt`** para localizar
  reglas/datos y citar la página (`===== PAGE N =====`).
- Para arte/maquetación que el texto no captura, leer rangos del PDF con la tool de PDF
  (máx ~20 págs/llamada) cuando haga falta.
- Ante cualquier duda de reglas (creación, niveles, dominios, cartas, equipo, ancestries,
  communities, daño, Hope/Fear, etc.) **consultar el CoreBook antes de inventar**. No usar
  conocimiento de memoria si contradice el libro.
- `src/lib/daggerheart/reference.ts` y los datos importados deben coincidir con el CoreBook.

## Diseño visual (REGLAS OBLIGATORIAS)

- **Mobile-first SIEMPRE.** La app se usa principalmente en móvil. Toda pantalla/componente
  se diseña primero para móvil y luego escala; todo debe ser **totalmente responsive**
  (probar 360px → tablet → desktop, touch targets ≥44px, sin overflow horizontal).
- La UI debe estar **basada en la estética de Daggerheart** (oscuro, dorado tipo "Hope",
  púrpura tipo "Fear", tipografía serif heroica Cinzel). Tokens en `globals.css`.
- **Validar SIEMPRE con el equipo visual** (los 5: ui-ux-pro-max, Amil/emil-design-eng,
  frontend-design, oh-my-claudecode:designer, impeccable) ANTES de declarar cualquier
  pantalla o componente como completo. Sin excepción.

## Stack / convenciones

- Datos + auth: **Firebase** (Firestore + auth propio username/PIN server-side). Plan Spark (gratis).
- i18n EN/ES obligatorio (next-intl); nunca textos hardcodeados en JSX.
- Build/dev en `--webpack` (Serwist no soporta Turbopack en Next 16).

@AGENTS.md
