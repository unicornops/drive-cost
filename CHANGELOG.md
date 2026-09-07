# Changelog

All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

- - -
## v0.9.1 - 2026-09-07
#### Bug Fixes
- make tag-release workflow resilient to non-conventional commits - (ddc84bb) - Rob Lazzurs
- remove empty style block from Footer.vue (sonarqube S4667) - (089005e) - Rob Lazzurs
- add no-op bodies to empty ResizeObserver methods (sonarqube S1186) - (2d444cd) - Rob Lazzurs
- use fieldset instead of role=group for button groups (sonarqube S6819) - (f506dbd) - Rob Lazzurs
- replace labels without controls with span elements (sonarqube S6853) - (7437be7) - Rob Lazzurs
- add id attributes and label associations for form inputs (sonarqube S6749) - (8f752ad) - Rob Lazzurs
- prefer Number.parseFloat over parseFloat (sonarqube S7773) - (59a289b) - Rob Lazzurs
#### Documentation
- add conventional commit guidelines and create agent instruction symlinks - (1372ec4) - copilot-swe-agent[bot]
#### Continuous Integration
- make SonarQube quality gate a blocking PR check - (d3d351c) - Rob Lazzurs
- bump Node.js from 20.x to 22.x for jsdom 30 compatibility - (2f9fb97) - Rob Lazzurs
#### Chores
- (**deps**) bump jsdom from 29.1.1 to 30.0.1 - (4708254) - dependabot[bot]
- (**deps**) bump @testing-library/jest-dom from 6.9.1 to 7.0.1 - (e350ade) - dependabot[bot]
- (**deps**) bump @tailwindcss/postcss from 4.3.0 to 4.3.3 - (b440a6b) - dependabot[bot]
- (**deps**) bump @vitejs/plugin-vue from 6.0.7 to 6.0.8 - (a5d3d21) - dependabot[bot]
- (**deps**) bump vitest from 4.1.7 to 4.1.11 - (dc6ba3f) - dependabot[bot]
- (**deps**) bump vue from 3.5.34 to 3.5.41 - (23254a1) - dependabot[bot]
- (**deps**) bump tailwindcss from 4.3.0 to 4.3.3 - (91daa9f) - dependabot[bot]
- (**deps**) bump vite from 8.0.1 to 8.2.1 - (31eb363) - dependabot[bot]
- (**deps**) bump actions/setup-node from 6 to 7 - (f4832ca) - dependabot[bot]
- (**deps**) bump actions/checkout from 6 to 7 - (10bc9f1) - dependabot[bot]
- (**deps**) bump vitest from 4.1.6 to 4.1.7 - (74316b9) - dependabot[bot]
- (**deps**) bump @tailwindcss/postcss from 4.2.2 to 4.3.0 - (a4003cf) - dependabot[bot]
- (**deps**) bump jsdom from 28.1.0 to 29.1.1 - (24dd709) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.1.6 to 4.1.7 - (e9773e7) - dependabot[bot]
- (**deps**) bump @playwright/test from 1.59.1 to 1.60.0 - (7b54c9c) - dependabot[bot]
- (**deps**) bump @vue/test-utils from 2.4.6 to 2.4.10 - (8f0a8ed) - dependabot[bot]
- (**deps**) bump vitest from 4.1.5 to 4.1.6 - (abedf49) - dependabot[bot]
- (**deps**) bump @vitejs/plugin-vue from 6.0.5 to 6.0.7 - (d95ede5) - dependabot[bot]
- (**deps**) bump vue from 3.5.30 to 3.5.34 - (1a3bad8) - dependabot[bot]
- (**deps**) bump tailwindcss from 4.2.2 to 4.3.0 - (c743e7b) - dependabot[bot]
- (**deps**) bump postcss from 8.5.8 to 8.5.10 - (c8e6f61) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.1.0 to 4.1.5 - (17c5267) - dependabot[bot]
- (**deps**) bump @playwright/test from 1.58.2 to 1.59.1 - (49e236f) - dependabot[bot]
- (**deps**) bump softprops/action-gh-release from 2 to 3 - (0b928a2) - dependabot[bot]
- (**deps**) bump vite from 8.0.0 to 8.0.1 - (02cd56b) - dependabot[bot]
- (**deps**) bump vue from 3.5.29 to 3.5.30 - (070bf06) - dependabot[bot]
- (**deps**) bump npm-check-updates from 19.6.3 to 19.6.5 - (e6ddc0e) - dependabot[bot]
- (**deps**) bump @tailwindcss/postcss from 4.2.1 to 4.2.2 - (7cce509) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.0.18 to 4.1.0 - (4b1181c) - dependabot[bot]
- (**deps**) bump vite from 7.3.1 to 8.0.0 - (a67e492) - dependabot[bot]
- (**deps**) bump @vitejs/plugin-vue from 6.0.4 to 6.0.5 - (cbeaac1) - dependabot[bot]
- (**deps**) bump postcss from 8.5.6 to 8.5.8 - (d43e04d) - dependabot[bot]
- (**deps**) bump actions/upload-artifact from 6 to 7 - (c37493f) - dependabot[bot]
- (**deps**) bump @tailwindcss/postcss from 4.1.18 to 4.2.1 - (e365fed) - dependabot[bot]
- (**deps**) bump vue from 3.5.28 to 3.5.29 - (9c0c77a) - dependabot[bot]
- (**deps**) bump tailwindcss from 4.1.18 to 4.2.0 - (337184b) - dependabot[bot]
- (**deps**) bump npm-check-updates from 19.3.2 to 19.4.1 - (07b23b2) - dependabot[bot]
- (**deps**) bump autoprefixer from 10.4.23 to 10.4.24 - (6424472) - dependabot[bot]
- (**deps**) bump jsdom from 27.4.0 to 28.1.0 - (c40264a) - dependabot[bot]
- (**deps**) bump vue from 3.5.26 to 3.5.28 - (57d8313) - dependabot[bot]
- (**deps**) bump npm-check-updates from 19.2.0 to 19.3.2 - (e455319) - dependabot[bot]
- (**deps**) bump @vitejs/plugin-vue from 6.0.3 to 6.0.4 - (97098b0) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.0.17 to 4.0.18 - (4d901bb) - dependabot[bot]
- (**deps**) bump @playwright/test from 1.57.0 to 1.58.2 - (55ae19c) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.0.16 to 4.0.17 - (ed96ffa) - dependabot[bot]
- (**deps**) bump vite from 7.2.6 to 7.3.1 - (87d2637) - dependabot[bot]
- (**deps**) bump jsdom from 27.2.0 to 27.4.0 - (794395a) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.0.14 to 4.0.16 - (92d0c1c) - dependabot[bot]
- (**deps**) bump autoprefixer from 10.4.22 to 10.4.23 - (f6327f5) - dependabot[bot]
- (**deps**) bump vue from 3.5.25 to 3.5.26 - (a2a3aa2) - dependabot[bot]
- (**deps**) bump @vitejs/plugin-vue from 6.0.2 to 6.0.3 - (2919f3d) - dependabot[bot]
- (**deps**) bump npm-check-updates from 19.1.2 to 19.2.0 - (14a0b9f) - dependabot[bot]
- (**deps**) bump actions/upload-artifact from 5 to 6 - (3b9cd3c) - dependabot[bot]
- (**deps**) bump @tailwindcss/postcss from 4.1.17 to 4.1.18 - (dc65965) - dependabot[bot]
- (**deps**) bump tailwindcss from 4.1.17 to 4.1.18 - (a4d2572) - dependabot[bot]
- (**deps**) bump vite from 7.2.4 to 7.2.6 - (11fc416) - dependabot[bot]
- (**deps**) bump actions/checkout from 5 to 6 - (40b4437) - dependabot[bot]
- (**deps**) bump @playwright/test from 1.56.1 to 1.57.0 - (9f202fe) - dependabot[bot]
- (**deps**) bump vue from 3.5.24 to 3.5.25 - (18e89c0) - dependabot[bot]
- (**deps**) bump @vitest/coverage-v8 from 4.0.8 to 4.0.13 - (77cc459) - dependabot[bot]
- (**deps**) bump actions/setup-node from 4 to 6 - (058c2e3) - dependabot[bot]
- (**deps**) bump vite from 7.2.2 to 7.2.4 - (19b4fb1) - dependabot[bot]
- (**deps**) bump @vitejs/plugin-vue from 6.0.1 to 6.0.2 - (b0d0108) - dependabot[bot]
- (**deps**) bump actions/upload-artifact from 4 to 5 - (79157a5) - dependabot[bot]
- (**deps-dev**) bump glob from 10.4.5 to 10.5.0 - (80f6dd7) - dependabot[bot]
- update SonarQube project key - (038bd23) - Rob Lazzurs

