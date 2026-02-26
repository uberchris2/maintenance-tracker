# Maintenance Tracker — Improvement Plan

This plan captures cleanup, modernization, and simplification opportunities found during a full repository review. The project was originally scaffolded with Angular CLI 7 and has been migrated to Angular 19 with standalone components, but many legacy patterns remain.

---

## 1. Build Configuration (`angular.json`)

- **Switch from `browser` to `application` builder.** The project still uses `@angular-devkit/build-angular:browser`, which is the legacy builder. Angular 17+ projects should use `@angular-devkit/build-angular:application` (esbuild-based), which is significantly faster and produces smaller bundles.
- **Enable AOT by default.** `"aot": false` in the base options means dev builds skip AOT. Modern Angular enables AOT everywhere — it catches template errors early and aligns dev/prod behavior.
- **Remove redundant build options.** Options like `vendorChunk`, `buildOptimizer`, `extractLicenses`, and `namedChunks` are managed automatically by the `application` builder and can be deleted.
- **Remove `defaultConfiguration: ""`.**  This should be `"development"` or simply omitted so the CLI picks sensible defaults.

## 2. TypeScript Configuration (`tsconfig.json`)

- **Remove `experimentalDecorators: true`.** Angular 19 uses TC39-standard decorators; this flag is no longer needed and is a leftover from the old compiler.
- **Remove `useDefineForClassFields: false`.** Another legacy compatibility flag that is no longer needed with modern Angular.
- **Add `strict: true`** (or at minimum `strictPropertyInitialization`, `strictNullChecks`). Many properties are declared without initializers (e.g. `vehicle: Vehicle;`), which hides potential undefined-access bugs.

## 3. Remove Legacy / Unnecessary Files

- **Delete `src/browserslist`.** This file is a leftover from the old Angular CLI. Modern Angular uses `.browserslistrc` or the `browserslist` key in `package.json`. Since the project targets only the last 2 versions of major browsers (the default), this file can simply be deleted.
- **Delete `src/app/default-http-options.ts`.** The `Interceptor` already prepends the API base URL. Setting `Content-Type: application/json` is unnecessary — Angular's `HttpClient` sets it automatically for object bodies. The two services that import it (`FeedbackService`, `MaintenanceService`, `VehicleService`) can drop the third argument.
- **Remove `<app-redirect></app-redirect>` from `index.html`.** There is no `app-redirect` component in the codebase. This is dead markup.

## 4. Models — Use Interfaces Instead of Classes

All six models (`Feedback`, `Maintenance`, `UploadAuthorization`, `UploadStatus`, `Vehicle`, `VehicleMaintenance`) are declared as `class` but are used purely as data shapes (no methods, no instantiation logic except `UploadStatus`). Convert them to TypeScript `interface`s (except `UploadStatus` which has a constructor — that one can stay a class or become an interface + factory function).

Using `new Feedback()` / `new Vehicle()` / `new Maintenance()` in components should be replaced with object literals, which is simpler and more idiomatic.

## 5. Component Modernization

### 5a. Remove empty `ngOnInit` / `implements OnInit`
Several components have empty `ngOnInit()` methods and `implements OnInit` that serve no purpose:
- `ErrorComponent`
- `FeedbackComponent`
- `HomeComponent`
- `PrivacyPolicyComponent`
- `VehicleCardComponent`

Remove the `OnInit` import, `implements OnInit`, the empty constructor, and the empty `ngOnInit`.

### 5b. Remove empty constructors
Components with no injected dependencies still have `constructor() { }`. Remove them:
- `ErrorComponent`
- `HomeComponent`
- `PrivacyPolicyComponent`

### 5c. Use `inject()` instead of constructor injection
Modern Angular (14+) supports `inject()` for DI, which is simpler with standalone components. All services and dependencies currently injected via constructor parameters can be migrated:
```ts
// Before
constructor(private vehicleService: VehicleService) { }
// After
private vehicleService = inject(VehicleService);
```

### 5d. Use `styleUrl` (singular) instead of `styleUrls` (array)
All components use `styleUrls: ['./x.component.css']`. Angular 17+ supports the simpler `styleUrl: './x.component.css'` when there's only one stylesheet. For components whose CSS file is being deleted (empty), this line is removed entirely.

## 6. Interceptors — Migrate to Functional Interceptors

Angular 15+ introduced functional HTTP interceptors via `withInterceptors()`. The current class-based `Interceptor` and `DateInterceptor` using `HttpInterceptor` interface are legacy. Migrate to:
```ts
export const apiInterceptor: HttpInterceptorFn = (req, next) => { ... };
```
And register them with `provideHttpClient(withInterceptors([apiInterceptor, dateInterceptor]))` in `main.ts`, removing `withInterceptorsFromDi()` and the `HTTP_INTERCEPTORS` multi-providers.

