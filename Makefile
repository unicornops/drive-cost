# Makefile - common targets for development and build
#
# Usage:
#  make            # show help
#  make install    # install node dependencies (uses npm ci if package-lock.json exists)
#  make dev        # run vite dev server
#  make build      # build production assets into dist/
#  make preview    # preview production build (vite preview)
#  make clean      # remove build artefacts and node_modules
#  make serve      # serve dist/ using a lightweight static server (requires `npx serve`)

SHELL := /bin/sh

NPM ?= npm
NODE ?= node

.PHONY: help install dev build preview test test-unit test-e2e test-ci playwright-install clean serve

help:
	@printf "Makefile targets for electric-fuel-calc\n\n"
	@printf "  make install           Install node dependencies (uses 'npm ci' if package-lock.json exists)\n"
	@printf "  make dev               Start development server (vite)\n"
	@printf "  make build             Build production assets (vite build)\n"
	@printf "  make preview           Preview production build (vite preview)\n"
	@printf "  make serve             Serve the built 'dist' directory using 'npx serve' (installs on demand)\n"
	@printf "  make playwright-install Install Playwright browsers for E2E tests\n"
	@printf "  make test              Run unit tests\n"
	@printf "  make test-e2e          Run E2E tests (builds first)\n"
	@printf "  make clean             Remove node_modules, dist and Vite cache\n"
	@printf "\nExamples:\n  make install\n  make dev\n\n"

# Prefer reproducible installs when package-lock.json exists
install:
	@if [ -f package-lock.json ]; then \
		printf "Using 'npm ci' (package-lock.json present)\n"; \
		$(NPM) ci; \
	else \
		printf "Using 'npm install' (no package-lock.json)\n"; \
		$(NPM) install; \
	fi

dev:
	@printf "Starting development server...\n"
	$(NPM) run dev

build:
	@printf "Building production bundle...\n"
	$(NPM) run build

preview:
	@printf "Previewing production build (local server)...\n"
	$(NPM) run preview

# Test targets
# `make test` runs unit tests by default
test: test-unit

test-unit:
	@printf "Running unit tests (Vitest)...\n"
	$(NPM) run test:unit

# Install Playwright browsers for E2E testing
playwright-install:
	@printf "Installing Playwright browsers...\n"
	npx playwright install

# Run E2E tests. This target builds the app and runs Playwright tests against a preview server.
# On CI, prefer using the CI workflow which runs build + Playwright with installed browsers.
test-e2e: build
	@printf "Running end-to-end tests (Playwright) against preview server...\n"
	@# Build is a dependency; start preview in background so Playwright can test against it.
	@$(NPM) run preview --silent & \
	PREV_PID=$$!; \
		sleep 1; \
		npx playwright test --forbid-only; \
		kill $$PREV_PID || true

# CI convenience target that runs unit and e2e
test-ci: build
	@printf "Running CI tests: unit + e2e\n"
	$(NPM) run test
	$(NPM) run test:e2e

# Serve the dist directory using npx serve (convenience)
serve: build
	@printf "Serving 'dist' at http://localhost:5000 (uses 'npx serve')\n"
	@npx --yes serve dist -s -l 5000

clean:
	@printf "Cleaning node_modules, dist, and Vite cache (if present)...\n"
	@rm -rf node_modules dist .vite .cache
	@printf "Clean complete.\n"
