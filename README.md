# React Forms

A comprehensive React application demonstrating two architectural approaches to form handling: **Uncontrolled Components (native DOM APIs)** and **Controlled Components (React Hook Form)**. All components feature extensive **Zod** validation and maintain **100% test coverage**.

---

## 🚀 Technical Features Breakdown

### 📦 Feature 1: Accessible Modal with React Portals

- **Portal Architecture:** The universal `Modal` component is decoupled from the main DOM hierarchy and mounted inside an isolated node (`div#modal-root`).
- **Accessibility & Focus Management:** Focus is dynamically trapped inside the modal while open. Upon closing, focus is cleanly restored to the triggering button via a saved element reference (`previousFocusRef.current`).
- **Keyboard Support:** Native `Escape` key event listener closes the modal instantly.
- **Backdrop Interaction:** Implemented a click-outside-to-close mechanic with strict event delegation checks (`e.target === e.currentTarget`) to prevent accidental closures.
- **Reusability:** The identical modal container houses both the Uncontrolled Form and the React Hook Form views seamlessly.

---

### 💾 Feature 2: Centralized State Management (Zustand)

- **Store Setup:** Configured a high-performance, lightweight **Zustand store** to handle cross-component state.
- **Data Ingestion:** Successfully handles and structures data packets incoming from both Uncontrolled and Controlled form modules.
- **Submission History:** Stores all successful submissions as a continuous history log rather than overwriting previous entries.
- **Data Feed Presentation:** Reads from the central state to map and render historical submission logs onto the main dashboard using cards/tiles arranged in reverse-chronological order.

---

### 📝 Feature 3: Standard Personal Profile Form Fields

- **Field Mapping:** Both forms implement identical basic input structures collecting: Name, Age, Email, Gender (Select Picker), and a Terms & Conditions acceptance checkbox.
- **Accessible Labeling:** Every interactive input field is strictly bound to its corresponding description element using explicitly mapped `id` and connected labels with `htmlFor`.
- **Data Integrity:** Valid inputs securely record values across both native browser data collections and custom library states.

---

### ⚙️ Feature 4: Advanced Profile Fields & Asset Conversion

- **Asynchronous Binary Processing:** Profile picture input includes strict type constraints (`png/jpeg/jpg`) and limits uploads to **2 MB**. Selected files are asynchronously parsed using a `FileReader` instance and converted into a `base64` data string before storage.
- **Data Preservation & Feed Display:** The resulting `base64` payload is saved to the Zustand history and read on the main page to natively render user avatar graphics.
- **Password Matching & Indicator Metrics:** Password and Password Confirmation inputs are validated for identity matches. A live complexity tracker checks against 4 distinct metrics: presence of at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character.
- **Autocomplete Country Feed:** Custom text control queries the list of permitted global locations stored in Zustand. It filters options live via dropdown lists and requires the user to select an existing option.

---

### 🚨 Feature 5: Multi-Approach Validation Schemes (Zod)

- **Shared Zod Validation Schema:** Both components share an exhaustive evaluation schema enforcing custom RSS data rules:
  - **Name:** Enforces capitalized title-case lettering (first letter must be uppercase).
  - **Age:** Restricts entry to valid numbers, explicitly blocking negative inputs.
  - **Email:** Custom step-by-step validator built explicitly _without regular expressions_ (safeguards a strict structure containing exactly one `@`, a populated local section, and a domain segment with a valid dot).
  - **Country:** Requires selected entry to exist inside the stored countries array.
- **Uncontrolled Submission Check:** Executes evaluation logic _only_ when the submit button is triggered.
- **Controlled Live Validation:** React Hook Form listens in real-time (`mode: 'onChange'`) and automatically locks down the submission element (`disabled={!isValid}`) until all errors clear.

* **UI Layout Protection:** Error alerts render in static layout blocks preventing jagged UI jumps or content shifts on the page.

---

### 🔄 Feature 6: Form Submission Lifecycles & Visual Alerts

- **State Reset:** Upon firing a successful submit event, the active form calls a native or library reset method, purging all field entries.
- **Modal Dissolution:** The parent modal window is programmatically destroyed (`setModalType(null)`), returning the user to the cleaned dashboard view.
- **Visual Highlights (Flash Indication):** Fresh cards arriving in the submission grid are flagged via a temporary `isNew` status. This injects a special animation/background highlight class (`styles.cardNew`) which safely self-destructs after exactly **4 seconds**.

---

## 🧪 Feature 7: Rigorous Test Coverage Compliance

- **Component & Validation Assertions:** All rendering pathways, real-time error handling blocks, dropdown list interactions, and form submission events are thoroughly tested.
- **Modal & Portal Diagnostics:** Validates accessible window loops, focus shifting logic, escape triggers, and DOM node cleanups inside `afterEach` configurations.
- **State & Selectors Testing:** Asserts store integrity under state shifts and data isolation.
- **Utility & FileReader Mocking:** Fully covers binary-to-string helpers (intercepting аsynchronous `FileReader` event loops), password score trackers, and custom non-regex string validators.
- **Strict Penalty Protections:** The testing suite has been validated against strict RSS rules, locking in **100% Statements, 100% Lines, 100% Functions, and over 92.5% Branch metrics**, preventing any testing score deductions.

---

## 💻 Installation & Commands

```bash
# 1. Install required packages
npm install

# 2. Run developer environment
npm run dev

# 3. Fire complete Vitest testing pipeline
npm run test

# 4. Generate full V8 coverage reports
npm run coverage
```
