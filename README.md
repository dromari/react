# Pokédex App

A robust Pokémon encyclopedia application built with **React 18**, **Class Components**, and **TypeScript**. This project demonstrates the core principles of React without using Hooks, focusing on state management, lifecycle methods, and error handling.

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
- **Production Preview:** `npm run preview` (Recommended for final verification)

---

## 🛠 Features & Verification Guide

### 1. Application Layout & UI

- The interface is divided into a **Search Bar** and a **Results Area**.
- Each Pokémon card displays: **Name**, **Icon**, and **Pokedex Data** (Type, Weight, Height, and Abilities).

### 2. Search Logic & Persistence

- **Execution:** Search is triggered by the "Search" button or the **Enter** key.
- **Validation:** Search terms are automatically **trimmed**. Redundant API calls are prevented if the term hasn't changed.
- **LocalStorage:** The search term is saved to `localStorage`. Upon page reload, the app automatically restores the last search.

### 3. Data Fetching & Loading

- **Initial Load:** Fetches 20 Pokémon on the first visit or uses the saved term from `localStorage`.
- **Loading State:** A **"SYSTEM SCANNING..."** indicator is displayed during all API requests.

### 4. Advanced Error Handling

- **Scenario Handling:**
  - If a Pokémon is not found (404), a **"NO DATA FOUND"** message is shown.
  - If the server fails (4xx/5xx), a **"DATABASE ERROR"** banner appears with the specific status code and message.
- **Clean Console:** All API errors are caught at the component level. The console remains free of "Uncaught" JS errors.

### 5. Error Boundary

- **Trigger:** Click the **"TEST"** button to simulate a critical UI crash.
- **Fallback UI:** Displays a "System Error" screen with a **"Reboot System"** option to restore the app.
- **Note:** To verify the "Clean Console" requirement during a crash, please run `npm run preview`.

---

## 🧪 Unit Testing & Code Coverage

The application is covered by a suite of unit tests, ensuring reliability across all individual components and services.

### Test Stack

- **Vitest:** Testing framework (chosen as a modern alternative to Jest).
- **React Testing Library:** For component-level unit testing.
- **MSW (Mock Service Worker):** To mock all API responses (as required by Feature 4).
- **JSDOM:** Browser environment simulation.

### Coverage Statistics

The project achieves **100% statement coverage** across all source files

## ✅ Test Scenarios Coverage (Technical Compliance)

### 1. Search Component Tests

- **Rendering:** Verified that the search input and button render correctly.
- **LocalStorage Integration:** Tests confirm that the app retrieves the saved term on mount and overwrites it when a new search is performed.
- **User Interaction:** Verified that the input updates on typing and the search callback is triggered with a **trimmed** value.

### 2. Results & CardList Tests

- **Data Display:** Confirmed that the component renders the correct number of items and displays Pokémon names and descriptions.
- **Loading State:** Verified that the **"SYSTEM SCANNING..."** indicator is visible during API calls.
- **Empty State:** Implemented a scenario for empty data arrays, verifying the "NO DATA FOUND" message.
- **Error Handling:** Tested responses with **4xx** and **5xx** status codes via MSW to ensure correct error banners are shown.

### 3. Item & Loading Components

- **Card Rendering:** Verified that Pokémon names, descriptions, and images are displayed.
- **Graceful Degradation:** Added a test for missing images, ensuring the **"?" placeholder** is rendered.
- **Loading Indicator:** Verified the visibility of the loading UI based on the `isLoading` state.

### 4. Error Boundary Tests

- **Crash Recovery:** Verified that the `ErrorBoundary` catches JavaScript errors in child components and displays the fallback UI.
- **Manual Trigger:** Tested the **"TEST"** button functionality to ensure it successfully triggers the boundary.

### 5. Main App & Integration Tests

- **State Management:** Confirmed that `App.tsx` manages the `searchTerm` state correctly and passes it down to children.
- **API Integration:** Verified that the initial API call is made on mount and handles both successful and failed responses.
- **Persistence:** Ensuring seamless interaction between `App` state and `localStorage`.

---

### Test Commands

- **Run Tests:** `npm run test`
- **Coverage Report:** `npm run test:coverage`

### Automation

- **Husky Integration:** A `pre-push` hook is configured to automatically run the coverage suite. Pushing code is blocked if tests fail or coverage drops below the defined thresholds (80% statements, 50% others).

---

## 📐 Technical Requirements Compliance

### Strict RS School Standards

- **No Hooks:** Zero usage of `useState`, `useEffect`, etc. Only Class Components and lifecycle methods are used.
- **Strict TypeScript:** No `any` types or `@ts-ignore`. All data structures and props are strictly interfaced.
- **Architecture:**
  - Logic is decomposed into specialized modules.
  - Test utilities and mocks are organized in a separate `src/__tests__` directory.
- **Clean Code:** No commented-out code, no direct DOM manipulation (`innerHTML`), and no unnecessary `console.log` statements.
- **Linting:** `npm run lint` passes without any errors or warnings.

---

## ⚙️ Tech Stack

- **React 18** (Class Components)
- **TypeScript** (Strict Mode)
- **Vite** (Build Tool)
- **Vitest & MSW** (Testing)
- **CSS Modules** (Scoped Styling)
- **PokeAPI** (Data Source)
