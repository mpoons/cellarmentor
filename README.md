# CellarMentor, wijnkelder

Persoonlijke wijnkelder-app: etiketten scannen, voorraad en locaties bijhouden, drinkvensters volgen, spijs-wijnpairing twee kanten op, de wijnkaart in het restaurant lezen, drink-historie met sterren, prijzen met bron en een verlanglijst. Nederlands en Engels.

**App:** https://mpoons.github.io/cellarmentor/ Open hem op je telefoon en kies "Zet op beginscherm".

## Hoe het werkt

- **Zonder account** staat alles op je eigen apparaat (localStorage en IndexedDB). Drinkvenster en pairing komen dan uit ingebouwde kelderregels. Back-up maken en inlezen kan altijd via Instellingen.
- **Met een account** (Meer → Account, e-mail en wachtwoord via Supabase) synchroniseert je kelder tussen apparaten, en leest de sommelier etiketten en wijnkaarten via de CellarMentor-server. Dat kost credits: 20 per maand gratis, CellarMentor Plus (nog niet te koop) geeft er 300. De AI-sleutel staat op de server, nooit in de app.
- Werkt offline dankzij een service worker; alleen sync en de sommelier hebben netwerk nodig.

## Bestanden

| Bestand | Rol |
|---|---|
| `cellarmentor.html` | De bron: één bestand met opmaak, schermen en alle code in zes scriptblokken. Ook de bron voor de Claude-artifactversie. |
| `head.html` + `build.sh` | Wrapper en buildscript: `./build.sh` maakt `index.html`. |
| `index.html` | De gehoste app. Nooit met de hand bewerken. |
| `sw.js` | Service worker. Versienummer (`cellarmentor-vN`) ophogen bij elke wijziging. |
| `check.sh` | Syntaxcontrole en tests, zonder browser. |
| `supabase/` | Edge Functions (`ai`, `billing`, `stripe-webhook`, `herinnering`, `kosten`) en de SQL van de tabellen. |

Hoe het in elkaar zit staat in `ARCHITECTURE.md`; waarom het zo is gebouwd in `DECISIONS.md`; de werkafspraken in `CLAUDE.md`.

Gebouwd met Claude Code.
