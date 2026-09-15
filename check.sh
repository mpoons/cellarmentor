#!/bin/sh
# Syntaxcontrole van cellarmentor.html, zonder browser. Rapporteert alleen; repareert niets.
# 1. elk <script>-blok apart door node --check
# 2. alle blokken samen in één bestand (vangt dubbele const/let over blokken heen)
# 3. typografische aanhalingstekens (“ ”) in HTML-attributen
# 4. index.html is gelijk aan wat build.sh zou maken
# 5. de tests in tests/*.test.js (node --test): de pure regels, geladen uit cellarmentor.html zelf
# Exitcode 0 = alles goed, 1 = minstens één bevinding.
cd "$(dirname "$0")" || exit 1
tmp=$(mktemp -d) || exit 1
trap 'rm -rf "$tmp"' EXIT
fouten=0

n=$(awk '/^<script>$/{n++} END{print n+0}' cellarmentor.html)
awk -v dir="$tmp" '
  /^<script>$/ {in_s=1; n++; f=dir "/blok" n ".js"; next}
  /^<\/script>$/ {in_s=0; next}
  in_s {print > f}
' cellarmentor.html
for f in "$tmp"/blok*.js; do
  if ! node --check "$f" 2>"$tmp/err"; then
    echo "FOUT in $(basename "$f" .js):"; cat "$tmp/err"; fouten=1
  fi
done
echo "scriptblokken apart: $n gecontroleerd"

cat "$tmp"/blok*.js > "$tmp/alles.js"
if node --check "$tmp/alles.js" 2>"$tmp/err"; then
  echo "scriptblokken samen: goed"
else
  echo "FOUT in de blokken samen (dubbele declaratie?):"; cat "$tmp/err"; fouten=1
fi

if perl -CSD -ne 'print "$.:$_" if /<[^>]*[\x{201C}\x{201D}][^>]*>/' cellarmentor.html >"$tmp/q" && [ -s "$tmp/q" ]; then
  echo "FOUT: typografische aanhalingstekens in een tag:"; cat "$tmp/q"; fouten=1
else
  echo "aanhalingstekens in tags: goed"
fi

{ cat head.html; cat cellarmentor.html; printf '\n</body>\n</html>\n'; } > "$tmp/index.html"
if cmp -s "$tmp/index.html" index.html; then
  echo "index.html: actueel"
else
  echo "FOUT: index.html is niet gelijk aan de build. Draai ./build.sh"; fouten=1
fi

if node --test tests/*.test.js >"$tmp/tests" 2>&1; then
  echo "tests: $(grep -c '^ok ' "$tmp/tests") geslaagd"
else
  echo "FOUT in de tests:"; grep -E '^not ok|^# (pass|fail)|Error|expected|actual' "$tmp/tests" | head -40; fouten=1
fi

grep -o "cellarmentor-v[0-9]*" sw.js | head -1 | sed 's/^/service worker: /'
[ $fouten -eq 0 ] && echo "ALLES GOED" || echo "BEVINDINGEN"
exit $fouten
