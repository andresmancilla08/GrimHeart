# DHApp — Hojas de personaje de Daggerheart

PWA para crear y gestionar hojas de personaje de **[Daggerheart](https://www.daggerheart.com/)**
(el TTRPG de Darrington Press). Cada usuario crea su cuenta, arma sus personajes eligiendo
clase, subclase, ascendencia (_ancestry_), comunidad (_community_), dominios, cartas, trasfondo
y equipamiento, y los sube de nivel desbloqueando las opciones que correspondan a cada nivel.

Interfaz cuidada, inspirada en la estética del propio juego, con soporte bilingüe **inglés / español**.

> ⚠️ Proyecto no oficial. Daggerheart™ es propiedad de Darrington Press. Este software usa
> contenido del **System Reference Document (SRD)** bajo la **Darrington Press Community Gaming
> License (DPCGL)**. No está afiliado ni respaldado por Darrington Press / Critical Role.

---

## Stack

| Área            | Tecnología                                                |
| --------------- | --------------------------------------------------------- |
| Framework       | **Next.js 16** (App Router, React 19, TypeScript)         |
| Estilos         | **Tailwind CSS v4**                                       |
| i18n            | **next-intl** (sin routing por URL, locale en cookie)     |
| PWA             | **Serwist** (`@serwist/next`) + Web App Manifest          |
| Auth + datos    | **Supabase** (Auth + Postgres con RLS por usuario)        |
| Deploy          | **Vercel**                                                |

Pendientes de añadir cuando empiece la UI del builder: `framer-motion` (animaciones),
`zustand` (estado del creador de personaje), `zod` + `react-hook-form` (validación),
`shadcn/ui` (componentes).

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellena las claves de Supabase
npm run dev                  # http://localhost:3000
```

### Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Estructura

```
src/
  app/
    layout.tsx          # NextIntlClientProvider + metadata/manifest PWA
    page.tsx            # landing
    sw.ts               # service worker (Serwist)
  components/
    LocaleSwitcher.tsx  # cambio EN/ES
  i18n/
    config.ts           # locales soportados (en, es)
    request.ts          # getRequestConfig (locale desde cookie)
    locale.ts           # server actions get/set locale
  lib/
    supabase/           # clientes browser + server
    daggerheart/
      types.ts          # modelo de personaje
      reference.ts      # listas canónicas del SRD (clases, dominios, etc.)
messages/
  en.json  es.json      # traducciones
public/
  manifest.webmanifest
```

---

## Modelo de Daggerheart (resumen)

La hoja de personaje se compone de cinco piezas que se eligen al crear:

1. **Ancestry** (ascendencia / "raza") — 18 opciones, otorga 2 rasgos de ascendencia.
2. **Community** (comunidad / origen) — 9 opciones, otorga 1 rasgo de comunidad.
3. **Class** (clase) — 9: Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard.
4. **Subclass** (subclase) — Foundation → Specialization → Mastery.
5. **Domains** (dominios) — cada clase usa 2 de los 9: Arcana, Blade, Bone, Codex, Grace,
   Midnight, Sage, Splendor, Valor. De ahí se roban las **domain cards** (habilidades y conjuros).

Otros componentes de la hoja:

- **Traits** (6): Agility, Strength, Finesse, Instinct, Presence, Knowledge.
- **Stats derivados**: Evasion, HP, Stress, Hope, Armor Score, Proficiency, thresholds.
- **Domain cards**: _loadout_ activo (hasta 5) + _vault_ (reserva).
- **Experiences**, **trasfondo** (preguntas) y **connections**.
- **Equipamiento**: arma primaria/secundaria, armadura e ítems.
- **Niveles 1–10** en 4 _tiers_ (1 · 2-4 · 5-7 · 8-10) que abren las opciones de subida.

Las cifras de juego salen del SRD oficial: <https://www.daggerheart.com/srd/>

---

## Roadmap

- [x] Scaffold Next.js 16 + Tailwind + i18n (EN/ES) + PWA + Supabase
- [ ] Auth (registro / login con Supabase)
- [ ] Esquema Postgres + RLS para personajes por usuario
- [ ] Importar datos del SRD (clases, dominios, cartas, ascendencias, comunidades, equipo)
- [ ] Asistente de creación de personaje (5 pasos)
- [ ] Hoja de personaje interactiva (rasgos, HP/Stress/Hope, dados Hope & Fear)
- [ ] Selector de cartas de dominio (loadout / vault)
- [ ] Subida de nivel guiada por tier
- [ ] Iconos PWA + tema visual estilo Daggerheart

---

## Licencia

Código bajo licencia del repositorio. El contenido de juego pertenece a Darrington Press y se usa
conforme a la DPCGL. Ver <https://www.daggerheart.com/>.
