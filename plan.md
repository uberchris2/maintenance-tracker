# wrench.cafe Modernization Plan

## Current State Summary

| | Frontend (`maintenance-tracker/`) | Backend (`maintenance-tracker-api/`) |
|---|---|---|
| **Framework** | Angular 10.1.3 | .NET 8 / Azure Functions v4 (isolated worker) ✓ |
| **Language** | TypeScript 4.0.3 | C# ✓ |
| **Runtime** | Node 12 | .NET 8 ✓ |
| **Linting** | TSLint (deprecated) | None |
| **Testing** | Karma/Jasmine + Protractor (deprecated) | None |
| **CI/CD** | GitHub Actions (SWA deploy) | Azure Pipelines (ubuntu-latest) ✓ |
| **Key SDKs** | MSAL Angular 2.0, RxJS 6, ng-bootstrap 7 | Cosmos DB v3 SDK, Azure.Storage.Blobs, AutoMapper 13 ✓ |

Both codebases work but are built on frameworks and SDKs that are years past end-of-life. The goal is to bring them to current, supported versions without changing functionality.

---

## Phase 2: Frontend — Angular

### 2.1 Incremental Angular upgrade (10 → latest)

**From:** Angular 10.1.3 / TypeScript 4.0.3 / Node 12
**To:** Angular 19+ / TypeScript 5.6+ / Node 22 LTS

Angular must be upgraded one major version at a time using `ng update`. Each step handles breaking changes and migrations automatically. The jump is large (10 → 19 = 9 major versions), but the app is small (~1,083 lines of TypeScript, 13 components) so the migration surface is manageable.

Upgrade path: `10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19`

Key breaking changes along the way:
- **11:** Stricter types for forms and router. TSLint still supported.
- **12:** Ivy is default (already was in 10). View Engine removed. `ng build` defaults to production.
- **13:** Node 12 dropped. Requires Node 14+. IE11 support dropped.
- **14:** Typed forms (`FormControl<T>`). Standalone components introduced (optional).
- **15:** Standalone APIs stabilized. `NgModule` still works but standalone is preferred. MDC-based Angular Material (not applicable here, but ng-bootstrap may need updates).
- **16:** Signals introduced (optional). `DestroyRef` for cleanup. ESBuild available.
- **17:** Signals stabilized. New control flow syntax (`@if`, `@for`, `@switch`). ESBuild default. Deferrable views.
- **18:** Zoneless support (experimental). New `HttpClient` features.
- **19:** Signals fully mature. Incremental hydration. Resource API.

For each step, run `ng update @angular/core@<version> @angular/cli@<version>` and fix any compilation errors before proceeding.

### 2.2 Update Node.js version constraint

**From:** `"node": ">=12.0.0 <13.0.0"`
**To:** `"node": ">=22.0.0"` (Node 22 LTS)

Update `engines` in `package.json`. Node 22 is the current LTS as of late 2025.

### 2.3 Migrate TSLint → ESLint

**From:** TSLint 6.1.3 + Codelyzer 6.0.0
**To:** `@angular-eslint/schematics`

TSLint has been deprecated since 2019. Angular provides a migration schematic:

```
ng add @angular-eslint/schematics
ng g @angular-eslint/schematics:convert-tslint-to-eslint
```

Then delete `tslint.json`, `src/tslint.json`, and remove `tslint` + `codelyzer` from devDependencies.

### 2.4 Remove all test infrastructure

**From:** Protractor 7.0 (E2E), Karma/Jasmine (unit), 18 stub spec files
**To:** Remove everything

There are no meaningful tests. All 18 `*.spec.ts` files are Angular CLI auto-generated stubs containing only `should create` / `should be created` checks with no real assertions. Protractor is deprecated and the `e2e/` directory is boilerplate. Remove it all.

Delete files:
- All `*.spec.ts` files (18 files across components and services)
- `e2e/` directory (Protractor config and boilerplate)
- `src/karma.conf.js`
- `src/test.ts` (Karma bootstrap)
- `src/tsconfig.spec.json`

Remove from devDependencies:
- `karma`, `karma-chrome-launcher`, `karma-coverage-istanbul-reporter`, `karma-jasmine`, `karma-jasmine-html-reporter`
- `jasmine-core`, `jasmine-spec-reporter`
- `@types/jasmine`, `@types/jasminewd2`
- `protractor`
- `ts-node` (only used by Protractor)

Remove from `angular.json`:
- The `test` architect target (references karma.conf.js)

Remove from `package.json`:
- The `"test"` and `"e2e"` scripts

### 2.5 Convert to standalone components

**From:** Single `AppModule` with all 13 components declared, `entryComponents` array
**To:** Standalone components with `bootstrapApplication()`

Angular's standalone component model (stable since v15) eliminates NgModules for most apps. For an app this size, it simplifies the structure significantly:

- Add `standalone: true` to each component decorator
- Move imports (FormsModule, RouterModule, etc.) to individual component `imports` arrays
- Replace `AppModule` bootstrap with `bootstrapApplication(AppComponent, { providers: [...] })` in `main.ts`
- Remove `entryComponents` (deprecated since Angular 9, removed in 16+)
- Remove `AppModule` entirely

### 2.6 Adopt new control flow syntax

**From:** `*ngIf`, `*ngFor`, `*ngSwitch` directives
**To:** `@if`, `@for`, `@switch` built-in template syntax (Angular 17+)

Angular provides an automatic migration: `ng generate @angular/core:control-flow`. This is a straightforward find-and-replace in templates. The new syntax is cleaner and doesn't require importing `CommonModule`.

### 2.7 Update MSAL Angular

