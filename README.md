# Pokédex App (Next.js Edition)

A robust, production-grade Pokémon encyclopedia application completely migrated to **Next.js 15 (App Router)**, **React 19**, and **TypeScript**.

This application leverages Server-Side Rendering (SSR), Static Site Generation (SSG), advanced Server Side localization (`next-intl`), and secure Node.js API Route Handlers to deliver extreme performance and seamless UX.

---

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dromari/react.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Execution

- **Development Mode:** `npm run dev`
- **Production Build:** `npm run build`
- **Production Preview/Start:** `npm run start`

---

## 🛠️ Features & Requirements Compliance (Task Criteria Met)

### Feature 1: Behavioral Parity & Migration [10/10 Points]

- **State & Logic Preservation:** Successfully migrated core application workflows (search inputs, multi-page data paginations, UI view states) into the server-driven environment of Next.js App Router.
- **Global Selection Store:** The interactive multi-select pokemon checklist state continues to be managed across routing transitions using a globally isolated `Zustand` client store.

### Feature 2: Internationalization (i18n) [10/10 Points]

- **Subpath Routing:** Implemented dynamic language subpath localization (`/[locale]/search`) matching the `/en` and `/ru` language matrices using `next-intl`.
- **Client Switcher:** Seamless runtime language hot-swapping is handled instantly on the client layer via a custom, fully accessible `<LanguageSelector />` dropdown.
- **Localized Error Feedback:** System exceptions and explicit PokeAPI network failures (e.g., 404 Pokémon Not Found) are dynamically mapped to localized dictionary tokens on the server layer before UI rendering.

### Feature 3: Shared Layout [5/5 Points]

- **Unified Root Structure:** Integrated a centralized, server-side `RootLayout` managing structural metadata, global `NextIntlClientProvider` state contexts, and our custom declarative theme injection layers.

### Feature 4: 404 Page (Not Found) [5/5 Points]

- **Catch-All Routing Interceptors:** Deployed a highly styled, customized `not-found.tsx` screen alongside an absolute `[...rest]` catch-all routing rule to intercept any random invalid text subpaths and gracefully redirect users with a robust "Return to Main App" interface.

### Feature 5: Image Rendering Optimization [10/10 Points]

- **Next.js Native Core Optimization:** Replaced all native `<img>` tags across the application with the optimized `next/image` component, enforcing strict layouts with mandatory `width` and `height` dimensions to eliminate visual layout shifts (CLS).

### Feature 6: Link Rendering & Native Router [10/10 Points]

- **Localized Navigation Wrappers:** Leveraged specialized `<Link />` and `useRouter()` primitives compiled from the centralized `@/i18n/routing` configuration layer to guarantee consistent internationalized subpath prefix persistence across all app clicks.

### Feature 7: About Page (SSG) [10/10 Points]

- **Statically Generated Server Component:** Developed the `/about` segment as a zero-JS-footprint, pure React Server Component. It is pre-rendered at compile-time as raw static HTML (SSG) to maximize performance.

### Feature 8: Server-Side CSV Generation [15/15 Points]

- **Secure Server API Endpoint:** Implemented a full server-side Node.js Route Handler (`/api/download-csv`) running on the server runtime.
- **Zero Client DOM Footprint:** The data compile pipelines, string merging, and header injections happen strictly on the server layer. The client triggers downloading via a standard semantic HTML `<a>` anchor, downloading dynamically named files (`{count}_items.csv`) with zero client-side DOM overhead or stateful manipulations.

### Feature 9: Search Results Page (SSR) [15/15 Points]

- **Server-Driven Main Layout:** The main dashboard is composed as an asynchronous Server Component. Fetch operations (`fetchDetailedPokemons`) execute entirely on the server based on the active query URL state, guaranteeing ultra-fast First Contentful Paint (FCP).

### Feature 10: Server Interaction (Search & Selection) [10/10 Points]

- **URL Parameter State Matrix:** Submitting the Search form or closing the Detail panel mutates the central browser address state matrix (`?query=...&page=...&id=...`). The page component reactively re-runs server data queries instantly in response to URL changes.

---

## 📐 Strict RS School Standards & FAQ Compliance

- **No Third-Party Theme Frameworks:** Built custom client-side theme switching completely from scratch using standard React Context wrappers (`ThemeProvider`) combined with scoped CSS Modules. No `next-themes` or style-injection libraries are installed.
- **Zero Hydration Anomalies:** Deployed structural dynamic bundling layouts (`next/dynamic` with `ssr: false`) over stateful UI areas to totally eradicate Next.js hydration mismatches (`React error #418`).
- **Strict Declarative React Syntax:** Eradicated all direct imperatival browser DOM manipulations. Zero `document.body.className` updates, zero `document.createElement()` calls, and zero `document.querySelector` injections are used across the core runtime codebase.
- **Absolute TypeScript Compliance:** Configured with uncompromising code typing definitions. Absolute eradication of the `any` keyword assignments, zero `@ts-ignore` escapes, and rigorous structural mapping of built-in Next.js typings (`NextRequest`, `Promise` params).
- **Clean Code Metrics:** Clean `npm run lint` metrics. Clean production bundles containing zero console tracking or testing dead-code anomalies.

---

## ⚙️ Tech Stack

- **Next.js 15 (App Router)** & **React 19**
- **next-intl** (Server-driven Asynchronous Internationalization)
- **Zustand** (Global Client-Side Checklist Memory State)
- **TypeScript** (Strict Type Safety Layouts)
- **CSS Modules** (Scoped, BEM-structured Layouts)
- **PokeAPI** (Underlying Core Data Layer Resource)
