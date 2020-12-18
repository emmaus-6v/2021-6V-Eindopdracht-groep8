# Eindopdracht 6V

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Notalifeform/gitpodnode)
![6VWO Eindopdracht](https://img.shields.io/badge/6VWO-Eindopdracht-red)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/emmaus-6v/eindopdracht-groep8)

In dit repository beheer je het eindproject en plaats je de code voor
- de server (`server/server-app.js`)
- de webwidget (`server/public/widget.js`)
- de knikkerbaan (`knikkerbaan/knikkerbaan.ino`)


Het verslag schrijf je in `verslag.md`.

De database ontwerp je in `sql/create_tables`. Voorgegeven data stop je in `sql/seed.sql`

Je werkt in dit project actief met GitHub. Dat betekent dat je vanuit issues en het planbord werkt en tijdens het ontwikkelen op een goede manier gebruik maakt van branches en commits.
Zorg ervoor dat (voor zowel je groepsleden als de docent) altijd duidelijk is waar je mee bezig bent.

Arduino kun je niet ontwikkelen binnen GitPod. Deze code zul je op een andere manier moeten committen in GitPod.

## Algemene structuur
De webwidget en de knikkerbaan geven informatie aan de database en vragen ook informatie daar op.
De knikkerbaan blijft zo dus werken / informatie naar de database sturen, ook als de widget tijdelijk niet beschikbaar is. 

## Server
De server start en stop je met behulp van de debugger. Klik links op het icon met de kever of kies het menu Debug->Start Debugging. Je kunt breakpoint in je code aanbrengen
waardoor je programma wordt gepauzeerd en je kunt inspecteren hoe je programma functioneert.

## Widget
Het widget wordt door de server eenmalig als statisch bestand gestuurd naar een browser die erom vraag. De code van de widget wordt niet door GitPod uitgevoerd, maar door het browservenster
waarin het widget zichtbaar is. Het testen / debuggen van het widget doe je met de optie 'Javascript-console' van je browser. In Chrome vind je die onder het menu 'Weergave->Ontwikkelaar->Javascript-console'
en in Safari onder 'Ontwikkelaar-> Toon Javascript Console'. Je kunt daar ook breakpoints maken en de inhoud van variabelen inspecteren.

## Database
Voor het uittesten van queries kun je in de terminal van GitPod verbinding maken met je database. Doe dit door het volgende commando in te tikken:
`psql -d knikkerbaan -U api -W`. Vervolgens gebruik je het wachtwoord 'apipass'. Je zit nu in de database en kunt queries uitvoeren. Lange resultaten
kun je afbreken met de letter q. Je gaat uit de database met \q. Vergeet niet om achter iedere query een ; te plaatsen. Anders wordt de query bij een
return niet uitgevoerd.

## Handige links
* [Tinkercad](https://tinkercad.io) - voor het maken van een virtuele Arduino
* [KhanAcademy](https://khanacademy.org) - voor sql en javascript / p5js-functies
* [w3schools](https://w3shools.com) - extra javascript informatie
* [p5js](https://p5js.org/reference) - naslagmateriaal
* [Arduino](https://www.arduino.cc/reference) - naslagmateriaal
* [Arduino-lessen](http://arduino-lessen.nl) - lessen die je 5V heb gezien
* [Seeed wiki](https://wiki.seeedstudio.com/Grove/) - informatie over evt. Grove modules
* [Arduino Wifi board gebruiksklaar maken](https://www.arduino.cc/en/Guide/ArduinoUnoWiFiRev2)
* [Arduino Wifi voorbeelden](https://www.arduino.cc/en/Reference/WiFiNINA)
