# Repository Guidelines

## Project Structure & Module Organization

Skynote is a Vite + React mobile app wrapped with Capacitor for Android.

- `src/`: React application code. `App.jsx` contains the current app views and local-state logic; `App.css` contains the mobile UI styling.
- `public/`: static web assets, including `public/cats/` mood cat illustrations, `icon.svg`, `manifest.webmanifest`, and `sw.js`.
- `android/`: Capacitor Android project and generated native resources. Launcher icons live under `android/app/src/main/res/mipmap-*`.
- `scripts/`: helper scripts, including visual checks and packaging helpers.
- `dist/`: Vite build output. Treat as generated.
- `release/`: generated APK/PWA artifacts. Treat as output unless explicitly updating deliverables.

## Build, Test, and Development Commands

- `npm install`: install frontend and Capacitor dependencies.
- `npm run dev`: start Vite locally at `127.0.0.1`.
- `npm run build`: build production web assets into `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run check:visual`: run the Playwright visual smoke check.
- `npx cap sync android`: copy `dist/` assets and plugin config into Android.
- `pwsh -NoLogo -NoProfile -Command './gradlew.bat assembleDebug'` from `android/`: build the debug APK.

## Coding Style & Naming Conventions

Use React functional components and hooks. Keep component names in `PascalCase`, functions and variables in `camelCase`, and constants in descriptive lower camel or uppercase only when truly static. Use two-space indentation in JSX/CSS-adjacent code and keep UI copy concise. Prefer existing local patterns in `App.jsx` before adding abstractions. Use `lucide-react` icons for controls and keep new visual assets under `public/`.

## Testing Guidelines

There is no unit test suite yet. For behavior changes, run `npm run build` at minimum. For UI changes, use Playwright or update `scripts/visual-check.mjs` to cover mobile widths such as `360`, `390`, and `430`. For Android changes, run `npx cap sync android` and `assembleDebug`.

## Commit & Pull Request Guidelines

No commit history is available in this checkout. Use clear, imperative commit messages, for example `Fix weather permission fallback` or `Update mood trend aggregation`. PRs should include a short summary, verification commands run, screenshots for visual changes, and APK path when a build artifact is requested.

## Security & Configuration Tips

Weather uses Open-Meteo and geolocation permissions. Do not add API keys to the repo. Local records are stored in `localStorage`; avoid introducing cloud sync or external storage without an explicit product decision.
