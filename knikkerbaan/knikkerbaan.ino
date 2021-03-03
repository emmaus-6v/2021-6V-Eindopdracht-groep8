#define SENSORPIN 4
#include <Servo.h>
#include <SPI.h>
#include <WiFiNINA.h>
#include <utility/wifi_drv.h>

char ssid[] = ".....";    // naam van het WiFi-netwerk. Dat heet SSID
char pass[] = "......";  // WiFi-wachtwoord

int status = WL_IDLE_STATUS;

// domeinnaam server van gitpod
char server[] = "blush-chipmunk-37ks8m2p.ws-eu03..gitpod.io";

// We maken een client-object aan dat berichten naar de server kan sturen
// en antwoord terug kan krijgen.
WiFiSSLClient client;

long statusTimerLaatsteActivering = 0;
int  statusTimerWachtTijd = 1000;  // elke seconde 'tellen' we een knikker

long wifiTimerLaatsteActivering = 0;
int  wifiTimerWachtTijd = 30000; // elke 30 seconden sturen we een update naar de server

int ServoLinks = 0;
int ServoRechts = 50;
Servo servo;

int pos = 0; // begin positie servo
// variables will change:
int sensorState = 0, lastState = 0;       // variable for reading the pushbutton status
int AantalKnikkers = 0;
int baanStatus = 0;
int GroenLed1 = 3;
int RoodLed1 = 2;
int GroenLed2 = 5;
int RoodLed2 = 6;

void Links (int groenPin1, int roodPin1, int groenPin2, int roodPin2) {
  digitalWrite(groenPin1, HIGH);
  digitalWrite(roodPin1, LOW);
  digitalWrite(groenPin2, LOW);
  digitalWrite(roodPin2, HIGH);
}

void Rechts (int groenPin1, int roodPin1, int groenPin2, int roodPin2) {
  digitalWrite(groenPin1, LOW);
  digitalWrite(roodPin1, HIGH);
  digitalWrite(groenPin2, HIGH);
  digitalWrite(roodPin2, LOW);
}
void setup() {
  // initialize the sensor pin as an input:
  pinMode(SENSORPIN, INPUT);
  digitalWrite(SENSORPIN, HIGH); // turn on the pullup
  servo.attach(8); // pin waar servo inzit
  servo.write(0);

  Serial.begin(9600);
  while (!Serial) {
    ; // we wachten hier net zolang tot de seriele poort verbinding heeft
  }
  /*
    // verbind met de WiFi
    checkWiFiModule();
    verbindMetWiFiNetwerk();
  */
  statusTimerLaatsteActivering = millis();
  wifiTimerLaatsteActivering =  millis();

  pinMode (GroenLed1, OUTPUT);
  pinMode (RoodLed1, OUTPUT);
  pinMode (GroenLed2, OUTPUT);
  pinMode (RoodLed2, OUTPUT);
}

void loop() {
  /*
  if (millis() > statusTimerLaatsteActivering + statusTimerWachtTijd) {
    statusTimerLaatsteActivering = millis();
    baanStatus = random(10);
  }

  // controleer of de wifiTimer 'af moet gaan'
  if (millis() > wifiTimerLaatsteActivering + wifiTimerWachtTijd) {
    wifiTimerLaatsteActivering = millis();
    stuurUpdate();
  }

  if (client.connected()) {
    checkHTTPResponse();
  }

  delay(50);
  */

  // read the state of the pushbutton value:
  sensorState = digitalRead(SENSORPIN);

  // check if the sensor beam is broken
  // if it is, the sensorState is LOW:
  /*
  if (sensorState == LOW) {

    AantalKnikkers ++;
    Serial.println("Aantalknikkers");
  }
*/




  if (sensorState && !lastState) {
    Serial.println("Unbroken");
  }
  if (!sensorState && lastState) {
    Serial.println("Broken");
    AantalKnikkers ++;
    Serial.println("Aantalknikkers");
  }

  if (AantalKnikkers % 2 == 0/*AantalKnikkers >= 20 && AantalKnikkers <= 30 && AantalKnikkers >= 40 && AantalKnikkers <= 50 && AantalKnikkers >= 60 &&  AantalKnikkers <= 70 &&  AantalKnikkers >= 80*/) {
    servo.write (ServoLinks);
  }

  else {
    servo.write (ServoRechts);
  }

  if (ServoLinks == HIGH) {
    Links(GroenLed1, RoodLed1, GroenLed2, RoodLed2);
  }
  else {
    Rechts(GroenLed1, RoodLed1, GroenLed2, RoodLed2);
  }
  lastState = sensorState;
}

void stuurUpdate() {
  Serial.println("\nStart verbinding met server");

  if (client.connect(server, 443)) {
    Serial.println("Verbonden met de server. HTTP verzoek wordt verstuurd.");
    client.print("GET /api/setKnikkerbaanStatus/");
    client.print(baanStatus);
    client.println(" HTTP/1.1");
    client.print("Host: https://blush-chipmunk-37ks8m2p.ws-eu03.gitpod.io/");
    client.println(server);
    client.println("Connection: close");
    client.println();
  }
  else {
    Serial.println("verbinding maken niet gelukt");
  }

}



void checkHTTPResponse() {
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  if (!client.connected()) {
    Serial.println("");
    Serial.println("---------EINDE ANTWOORD VAN DE SERVER----------");
    Serial.println("De verbinding met de server is verbroken");
    client.stop();
  }
}

void checkWiFiModule() {
  // controleer of er een WiFi module is
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  // controleer de versie van de firmware
  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }
}



void verbindMetWiFiNetwerk() {
  // probeer contact te maken met het opgegeven WiFi-netwerk:
  while (status != WL_CONNECTED) {
    Serial.print("Probeert te verbinden met SSID: ");
    Serial.println(ssid);

    // verbind met WiFi.begin
    status = WiFi.begin(ssid, pass);

    // wacht 4 seconden voor de verbinding:
    delay(4000);
  }
  // als je hier komt, betekent dat dat je verbonden bent.
  Serial.println("Verbonden met WiFi");

  // print informatie over het netwerk waarmee je verbonden bent
  printWiFiStatus();
}



void printWiFiStatus() {
  // print de naam van het netwerk waarmee je verbonden bent:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print het IP-adres dat je Arduino heeft gekregen:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP-adres: ");
  Serial.println(ip);

  // print de sterkte van het signaal:
  long rssi = WiFi.RSSI();
  Serial.print("Signaalsterkte (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