- - -

## v0.9.0 - 2025-11-26
#### Features
- Add changelog generation and GitHub release upload steps - (c5e4d30) - Rob Lazzurs

- - -

## v0.8.0 - 2025-11-26
#### Features
- Add per-distance tax option for diesel and electric costs - (f5fa1c2) - Rob Lazzurs
#### Bug Fixes
- remove archived pre-commit hook - (249ece8) - Rob Lazzurs
- Remove unused bump_profiles section from config - (b0ec130) - Rob Lazzurs
- Add --from-latest-tag to cocogitto check command - (e96c77d) - Rob Lazzurs
#### Chores
- (**deps**) bump actions/checkout from 4 to 5 - (3b0c643) - dependabot[bot]

- - -


## v0.7.0 - 2025-11-13

#### Features

- Add Playwright E2E and Vitest unit testing setup - (d59156a) - Rob Lazzurs

#### Bug Fixes

- Update package.json - (f41ec0d) - Rob Lazzurs

---

## v0.6.0 - 2025-11-08

#### Features

- Add electric efficiency metric toggle and MPGe support - (615aed0) - Rob Lazzurs

---

## v0.5.0 - 2025-11-08

#### Features

- Add support for MPG and L/100km fuel efficiency metrics - (ab3ea3b) - Rob Lazzurs

