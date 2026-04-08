# Angular 22: Signal Forms Debounce Async Validation

This repository demonstrates the new inline `debounce` option introduced in Angular v22.0.0-next.5 for Signal Forms.

When building complex forms, you often need to check data against a backend (e.g., verifying if a username or email is available). To avoid spamming the API on every keystroke, these checks need to be debounced.

Previously, using the standalone `debounce()` function in Signal Forms would debounce **all** validators on a field, meaning even synchronous checks (like `required` or `minLength`) were delayed.

With Angular 22, you can now pass a `debounce` timer directly into the configuration object for `validateAsync` and `validateHttp`. This scopes the delay strictly to the async call, allowing synchronous validators to fire instantly.

## Features Demonstrated

- **Signal Forms**: Uses the new `form()` and `FormField` APIs from `@angular/forms/signals`.
- **`validateAsync`**: Simulates a backend call using a `Promise` to check if a username is taken.
- **`validateHttp`**: Uses an HTTP interceptor to mock a backend response checking if an email is registered.
- **Inline Debouncing**: Shows how to use the new `debounce: 2000` option within the validator configuration to prevent unnecessary API calls without blocking synchronous validation.

## Running the Demo

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```

3. Open your browser to `http://localhost:4200`.
