
# Chat Details Panel Feature

This document describes the "Product & Customer Details" panel integrated into the Customer Communication (Chat) tab.

## Feature Overview

When a service center agent views a conversation, they can now open a right-side details panel to view comprehensive information about the customer and the product related to the conversation, along with a history of past queries and the ability to add private notes.

**Key functionalities:**

-   **Product Details:** Displays product image, name, SKU, model, purchase date, warranty status, attachments (manuals/photos), and quick actions (create ticket, schedule pickup).
-   **Customer Details:** Shows customer avatar, full name, contact information (phone, email), address, account creation date, subscription/plan, loyalty points, last order, verification status, and quick actions (call, email, view account).
-   **Query History:** Presents previous support requests and notes for the specific customer and product, including timestamps, agent names, and tags. Agents can also add private notes to the history.

## Integration with Chat UI

-   **Toggle Button:** A "Details" button (info icon) is available in the conversation header of the `ChatPage.tsx`. Clicking this button toggles the visibility of the details panel.
-   **Keyboard Shortcut:** The details panel can also be toggled using the `D` key when the message composer is focused. The `Esc` key closes the panel.
-   **Responsiveness:**
    -   On **desktop**, the details panel appears as a fixed right-side column (`w-96`).
    -   On **mobile**, the panel opens as a `Sheet` (drawer) from the right, occupying most of the screen width.

## Data Layer (Mock vs. Real Backend)

The feature is designed to be flexible with its data source. By default, it uses a mock adapter for demonstration purposes.

### Mock Adapter (`src/features/chat/DetailsPanel/mockDetailsAdapter.ts`)

This file provides mock data for products, customers, and query history. It simulates API delays to mimic real-world network conditions. It also includes mock implementations for `fetchDetails` and `addPrivateNote`.

### Switching to a Real Backend

To integrate with a real backend (e.g., Supabase or a custom REST API), you would modify the `src/features/chat/useDetails.ts` hook:

1.  **Update `useDetails.ts`:**
    -   Modify the `fetchDetails` and `addPrivateNote` calls within `useDetails.ts` to interact with your actual API endpoints instead of `mockDetailsAdapter.ts`.
    -   You might need to import your Supabase client or API service into `useDetails.ts`.
    -   Ensure your API returns data conforming to the `Product`, `CustomerDetails`, and `Query` interfaces defined in `mockDetailsAdapter.ts` (or update these interfaces to match your API's response).

2.  **Environment Variables:** If your real backend requires API keys or URLs, ensure they are configured as environment variables (e.g., in your `.env` file) and accessed securely within your application.

## Running Locally

1.  **Install Dependencies:** Ensure you have `npm` or `yarn` installed. Navigate to the project root and run `npm install` or `yarn install`.
2.  **Start Development Server:** Run `npm run dev` or `yarn dev`.
3.  **Access Feature:** Open your browser and navigate to the Customer Communication tab (e.g., `/customer-communication`). Select a customer from the left panel, then click the "Details" button (info icon) in the conversation header or press the `D` key.

## Running Tests

Unit tests for the `DetailsPanel` are located in `src/features/chat/DetailsPanel/DetailsPanel.test.tsx`.

To run these tests:

1.  **Install Testing Dependencies (if not already installed):**
    ```bash
    npm install -D vitest @testing-library/react @testing-library/jest-dom
    ```
2.  **Add Test Script (if missing in `package.json`):**
    ```json
    "scripts": {
      "test": "vitest",
      // ... other scripts
    }
    ```
3.  **Execute Tests:**
    ```bash
    npm test
    ```

## Acceptance Criteria

-   Agent can click "Details" and view product, customer, and past queries for the selected conversation.
-   All fields shown in ProductDetails and CustomerDetails match the mock adapter data.
-   Adding a private note updates UI immediately.
-   Mobile: panel opens as a Sheet and is closable with `Esc` and swipe.
-   No new runtime errors in console; Slot/Sidebar error must not reappear.
