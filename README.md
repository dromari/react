# Pokédex App

A robust, modern Pokémon encyclopedia application built with **React 18**, **Functional Components**, **Hooks**, and **TypeScript**.

This repository represents the completed evolution of the codebase from an initial Class-based implementation into a modern, state-of-the-art Single Page Application (SPA) driven by **React Router (Data Approach)**, comprehensive URL synchronization, and server-side pagination.

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
- **Production Preview:** `npm run preview` (Highly recommended for verifying routing and 404 behavior locally)

---

## 🛠 Features & Requirements Compliance (Task Scenarios)

### Feature 1: Pagination

- **Scenario: Paginated Results with URL Synchronization**
  - **Given** I am viewing the Pokémon list inside the Pokédex,
  - **When** I navigate to a different page using the pagination controls (`◀ PREV` / `NEXT ▶`),
  - **Then** the current page is displayed instantly in the URL as a query parameter (e.g., `?page=2`),
  - **And** the pagination controls dynamically reflect the current page sequence (`PAGE X OF Y`),
  - **And** pagination interfaces appear strictly after the list of items is fully loaded from the API,
  - **And** when changing the input query in the search bar, the active page resets to `1` and the URL updates accordingly.

---

### Feature 2: Master-Detail View (45 Points)

- **Scenario: Split View with Details Panel**
  - **Given** I am on the main page displaying the Pokémon search results,
  - **When** I click on any specific Pokémon row,
  - **Then** the page smoothly splits into two distinct sections:
    - The **left section** continues to stably show the search results list, maintaining its current scroll and page tracking.
    - The **right section** displays the granular Pokémon details using React Router `<Outlet>`.
  - **And** a custom blinking loading indicator is displayed inside the card frame while detailed information is being fetched.
  - **And** there is a close control button (`✖`) inside the panel to hide the details section,
  - **And** by default, no item is selected when the page first loads, keeping the details panel hidden and rendering the search list in full-width layout (`100%`) to prevent Cumulative Layout Shift (CLS),
  - **And** the URL precisely reflects both the current page query and the selected item path simultaneously (e.g., `/pokemon/bulbasaur?page=2`).

---

### Feature 3: Search Logic & LocalStorage Persistence

- **Scenario: Persistent Form Invocations**
  - **Given** I am typing a query inside the Search input,
  - **When** I submit the form via the "Search" button or the **Enter** key,
  - **Then** the search text is automatically **trimmed** to clean up whitespaces,
  - **And** the search text is cached into the browser's `localStorage` via a custom `useLocalStorage` state lifecycle hook,
  - **And** redundant, duplicate API calls are completely blocked if the input value has not changed,
  - **And** upon subsequent application mount cycles, the query text is automatically extracted from storage to immediately re-populate the input field and trigger the corresponding dataset loading.

---

### Feature 4: Routing Exceptions & Error Boundaries

- **Scenario: Unknown Routes & Out-of-Bounds Queries**
  - **Given** I navigate to a non-existing route, or manually input alpha characters/out-of-bounds metrics inside the `?page=` URL parameter,
  - **When** the route or URL query format does not match any valid data constraints defined within the application,
  - **Then** I see an independent, standalone **404 Page** completely replacing the standard Pokédex layout, displaying a clear message indicating the requested resource was not found,
  - **And** a clear, programmatic link button is provided to return instantly back to the main application root.

---

## 🧪 Unit Testing & Code Coverage

The test suite has been completely upgraded to run within simulated router contexts, featuring heavily isolated API mocks matching the paginated data structures.

### Test Stack

- **Vitest:** Blazing fast modern test runner.
- **React Testing Library:** Component rendering and behavioral assert testing.
- **MSW (Mock Service Worker):** Seamless API call interceptors.
- **MemoryRouter:** Simulated routing trees to test hooks like `useSearchParams` and `useNavigate`.

- **100% Statements Coverage** across all core application code (`App.tsx`, `ResultsContainer.tsx`, `PokemonDetails.tsx`, `About.tsx`, `NotFound.tsx`).
- **100% Functional Coverage** inside logic branches, including all boundary conditions, fallback images, and mock `window.location.reload` states.

### Test Commands

- **Run Tests:** `npm run test`
- **Coverage Report:** `npm run test:coverage`

### Automation

- **Husky Integration:** A strict pre-push git hook forces compliance. Committing or pushing changes is completely restricted unless the full suite passes without any trailing linter warnings or coverage drops.

---

## 📐 Strict RS School Standards Met

- **Strict TypeScript:** Compiled under absolute strict parameters. No `any` type assignments, no `@ts-ignore` flags, and strict component props definitions.
- **No Linter Warnings:** `npm run lint` passes with completely clean diagnostics.
- **Clean Code Rules:** Zero dead code chunks, no leftover console logging scripts, and zero innerHTML or unescaped injection methods.

---

## ⚙️ Tech Stack

- **React 18** (Functional Components + Hooks)
- **React Router v6** (Data Approach API)
- **TypeScript** (Strict Configurations)
- **Vite** (Next-gen build tooling)
- **Vitest & MSW** (Mocking & Assertions)
- **CSS Modules** (Scoped BEM-styled components)
- **PokeAPI** (Underlying Data Resource)
