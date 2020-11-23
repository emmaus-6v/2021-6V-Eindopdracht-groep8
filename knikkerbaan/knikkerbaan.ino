const int ledPin =  LED_BUILTIN;

// globale variabelen
int ledState = LOW;               // status van de LED
unsigned long millisVorigeVerandering = 0; // bewaard tijd van laatste LED-verandering

// andere constanten
const long interval = 1000;           // interval in milliseconden

void setup() {
  // stel ledpin in als output:
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // tijd van nu
  unsigned long millisNu = millis();

  // is de verstreken tijd sinds de laatste verandering langer dan de interval?
  if (millisNu - millisVorigeVerandering >= interval) {    
    // bewaar tijdstip van de verandering die we hierna gaan doen
    millisVorigeVerandering = millisNu;

    // zet de status van de LED om
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }

    // geef de pin de waarde van de status
    digitalWrite(ledPin, ledState);
  }
}