---

## v0.4.1 - 2025-11-08

#### Bug Fixes

- Update journey cost comparison text for clarity - (3f49c3d) - Rob Lazzurs

---

## v0.4.0 - 2025-11-08

#### Features

- Improve mobile responsiveness and spacing for all layouts - (1e97078) - Rob Lazzurs

---

## v0.3.0 - 2025-11-08

#### Features

- Add project name to Cloudflare deploy command - (e6c9090) - Rob Lazzurs
- Add cloudflare-deploy target to Makefile - (75e0f70) - Rob Lazzurs

#### Bug Fixes

- Replace horizontal rules in changelog with dashes - (b3a5678) - Rob Lazzurs

#### Continuous Integration

- Remove Cloudflare deploy target from Makefile - (1d50877) - Rob Lazzurs

#### Chores

- Add Dependabot config for npm and GitHub Actions - (47366d1) - Rob Lazzurs
- Adding pre-commit config. - (092acde) - Rob Lazzurs

---

## v0.2.0 - 2025-11-08

#### Features

- Add AGENTS.md - (5f72897) - Rob Lazzurs

---

## v0.1.0 - 2025-11-08

#### Features

- Adding footer linking to github - (020fc34) - Rob Lazzurs
- Initial commit - (850c929) - Rob Lazzurs

#### Bug Fixes

- Fixing messed up repo structure. - (cbe1daa) - Rob Lazzurs

#### Continuous Integration

- Adding cocogitto config - (5f61db1) - Rob Lazzurs

---

Changelog generated by [cocogitto](https://github.com/cocogitto/cocogitto).
