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

### 1. Application Layout & UI (Feature 1 & 3)

- The interface is divided into a **Search Bar** and a **Results Area**.
- Each Pokémon card displays: **Name**, **Icon**, and **Pokedex Data** (Type, Weight, Height, and Abilities).

### 2. Search Logic & Persistence (Feature 2, 5 & 6)

- **Execution:** Search is triggered by the "Search" button or the **Enter** key.
- **Validation:** Search terms are automatically **trimmed**. Redundant API calls are prevented if the term hasn't changed.
- **LocalStorage:** The search term is saved to `localStorage`. Upon page reload, the app automatically restores the last search.

### 3. Data Fetching & Loading (Feature 4 & 7)

- **Initial Load:** Fetches 20 Pokémon on the first visit or uses the saved term from `localStorage`.
- **Loading State:** A **"SYSTEM SCANNING..."** indicator is displayed during all API requests.

### 4. Advanced Error Handling (Feature 8)

- **Scenario Handling:**
  - If a Pokémon is not found (404), a **"NO DATA FOUND"** message is shown.
  - If the server fails (4xx/5xx), a **"DATABASE ERROR"** banner appears with the specific status code and message.
- **Clean Console:** All API errors are caught at the component level. The console remains free of "Uncaught" JS errors.

### 5. Error Boundary (Feature 9)

- **Trigger:** Click the **"TEST"** button to simulate a critical UI crash.
- **Fallback UI:** Displays a "System Error" screen with a **"Reboot System"** option to restore the app.
- **Note:** To verify the "Clean Console" requirement during a crash, please run `npm run preview`.

---

## 📐 Technical Requirements Compliance

### Strict RS School Standards

- **No Hooks:** Zero usage of `useState`, `useEffect`, etc. Only Class Components and lifecycle methods are used.
- **Strict TypeScript:** No `any` types or `@ts-ignore`. All data structures and props are strictly interfaced.
- **Code Quality:**
  - **No "God" Components:** Logic is logically decomposed into specialized modules.
  - **No Props Drilling:** Efficient data flow from `App` to child components.
  - **No Direct DOM Manipulation:** No usage of `innerHTML` or `appendChild`.
  - **Clean Code:** No commented-out code or unnecessary `console.log` statements.
- **Linting:** `npm run lint` passes without any errors or warnings.

---

## ⚙️ Tech Stack

- **React 18** (Class Components)
- **TypeScript** (Strict Mode)
- **Vite** (Build Tool)
- **CSS Modules** (Scoped Styling)
- **PokeAPI** (Data Source)
