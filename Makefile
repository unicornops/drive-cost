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

.PHONY: help install dev build preview clean serve

help:
	@printf "Makefile targets for electric-fuel-calc\n\n"
	@printf "  make install           Install node dependencies (uses 'npm ci' if package-lock.json exists)\n"
	@printf "  make dev               Start development server (vite)\n"
	@printf "  make build             Build production assets (vite build)\n"
	@printf "  make preview           Preview production build (vite preview)\n"
	@printf "  make serve             Serve the built 'dist' directory using 'npx serve' (installs on demand)\n"
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

# Serve the dist directory using npx serve (convenience)
serve: build
	@printf "Serving 'dist' at http://localhost:5000 (uses 'npx serve')\n"
	@npx --yes serve dist -s -l 5000

clean:
	@printf "Cleaning node_modules, dist, and Vite cache (if present)...\n"
	@rm -rf node_modules dist .vite .cache
	@printf "Clean complete.\n"