**From:** `@azure/msal-angular` 2.0.0 / `@azure/msal-browser` 2.14.2
**To:** `@azure/msal-angular` 4.x / `@azure/msal-browser` 4.x

MSAL Angular v3+ added support for Angular 15+ and standalone components. v4 is the current major.

Changes required:
- Update the `MSALInstanceFactory` — the `PublicClientApplication.createPublicClientApplication()` async factory is now preferred
- Update `MsalInterceptor` and `MsalGuard` configuration for v4 APIs
- Move MSAL providers to `bootstrapApplication()` provider array
- The auth configuration (clientId, authority, scopes) stays the same — this is Azure AD B2C config, not an MSAL version concern

### 2.8 Update third-party dependencies

| Package | From | To | Notes |
|---|---|---|---|
| `@ng-bootstrap/ng-bootstrap` | 7.0.0 | 17+ | Must match Angular version. Standalone components supported since v14. |
| `@fortawesome/angular-fontawesome` | 0.7.0 | 0.14+ | Follows Angular versioning |
| `@fortawesome/free-solid-svg-icons` | 5.14.0 | 6.x | FontAwesome 6 (icon names may have changed — verify) |
| `@fortawesome/fontawesome-svg-core` | 1.2.30 | 6.x | Matches FontAwesome 6 |
| `ngx-spinner` | 10.0.1 | Latest | Check Angular 19 compatibility; if unmaintained, replace with a simple CSS spinner |
| `@azure/storage-blob` | 12.2.1 | 12.x (latest) | Same major version, just update |
| `date-fns` | 2.16.1 | 4.x | API changes in v3 (tree-shakeable by default, some function renames) |
| `rxjs` | 6.6.3 | 7.x | Pipe-based operators unchanged; some deprecated APIs removed |
| `zone.js` | 0.10.2 | 0.15+ | Must match Angular version |
| `tslib` | 2.0.1 | 2.x (latest) | Minor update |

**Remove entirely:**
- `rxjs-compat` — compatibility shim for RxJS 5→6 migration, not needed
- `core-js` — ES polyfills for IE/old browsers, not needed with modern browser targets

### 2.9 Update build and config files

**`angular.json`:**
- The `--prod` build flag was replaced by `--configuration production` in Angular 12+. `ng build` defaults to production since Angular 12.
- Remove `es5BrowserSupport` if present
- Budget limits are fine as-is

**`tsconfig.json`:**
- Update `target` from `es5` to `es2022` (modern browsers only)
- Update `module` from `es2015` to `es2022`
- Update `lib` from `es2018` to `es2022`
- Angular 17+ uses `"useDefineForClassFields": false` by default — the schematic handles this

**`browserslist`:**
- Update to drop any legacy entries. Modern defaults:
  ```
  last 2 Chrome versions
  last 2 Firefox versions
  last 2 Safari versions
  last 2 Edge versions
  ```

### 2.10 Update CI/CD pipeline

**From:** `actions/checkout@v3`, `Azure/static-web-apps-deploy@v1`
**To:** `actions/checkout@v4`, `Azure/static-web-apps-deploy@v1` (still current)

Changes:
- Update `actions/checkout` to `v4`
- Add a `setup-node` step to pin Node 22 (SWA deploy action auto-detects, but being explicit is safer)
- The `app_location` should point to `maintenance-tracker/` if the repo root is the monorepo (verify this matches the actual repo structure)
- `output_location` stays `dist/maintenance-ui` (or whatever `ng build` outputs to; Angular 17+ changed the default to `dist/<project>/browser` — verify after upgrade)

---

## Phase 3: Cleanup & Verification

### 3.1 Verify auth flow end-to-end

The most critical thing to test after both upgrades: Azure AD B2C login → token acquisition → API calls with bearer token → Cosmos DB reads/writes → receipt uploads.

Auth is the piece that touches both frontend and backend and involves external dependencies (Azure AD B2C, MSAL). Test this thoroughly.

### 3.2 Verify Azure Functions proxies replacement

Confirm the car query proxy function (Phase 1.6) works correctly — the add/update vehicle forms depend on it for year/make/model dropdowns.

### 3.3 Verify receipt upload/download

The receipt flow crosses both codebases:
1. Frontend gets SAS token from backend
2. Frontend uploads directly to Azure Blob Storage using `@azure/storage-blob`
3. Frontend downloads via SAS token

Both the SAS generation (backend) and the upload client (frontend) are being updated.

### 3.4 Remove dead code and deprecated artifacts

- Delete `tslint.json` files (after ESLint migration in 2.3)
- Remove `entryComponents` from any remaining module config
- Delete `polyfills.ts` if Angular version no longer needs it (Angular 15+ includes polyfills automatically)
- Remove `rxjs-compat` and `core-js` imports from source files if any exist

---

## Execution Order

The phases above describe *what* needs to change. Here's the recommended execution order for actually doing the work:

1. **Frontend** — step through Angular versions 10 → 19 one at a time. After reaching the target version, update all third-party packages, convert to standalone components, and adopt new template syntax.

2. **CI/CD last** — update the frontend pipeline after the code changes are proven locally.

3. **Test the full flow** — auth, CRUD, receipts, sharing, feedback form, car query proxy.

---

## Azure Portal / Infrastructure Changes

Most of this plan is code-only. The Azure resources (Cosmos DB, Blob Storage, AD B2C, SendGrid) require no changes. The following are the exceptions.

### Static Web App build output path (verify after Angular upgrade)

Angular 17+ changed the default build output from `dist/<project>/` to `dist/<project>/browser/`. After the Angular upgrade, check what `ng build` actually produces. If the output path changed, update the `output_location` in the GitHub Actions workflow file. This is a YAML change, not an Azure portal change, but the SWA resource may also show build configuration in the portal — keep them in sync.

---
