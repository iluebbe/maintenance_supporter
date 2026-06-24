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

If you touched panel strings (`frontend-src/locales/*.json`) or config-flow strings (`translations/*.json`):

- [ ] All 18 languages updated, or
- [ ] At least the language(s) you can speak (other languages will fall back to English)
- [ ] `pytest tests/test_i18n.py` confirms key parity across all languages (backend `translations/*.json` + panel `frontend-src/locales/*.json`)

## Notes for reviewer

<!-- Anything subtle, anything you're not sure about, anything you tried but discarded. -->
