# Angular v19+ and TypeScript Coding Rules for Augment AI

## System Context
Act as an expert in TypeScript and Angular v19+, generating maintainable, performant, accessible, and type-safe code. Prioritize modern Angular patterns (standalone components, signals, zoneless architecture) and avoid legacy practices like NgModules unless explicitly required.

## TypeScript Guidelines
- Enable strict mode in `tsconfig.json` for type safety.
- Avoid `any`; use specific types, unions, or `unknown` instead.
- Use type annotations for function parameters, returns, and complex variables; rely on inference for simple cases.
- Use generics for reusable, type-safe components (e.g., `<T extends SomeType>`).
- Prefer string enums for related constants (e.g., `enum Status { Active = 'active', Inactive = 'inactive' }`).
- Use union (`string | number`) and intersection types (`TypeA & TypeB`) for flexibility.
- Apply `private` or `protected` modifiers for encapsulation.
- Handle errors with try-catch and custom error classes.
- Organize code into ES6 modules with clear `import`/`export`.
- Use ESLint and Prettier for consistent style.

## Angular General Guidelines
- Use standalone components by default; avoid NgModules unless required for legacy.
- Prefer signals for reactive state over RxJS Observables for simplicity.
- Implement lazy loading for routes and features to reduce bundle size.
- Use `NgOptimizedImage` for static images; avoid base64 encoding.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` for performance.
- Use `inject()` for dependency injection instead of constructor parameters.
- Keep services single-responsibility; provide at root level (`providedIn: 'root'`).
- Follow clean architecture: components (UI), services (logic), models (data).

## Components and Directives
- Keep components small and focused; split large ones into sub-components.
- Use `input()` and `output()` for component inputs/outputs.
- Use `computed()` for derived signal state.
- Prefer `host` object over `@HostBinding`/`@HostListener`.
- Use inline templates for small components; external for complex ones.
- Update signals with `set` or `update` methods, not direct mutation.

## State Management
- Use signals for local component state; keep transformations pure.
- Use signals or NgRx for global state only when complexity requires.
- Use `computed()` for reactive derivations; avoid side effects.
- Handle Observables with async pipe; ensure proper cleanup.

## Templates and Rendering
- Keep templates simple; move logic to components/services.
- Use native control flow (`@if`, `@for`, `@switch`) over `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use `[class]` and `[style]` bindings instead of `ngClass`/`ngStyle`.
- Prefer Reactive forms with built-in validators.
- Use `@defer` for lazy-loaded content.

## Performance and Accessibility
- Optimize with OnPush and signals to minimize re-renders.
- Ensure accessibility with semantic HTML, ARIA, and Lighthouse testing.
- Lazy-load modules; use preloading for critical paths.

## Testing and Tooling
- Write unit tests with Jasmine/Karma for inputs, outputs, and services.
- Use Angular CLI for generating components, services, etc.
- Enforce rules with ESLint plugins for Angular and TypeScript.

## AI Generation Guidelines
- Generate complete, working code with all necessary imports.
- Include brief reasoning only if requested.
- Follow Angular style guide: kebab-case selectors, single-responsibility, modularity.
- Default to v19+ features (e.g., zoneless apps) if specified.