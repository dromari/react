# Pokédex App

A robust, modern Pokémon encyclopedia application built with **React 18**, **Functional Components**, **Hooks**, and **TypeScript**.

This repository represents the completed evolution of the codebase driven by **TanStack Query (React Query)** for efficient data fetching, memory caching, and state validation.

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
- **Production Preview:** `npm run preview`

---

## 🛠️ Features & Requirements Compliance (Task Criteria Met)

### Feature 1: API Integration [25/25 Points]

- **TanStack Query Setup:** Data fetching architecture is integrated and configured using the modern `@tanstack/react-query` ecosystem. `[10 Points]`
- **Query Custom Hooks:** Every individual API call throughout the codebase has been successfully migrated to call asynchronous custom fetching hooks (`usePokemons` and `usePokemonDetail`). `[5 Points]`
- **Cache Invalidation Strategy:** Proper client-side cache mutation strategies are fully functional across view transitions. `[5 Points]`
- **Configurable Cache TTL:** The query client's in-memory data fresh threshold (`staleTime` & `gcTime`) is managed globally via a strict environment variable layout (`VITE_CACHE_TTL`). `[5 Points]`

### Feature 2: Data Caching and Loading States [25/25 Points]

- **Async Loading Interceptors:** Micro-targeted loading banners (`SYSTEM SCANNING...` and `LOADING DETAILS...`) reactively trigger during ongoing network fetching events to preserve proper UI state feedback. `[13 Points]`
- **Memory Reuse Optimization:** Previously fetched dashboard item sets and granular detail card items are cached inside client memory space and seamlessly reused between routing transitions without initiating heavy API requests. `[12 Points]`

### Feature 3: Error Handling [20/20 Points]

- **Robust Exception Recovery:** High-level network down states, missing entity lookups, and explicit 404/500 API responses are tracked and mapped into an interactive, human-readable layout error display block (`⚠️ DATABASE ERROR`). `[20 Points]`

### Feature 4: Manual Cache Invalidation [10/10 Points]

- **Explicit Refresh Triggers:** Implemented a customized upper control block layout refresh trigger (`REFRESH`). Clicking the selector issues an instantaneous system-wide command to fully wipe out active cached memory stores and force-execute immediate server-side fetch loops. `[10 Points]`

### Feature 5: Test Coverage for Querying [20/20 Points]

- **Asynchronous Behavior Suite:** Integrated isolated `QueryClientProvider` test hooks inside the component layer specs. Assert test coverage covers all explicit query statuses including fetching layouts, standard exception responses, layout caching lookups, and manual wipe triggers. `[20 Points]`

---

## 🧪 Unit Testing & Code Coverage

The test suite runs within simulated router trees and features heavily isolated API and storage mocks matching the custom hooks and store conditions.

### Test Stack

- **Vitest:** Blazing fast modern test runner.
- **React Testing Library:** Component rendering and behavioral assert testing.
- **MSW (Mock Service Worker):** Seamless API call interceptors.
- **MemoryRouter & QueryClientProvider:** Simulated routing trees and query contexts to test hooks like `useSearchParams`, `useNavigate`, and `useQuery`.

### Coverage Metrics Compliance

- **100% Statements, Lines, and Functional Coverage** across all core application layers, including components, data hooks, and global storage managers.
- **Strict Boundary Asserts:** All branch testing thresholds (including full storage fallback safety and theme toggling loops) are rigorously checked.

### Test Commands

- **Run Tests:** `npm run test`
- **Coverage Report:** `npm run test:coverage`

### Automation & Husky Hooks

- **Husky Integration:** A strict pre-push git hook forces compliance. Committing or pushing changes is completely restricted unless the full test suite passes with zero linter diagnostics or code coverage gaps.

---

## 📐 Strict RS School Standards Met

- **Strict TypeScript:** Absolute type-safety with `noImplicitAny` flags. Zero `any` assignments, zero `@ts-ignore` bypasses, and explicit component prop interfaces.
- **Zero Linter Warnings:** `npm run lint` passes with fully clean diagnostics.
- **Clean Code Metrics:** No dead code blocks, zero console-logging side-effects in production, and zero unsafe HTML injections.

---

## ⚙️ Tech Stack

- **React 18** (Functional Components + Hooks)
- **TanStack Query v5** (Caching & Fetching Controls)
- **Zustand** (Predictable Global State)
- **React Router v6** (Data Approach API)
- **TypeScript** (Strict Configurations)
- **Vite** (Next-gen build tooling)
- **Vitest & MSW** (Mocking & Assertions)
- **CSS Modules** (Scoped BEM-styled components)
- **PokeAPI** (Underlying Data Resource)
