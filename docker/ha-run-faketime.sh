#!/usr/bin/with-contenv bashio
# ==============================================================================
# Start Home Assistant service (with optional faketime support)
# ==============================================================================

cd /config || bashio::exit.nok "Can't find config folder!"

# When faketime is enabled, ONLY load faketime (skip jemalloc — they deadlock).
# When faketime is disabled, use the standard jemalloc allocator.
if [[ -n "${FAKETIME_ENABLED:-}" ]] && [[ -f /usr/local/lib/faketime/libfaketime.so.1 ]]; then
  export LD_PRELOAD="/usr/local/lib/faketime/libfaketime.so.1"
  bashio::log.info "Faketime enabled — LD_PRELOAD=${LD_PRELOAD}"
else
  export LD_PRELOAD="/usr/local/lib/libjemalloc.so.2"
  export MALLOC_CONF="background_thread:true,metadata_thp:auto,dirty_decay_ms:20000,muzzy_decay_ms:20000"
fi

exec python3 -m homeassistant --config /config
