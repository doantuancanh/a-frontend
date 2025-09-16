# Angular v19+ Project Structure for Augment AI

## System Context
Act as an expert in Angular v19+ and TypeScript, organizing projects for scalability, maintainability, and modularity. Use a feature-based structure with standalone components, signals for state management, and modern Angular practices. Ensure the structure supports lazy loading, clean architecture, and TypeScript type safety, while being intuitive for both developers and AI code generation.

## Project Structure Guidelines
Organize the Angular project under `src/app` using a modular, feature-based structure. Avoid legacy NgModule patterns unless explicitly required for migration. Group related functionality (components, services, models) into feature folders, and separate shared utilities and core services for reusability. Use kebab-case for file and folder names, and ensure clear naming conventions.

### Root Structure (`src/`)
- `app/`: Core application code, containing the main app component and feature modules.
- `assets/`: Static assets (images, fonts, JSON files).
- `environments/`: Environment-specific configurations (e.g., `environment.ts`, `environment.prod.ts`).
- `styles/`: Global styles (e.g., `styles.css` for global CSS or SCSS).
- `index.html`: Main HTML entry point.
- `main.ts`: Application bootstrap file.
- `tsconfig.json`: TypeScript configuration with strict mode enabled.
- `.eslintrc.json`: ESLint configuration for Angular and TypeScript linting.
- `.prettierrc`: Prettier configuration for consistent formatting.

### App Structure (`src/app/`)
- `app.component.ts`: Root standalone component; keep minimal, delegating to feature components.
- `app.config.ts`: Application-wide providers (e.g., router, HTTP interceptors).
- `app.routes.ts`: Top-level routes with lazy-loaded feature modules.
- `core/`: Core services and singletons used across the app.
  - `services/`: Global services (e.g., `auth.service.ts`, `api.service.ts`).
  - `interceptors/`: HTTP interceptors (e.g., `auth.interceptor.ts`).
  - `guards/`: Route guards (e.g., `auth.guard.ts`).
  - `models/`: Global interfaces and types (e.g., `user.model.ts`).
- `shared/`: Reusable components, directives, pipes, and utilities.
  - `components/`: Shared UI components (e.g., `button.component.ts`).
  - `directives/`: Custom directives (e.g., `focus.directive.ts`).
  - `pipes/`: Custom pipes (e.g., `truncate.pipe.ts`).
  - `utils/`: Utility functions (e.g., `date.utils.ts`).
- `features/`: Feature-specific modules, each representing a distinct app feature.
  - `<feature-name>/`: Feature folder (e.g., `users/`, `dashboard/`).
    - `components/`: Feature-specific components (e.g., `user-list.component.ts`).
    - `pages/`: Top-level components for routes (e.g., `user-profile.page.ts`).
    - `services/`: Feature-specific services (e.g., `user.service.ts`).
    - `models/`: Feature-specific interfaces (e.g., `user.interface.ts`).
    - `<feature-name>.routes.ts`: Feature-specific routes, lazy-loaded from `app.routes.ts`.
- `layouts/`: Reusable layout components (e.g., `main-layout.component.ts` for header/sidebar).
- `styles/`: Feature-specific or component-specific styles (e.g., `users.component.scss`).

### Feature Folder Example (`src/app/features/users/`)
- `users.routes.ts`: Defines lazy-loaded routes for the users feature.
- `components/`: UI components like `user-card.component.ts`, `user-form.component.ts`.
- `pages/`: Route-level components like `user-list.page.ts`, `user-profile.page.ts`.
- `services/`: Logic like `user.service.ts` for API calls or state management.
- `models/`: Data models like `user.interface.ts`, `role.enum.ts`.
- `users.component.ts`: Optional root component for the feature (if needed).

## Best Practices
- **Modularity**: Group related functionality in feature folders; keep `shared/` for cross-feature reusables.
- **Standalone Components**: Use standalone components by default; avoid NgModules.
- **Lazy Loading**: Configure routes in `app.routes.ts` to lazy-load feature modules (e.g., `loadChildren: () => import('./features/users/users.routes').then(m => m.UsersRoutes)`).
- **Type Safety**: Define interfaces in `models/` for all data structures; use TypeScript strict mode.
- **State Management**: Use signals for local state; consider NgRx only for complex global state.
- **Naming**: Use descriptive, consistent names (e.g., `user-list.component.ts`, `user.service.ts`).
- **Styles**: Scope styles to components using `*.component.scss`; use global `styles/` for shared styles.
- **Testing**: Include spec files (e.g., `user.service.spec.ts`) in respective folders for unit tests.
- **Assets**: Store images, icons, or JSON in `assets/` with logical subfolders (e.g., `assets/images/`).
- **Configurability**: Use `environments/` for API URLs, feature flags, or other configs.
