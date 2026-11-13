#!/usr/bin/env bash
# Evento pane.agent_status_changed: una línea por cambio en el registro del día
# y token $espera en el espacio mientras su agente está blocked (unknown no lo borra).
set -u
dir="${HERDR_PLUGIN_STATE_DIR:-/tmp}"; mkdir -p "$dir"
printf '%s\n' "${HERDR_PLUGIN_EVENT_JSON:-}" > "$dir/ultimo-evento.json"
ev="${HERDR_PLUGIN_EVENT_JSON:-{\}}"
ws=$(jq -r '.. | .workspace_id? // empty' <<<"$ev" | head -1)
st=$(jq -r '.. | .agent_status? // empty' <<<"$ev" | head -1)
ag=$(jq -r '.. | .agent? | strings' <<<"$ev" | head -1)
printf '%s\t%s\t%s\t%s\n' "$(date '+%F %T')" "$ws" "${ag:-?}" "${st:-?}" >> "$dir/actividad-$(date +%Y%m%d).tsv"
[ -n "$ws" ] || exit 0
bin="${HERDR_BIN_PATH:-herdr}"
if [ "$st" = "blocked" ]; then
  "$bin" workspace report-metadata "$ws" --source kairos:espera --token "espera=espera a Sil desde $(date +%H:%M)" >/dev/null 2>&1
elif [ "$st" != "unknown" ]; then
  "$bin" workspace report-metadata "$ws" --source kairos:espera --clear-token espera >/dev/null 2>&1
fi
exit 0
