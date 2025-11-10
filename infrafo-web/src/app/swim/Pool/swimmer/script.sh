#!/bin/bash

set -euo pipefail

COMBINED_FILE="combined.txt"

: > "$COMBINED_FILE"

find . -type f ! -name "$COMBINED_FILE" -print0 \
  | sort -z \
  |	while IFS= read -r -d '' f; do
		exec 3>>"$COMBINED_FILE"
		printf '= %s =\r\n' "$(basename "$f")" >&3 
		cat -- "$f" >&3
		printf '\r\n' >&3
		exec 3>&-
	done