# Contributing to Maintenance Supporter

Thanks for considering a contribution! This document covers the dev setup, conventions, and how to get a PR landed.

## Quick start

```bash
git clone https://github.com/iluebbe/maintenance_supporter
cd maintenance_supporter
```

## Development environment (Docker)

The repo ships with a Docker Compose setup that boots a real Home Assistant with the integration mounted, plus a Playwright server for E2E smoke tests.

```bash
cd docker
docker compose up -d              # ha-maint container on port 8125
docker compose --profile testing up -d   # adds playwright-server on port 3000
```

HA at <http://localhost:8125>. Token in `docker/.env` as `HA_TOKEN=…`.

The `custom_components/maintenance_supporter/` directory is volume-mounted, so Python edits hit immediately on HA restart. Frontend bundle changes require a rebuild (see below).

## Building the panel + card

```bash
cd custom_components/maintenance_supporter/frontend-src
npm install                       # first time
npm run build                     # bundles maintenance-panel.js + maintenance-card.js
```

The built bundles live at `custom_components/maintenance_supporter/frontend/`. Both are committed (HACS distributes the integration as-is, no build step on user machines).

After a frontend rebuild, hard-refresh the browser (Ctrl+Shift+F5) to bypass HA's cache.

## Tests

Three layers, run independently or together:

### 1. Backend (pytest)

```bash
docker exec ha-maint sh -c 'cd /config && python -m pytest tests/'
```

~1,500 unit + integration tests, ~90s. Includes 32 WebSocket roundtrip tests in `tests/test_ws_roundtrip.py` that exercise the WS contract end-to-end.

### 2. Component (Lit, web-test-runner)

```bash
cd custom_components/maintenance_supporter/frontend-src
npm test               # one-shot
npm run test:watch     # dev iteration
```

~17 component tests, runs in ~3s. Mounts individual Lit components in real Chromium with mocked `hass`. See `__tests__/` for examples.

### 3. End-to-end smoke (Playwright + WS)

```bash
# Requires playwright-server profile up (see Docker section above)
cd custom_components/maintenance_supporter/frontend-src
node _smoketest-vacation.mjs       # example pattern
```

Drives WS endpoints against a live HA instance via `page.evaluate`. Used for backend smoke verification before release; we deliberately don't try to automate UI clicks through HA's deep shadow DOM.

## Code quality

```bash
docker exec ha-maint sh -c 'cd /config && ruff check custom_components/maintenance_supporter/'
docker exec ha-maint sh -c 'cd /config && mypy custom_components/maintenance_supporter'
```

Both must be clean before commit.

## Translations

Panel strings live in `custom_components/maintenance_supporter/frontend-src/styles.ts` (12 language blocks). Config-flow strings live in `custom_components/maintenance_supporter/translations/<lang>.json`.

When adding a key:

1. Add it to **all 12 languages** ideally. If you can only do a few, that's still useful — missing keys fall back to English silently.
2. Run the audit script:
   ```bash
   cd custom_components/maintenance_supporter/frontend-src
   node frontend-src/_audit.mjs    # asserts every block has the same keys
   ```
3. If you submitted a translation-only PR, the [Translation correction issue template](.github/ISSUE_TEMPLATE/translation.yml) lists where files live.

## Commit messages

Keep them short. Conventional-Commit-ish prefixes are nice but not required. The CHANGELOG is hand-written, not generated, so it's the message body that matters more than the prefix.

Examples that work well:
- `release: v1.2.2 — Component test suite expanded`
- `fix: bump to v1.0.53 (v1.0.52 tag already in use)`
- `chore: remove tracked frontend-src/screenshots/ dev debris`
- `docs: recapture 14 README screenshots`

## Pull requests

The PR template walks through the basic checks. The TL;DR:

1. Tests pass (all three layers if relevant)
2. Translations stay in sync if you touched i18n
3. CHANGELOG entry under a `## [Unreleased]` block (or, if you're confident on versioning, the actual release section)

We squash-merge by default; one commit lands per PR.

## Releases

Maintainer-only. Sequence:

1. Bump `manifest.json` version
2. Move CHANGELOG `[Unreleased]` block to the new version heading
3. `git commit + push`
4. `gh release create v<version> --notes "..."` — HACS picks up new versions from GitHub Releases, not commits/tags alone.

## Reporting issues

Use the [issue templates](.github/ISSUE_TEMPLATE/). For "how do I…" questions, prefer [Discussions](https://github.com/iluebbe/maintenance_supporter/discussions) over Issues.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability disclosure.

## License

MIT — see [LICENSE](LICENSE). By contributing you agree your contribution is under the same license.
