<!--
Thanks for your PR! A few quick checks make review faster.
Delete sections that don't apply.
-->

## Summary

<!-- What does this change and why? Link related issues with #123. -->

## Type of change

- [ ] Bug fix (`fix:` commit, behavior change, no new feature)
- [ ] New feature (`feat:` commit, additive)
- [ ] Refactor (no behavior change)
- [ ] Tests / docs / CI only
- [ ] Translation (panel or config flow strings)

## Testing

- [ ] `pytest tests/` — backend tests pass locally
- [ ] `cd custom_components/maintenance_supporter/frontend-src && npm test` — component tests pass
- [ ] `npm run build` — frontend bundle builds clean
- [ ] Manual browser check (panel + config flow) for UI changes
- [ ] No new logs / warnings on integration setup

## Translations

If you touched panel strings (`frontend-src/styles.ts`) or config-flow strings (`translations/*.json`):

- [ ] All 12 languages updated, or
- [ ] At least the language(s) you can speak (other languages will fall back to English)
- [ ] `node frontend-src/_audit.mjs` confirms key parity (or note why parity differs)

## Notes for reviewer

<!-- Anything subtle, anything you're not sure about, anything you tried but discarded. -->
