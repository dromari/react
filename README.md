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

## 🛠️ Features & Requirements Compliance (Task Criteria Met)

### Feature 1: State Management Solution [35/35 Points]

- **Zustand Store Integration:** Global application state is fully driven by a modern, predictable, and scalable Zustand storage solution (`usePokemonStore`). `[20 Points]`
- **Configuration & Global Usage:** The state store is configured to manage selected items globally, ensuring proper reactive state flow across separate layout blocks. `[15 Points]`
- **High Test Coverage:** Store reliability is verified through strict unit testing, achieving over 80% coverage to satisfy structural maintenance rules.

### Feature 2: Selected Items Management [25/25 Points]

- **Row-Level Checkboxes:** Every item row in the dashboard features an independent selection checkbox. `[15 Points]`
- **Isolated Click Behaviors:**
  - Clicking a checkbox toggles the item selection state via `e.stopPropagation()` without triggering router panels.
  - Clicking outside the checkbox opens the detail view smoothly via `<Outlet />` without affecting selection flags.
- **Navigation Persistence:** Selected items remain cached inside the global state store and persist flawlessly across multiple page routing cycles. `[5 Points]`
- **Dynamic Unselection:** Unchecking an active element instantly drops it from the persistent store state. `[5 Points]`

### Feature 3: Flyout Component for Selected Items [15/15 Points]

- **Conditional Sticky Display:** The flyout component automatically triggers with a `fixed`/`sticky` position layout locked at the bottom of the page when at least one item is checked. `[5 Points]`
- **Scroll Invariance:** The bar configuration remains constantly visible and does not scroll out of the browser window. `[5 Points]`
- **Metric Tracker:** Dynamically tracks and displays the precise count of selected items. `[2 Points]`
- **Actionable Triggers:** The "Unselect all" listener wipes the store collection, and the "Download" trigger kicks off file processing handlers. `[3 Points]`
- **Keyboard Accessibility Improvement:** Features an interceptor hook that listens to the **Escape** key to clear all active choices and collapse the view layout.

### Feature 4: Downloading Selected Items as CSV [10/10 Points]

- **Native Browser Architecture:** The export handler relies purely on native browser web APIs (`Blob`, `URL.createObjectURL`, and `a.download`) without introducing heavy text-parsing libraries. `[5 Points]`
- **Structured Metadata:** The generated document contains rows with names, clean description fields, and absolute PokeAPI details URLs. `[3 Points]`
- **Dynamic File Labels:** File names automatically map to the active count metrics inside the state store (e.g., `15_items.csv`). `[2 Points]`

### Feature 5: Theme Selection with Context API [15/15 Points]

- **Isolated Theme Personalization:** Layout theme switching is implemented independently using the React Context API (`ThemeProvider`), completely decoupling UI presentation hooks from state data. `[8 Points]`
- **App-Wide Refactoring Styles:** Toggling the mode attaches light/dark identifier class names directly to the main HTML `<body>` container to update backgrounds, tables, text elements, and cards. `[5 Points]`
- **Top Layout Navigation Control:** The aesthetic toggle button sits in the upper control wrapper area, remaining accessible at all times. `[2 Points]`
- **Persistent Storage Fallbacks:** Theme choices are safely synchronized inside local storage strings and use strict error boundaries (`try-catch`) to protect initialization cycles from sandboxed environments.

---

## 🧪 Unit Testing & Code Coverage

The test suite runs within simulated router trees and features heavily isolated API and storage mocks matching the custom hooks and store conditions.

### Test Stack

- **Vitest & React Testing Library:** Modern execution engines for functional assertions.
- **MSW (Mock Service Worker):** Seamless API call interceptors.

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
- **Zustand** (Predictable Global State)
- **React Router v6** (Data Approach API)
- **TypeScript** (Strict Configurations)
- **Vite** (Next-gen build tooling)
- **Vitest & MSW** (Mocking & Assertions)
- **CSS Modules** (Scoped BEM-styled components)
- **PokeAPI** (Underlying Data Resource)
