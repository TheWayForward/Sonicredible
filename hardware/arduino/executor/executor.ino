String code;
void setup() {
  Serial.begin(9600);
  pinMode(7, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    // code = Serial.readStringUntil('\n');
    code = Serial.read();
    if (code == "0") {
      digitalWrite(13, HIGH);
    }
    if (code == "1") {
      digitalWrite(13, LOW);
    }
  }
}
