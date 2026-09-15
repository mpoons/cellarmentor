#!/bin/sh
# Bouwt de brug: dezelfde app op het oude adres mpoons.github.io/caveau/ (repo mpoons/caveau).
# Wie daar de kelder heeft staan, ziet een verhuisbanner (BRUG in cellarmentor.html) en raakt niets kwijt.
# Draaien na elke wijziging die de brug moet meekrijgen (vooral sync- en back-upcode); commit en push daarna in ../caveau.
cd "$(dirname "$0")" || exit 1
doel=../caveau
[ -d "$doel/.git" ] || { echo "geen checkout in $doel (git clone https://github.com/mpoons/caveau.git ../caveau)"; exit 1; }
./build.sh >/dev/null || exit 1
cp index.html manifest.webmanifest icon-192.png icon-512.png apple-touch-icon.png .nojekyll "$doel/"
mkdir -p "$doel/fonts" && cp fonts/* "$doel/fonts/"
# Eigen cachenaam, zodat de oude Caveau-cache (caveau-v74) op de telefoons wordt opgeruimd.
v=$(grep -o "cellarmentor-v[0-9]*" sw.js | head -1 | sed 's/cellarmentor-v//')
sed "s/const CACHE = 'cellarmentor-v[0-9]*';/const CACHE = 'caveau-brug-v$v';/" sw.js > "$doel/sw.js"
printf '# Brug\n\nHet oude adres van CellarMentor (voorheen Caveau). Gebouwd door `brug.sh` in de repo `mpoons/cellarmentor`; hier niets met de hand bewerken.\n' > "$doel/README.md"
echo "brug gebouwd in $doel (cache caveau-brug-v$v)"
