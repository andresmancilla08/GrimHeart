# GrimHeart — Hojas de personaje de Daggerheart

PWA mobile-first para crear y gestionar hojas de personaje de **[Daggerheart](https://www.daggerheart.com/)** (el TTRPG de Darrington Press). Diseñada con la estética oscura y dorada del propio juego, con soporte bilingüe **inglés / español** y flujo completo de creación y subida de nivel.

🌐 **[grimheart.co](https://grimheart.co)**

> ⚠️ Proyecto no oficial. Daggerheart™ es propiedad de Darrington Press. Contenido del **CoreBook** usado bajo la **Darrington Press Community Gaming License (DPCGL)**. No está afiliado ni respaldado por Darrington Press / Critical Role.

---

## Stack

| Área | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router, React 19, TypeScript) |
| Estilos | **Tailwind CSS v4** con tokens `@theme` personalizados |
| i18n | **react-i18next** (EN / ES, detección automática) |
| PWA | **Serwist** (`@serwist/next`) + Web App Manifest + offline |
| Auth | Usuario + PIN — sessions firmadas con `jose` (JWT) |
| Base de datos | **Firebase Firestore** (Admin SDK server-side, sin SDK cliente) |
| Deploy | **Vercel** → **grimheart.co** vía GitHub Actions |

---

## Funcionalidades implementadas

- **Autenticación** — registro y login con usuario/PIN (sin email), sessión persistente firmada
- **Wizard de creación** (8 pasos) — Identidad → Clase/Subclase → Ascendencia/Comunidad → Rasgos → Cartas de Dominio → Equipamiento → Trasfondo → Revisión
- **Hoja de personaje** — banner con arte de clase, stats, rasgos, cartas de dominio con ilustraciones individuales del CoreBook, equipo y experiencias
- **Subida de nivel** — flujo guiado con logros automáticos (L2/5/8) y 7 tipos de avance (rasgos, PV, estrés, evasión, competencia, experiencias, carta de dominio)
- **Wiki** — búsqueda + filtros por categoría (Ascendencia, Comunidad, Clase, Dominio, Equipamiento, Reglas) con ilustraciones del CoreBook
- **Arte del CoreBook** — ilustraciones extraídas directamente del PDF oficial para clases, ascendencias, comunidades, dominios y cartas individuales
- **Diseño mobile-first** — PWA instalable, safe-areas, animaciones rápidas (`dh-rise`, `dh-sheet`)

---

## Puesta en marcha

```bash
git clone https://github.com/andresmancilla08/GrimHeart.git
cd GrimHeart
npm install
cp .env.example .env.local   # rellena las variables
npm run dev                  # http://localhost:3000  (usa --webpack, no Turbopack)
```

### Variables de entorno

```env
# Firebase Admin SDK (service account)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Sesiones (string aleatorio ≥ 32 chars)
SESSION_SECRET=genera-uno-con-openssl-rand-base64-32
```

> **Nota:** El `CoreBook.pdf` y `corebook.txt` son gitignored (175 MB). Son necesarios solo para extraer arte nuevo. La app funciona sin ellos.

---

## Estructura

```
src/
  app/
    (auth)/login|register/   # Autenticación (username + PIN)
    characters/
      page.tsx               # Lista de personajes del usuario
      new/page.tsx           # Wizard de creación
      [id]/page.tsx          # Hoja de personaje
    wiki/page.tsx            # Wiki con buscador
    page.tsx                 # Home (módulos)
    globals.css              # Tokens Tailwind v4 (@theme)
    sw.ts                    # Service worker (Serwist)
  components/
    AppHeader.tsx            # Header principal (sticky, safe-area)
    SubHeader.tsx            # Header interior (← volver + logo/acción)
    HomeContent.tsx          # Home con módulos
    CharacterSheetClient.tsx # Hoja de personaje (banner, stats, cartas)
    CharacterPageClient.tsx  # Wrapper con CTA "Subir Nivel"
    CharacterListClient.tsx  # Lista + CTA "Crear personaje"
    LevelUpFlow.tsx          # Flujo de subida de nivel (5 pasos)
    WikiContent.tsx          # Wiki: buscador + filtros + grid de cards
    wizard/
      CharacterWizard.tsx    # Orquestador del wizard (8 pasos)
      Step*.tsx              # Un componente por paso
    ui/
      AppDialog.tsx          # Dialogo de confirmación (bottom-sheet)
      BottomSheet.tsx        # Sheet genérico desde abajo
  lib/
    auth/                    # Sessions JWT (jose)
    characters/actions.ts    # Server actions (createCharacter, levelUp…)
    daggerheart/
      types.ts               # Character, TraitKey, etc.
      reference.ts           # Listas canónicas del juego
      classes.ts             # Definición de clases y subclases
      equipment.ts           # Armas y armaduras
      cards.ts               # Cartas de dominio
  i18n/
    locales/en.json          # Traducciones inglés
    locales/es.json          # Traducciones español
public/
  art/
    *.jpg                    # Arte de clases (extraído del CoreBook)
    ancestry/*.jpg           # Arte de ascendencias
    community/*.jpg          # Arte de comunidades
    domains/*.jpg            # Arte de dominios
    cards/*.jpg              # Arte individual de cartas de dominio (27 cartas)
  logo-sm.png
  manifest.webmanifest
.github/
  workflows/deploy.yml       # CI/CD → Vercel (push a main/master)
```

---

## Deploy

El deploy es automático vía **GitHub Actions** en cada push a `main` o `master`.

```
git push main
  → GitHub Actions
    → vercel pull --environment=production   (env vars desde Vercel)
    → vercel build --prod
    → vercel deploy --prebuilt --prod
      → grimheart.co ✓
```

**Secrets necesarios en GitHub** (`Settings → Secrets → Actions`):

| Secret | Dónde obtenerlo |
|---|---|
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` tras `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` tras `vercel link` |

**DNS en GoDaddy** (`grimheart.co`):

| Tipo | Nombre | Valor |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

---

## Modelo de Daggerheart

La hoja de personaje se compone de:

1. **Ancestry** (ascendencia) — 18 opciones
2. **Community** (comunidad) — 9 opciones
3. **Class** (clase) — 9: Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard
4. **Subclass** — Foundation → Specialization → Mastery
5. **Traits** (6): Agility, Strength, Finesse, Instinct, Presence, Knowledge
6. **Domain Cards** — loadout activo de 2 cartas de los 9 dominios (Arcana, Blade, Bone, Codex, Grace, Midnight, Sage, Splendor, Valor)
7. **Equipment** — arma primaria/secundaria (15 físicas + 10 mágicas), armadura
8. **Experiences** — 2 experiencias con modificador
9. **Niveles 1–10** en 4 tiers → cada nivel desbloquea logros y 2 avances a elegir

---

## Licencia

Código bajo licencia MIT. El contenido de juego (reglas, nombres, ilustraciones del CoreBook) pertenece a Darrington Press y se usa conforme a la **DPCGL**. Ver <https://www.daggerheart.com/>.