## 7. `main.ts` Cleanup

- **Remove `enableProdMode()`.** The `application` builder handles this automatically. The `enableProdMode` + environment check pattern is legacy.
- **Remove unnecessary `importProvidersFrom` calls.** Several NgModules passed to `importProvidersFrom` are not needed:
  - `NgbModule` — redundant when individual NgbComponents (NgbCollapse, NgbPopover, etc.) are already imported directly in component `imports` arrays.
  - `NgbPopoverModule`, `NgbProgressbarModule`, `NgbCollapseModule`, `NgbDropdownModule` — same; the individual directives are imported directly.
  - `FormsModule` — already imported directly in each component that uses it.
  - `FontAwesomeModule` — already imported per-component.
  - `NgxSpinnerModule` — check if this can be replaced with a simpler, lighter solution. If kept, move to component-level imports.
- **Clean up MSAL factory functions.** These are fine functionally but could be simplified into a single config object.

## 8. Routing Cleanup (`app-routing.module.ts`)

- **Rename the file** to `app.routes.ts` — the `.module.ts` suffix is misleading since there is no `NgModule`.
- **Remove commented-out `{ path: '**', redirectTo: '/error' }`** or uncomment it if desired. Dead comments add noise.
- **Use kebab-case route paths** for consistency: `addVehicle` → `add-vehicle`, `recordMaintenance` → `record-maintenance`, `updateVehicle` → `update-vehicle`, `updateMaintenance` → `update-maintenance`, `privacyPolicy` → `privacy-policy`. CamelCase URLs are unconventional.

## 9. Service Cleanup

- **`FeedbackService`** — Remove `DefaultHttpOptions` import and usage.
- **`MaintenanceService`** — Remove `DefaultHttpOptions` import and usage; remove unused `Observable` import.
- **`VehicleService`** — Remove `DefaultHttpOptions` and unused `HttpHeaders` imports.
- **`ReceiptService`** — The `download` and `downloadShared` methods subscribe internally and return `Subscription`, which is an anti-pattern. They should return `Observable`s and let the caller subscribe. Also, `uploadReceipt` should type its `Observable<UploadStatus>` return.
- **`YearMakeModelService`** — Uses `any` types for API responses. Define response interfaces. Move the `Make` class to `models/`.

## 10. Template / HTML Cleanup

- **`update-vehicle.component.html`** — Has a full duplicate "skeleton" form for the `!vehicle` case. Replace with a single form and use an `@if (vehicle)` gate or show a loading indicator. The duplicate is ~20 lines of dead weight.
- **`app.component.html`** — Remove trailing blank lines (5 empty lines at end).
- **`privacy-policy.component.html`** — Line 154 has broken HTML: `http://wrench.cafe/#/feedback</p>p>` — the closing tag is malformed (`</p>p>` instead of `</p>`).
- **`vehicle.component.html` and `share.component.html`** — The empty-state `<td colspan>` is not wrapped in a `<tr>`, which is invalid table HTML.
- **Use `routerLinkActive`** instead of manual `[class.active]="currentUrl == '/home'"` checks in the navbar.

## 11. Miscellaneous Code Quality

- **`app.component.ts`** — `destroying$.next(null)` should be `destroying$.next()` (Subject<void>). The router events subscription is never unsubscribed — use `takeUntil(this.destroying$)` or `DestroyRef`. Remove the commented-out `isIframe` property and the commented-out `msalSubject$` subscription block.
- **`date-interceptor.ts`** — The `HttpErrorResponse` handler for 401 is empty and does nothing. Remove the dead error handler. Add types to `convertToDate(body: unknown)` and `isIso8601(value: unknown)`.
- **`interceptor.ts`** — Uses `==` instead of `===` for `callCount` comparison.
- **`vehicle.component.ts`** — Uses `var` instead of `const`/`let` in `prepareMaintenance`.
- **`record-maintenance.component.ts`** — `@ViewChild('receiptInput', { static: true })` lacks a type annotation.
- **`add-vehicle.component.ts`** — Setting properties to `null` (e.g. `this.makes = null`) won't work well with strict null checks. Use `undefined` or adjust types.

## 12. Update `README.md`

The README is completely out of date. Fully rewrite it.

## 13. Remove Stale `environment.ts` Comments

The `environment.ts` file has a large block comment about `zone-error` and file replacements that is boilerplate from Angular CLI 7. Remove it.

