# obs-controller

Steuersoftware um Daten vom [wptv-sessions-connector](https://github.com/wptv-tools/wptv-sessions-connector) entgegen zu nehmen und daraus Content für OBS und das [Digital Signage](https://github.com/wptv-tools/digital-signage) zu generieren.

## Vorraussetzungen

Für die Verwendung der Skripte muss eine OBS Installation vorhaden sein. Zudem muss das [Websocket Plugin für OBS](https://github.com/Palakis/obs-websocket/releases) installiert werden. Im Anschluss muss in OBS unter Werkzeuge / Websocket Servereinstellungen ein Passwort gesetzt werden.

## Installation

Das Projekt ist Node JS programmiert und benötigt von daher zunächst eine lokale [Node Installation](https://nodejs.org/en/download/).

Rollup packt die Javascript Dateien und ermöglicht den Einsatz von ES6. Rollup wird auf der Kommandozeile mit dem Befehl
`npm install --global rollup` installiert. 

Um die weiteren Abhängigkeiten des Projektes zu installieren, den Befehl `npm install` in dem Hauptverzeichnis des Projektes aufrufen. 

Anschließend muss das gebundelte JS mittels `npm run-script build` geschrieben werden und die Skripte können denn über die datei dist/bundle.js eingebunden werden.
