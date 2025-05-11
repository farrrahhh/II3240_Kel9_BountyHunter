/*
 * Complete project details at https://RandomNerdTutorials.com/esp32-load-cell-hx711/
 * HX711 library for Arduino - example file
 * https://github.com/bogde/HX711
 */

 #include <Arduino.h>
 #include "HX711.h"
 
 // HX711 circuit wiring
 const int LOADCELL_DOUT_PIN = 15;
 const int LOADCELL_SCK_PIN = 4;
 
 HX711 scale;
 
 void setup() {
   Serial.begin(115200);
   Serial.println("HX711 Demo");
   Serial.println("Initializing the scale");
 
   scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
 
   Serial.println("Before setting up the scale:");
   Serial.print("read: \t\t");
   Serial.println(scale.read());      
 
   Serial.print("read average: \t\t");
   Serial.println(scale.read_average(20));   
 
   Serial.print("get value: \t\t");
   Serial.println(scale.get_value(5));   
 
   Serial.print("get units: \t\t");
   Serial.println(scale.get_units(5), 1);  
 
   // Ganti -7050 dengan faktor kalibrasi sesuai hasil uji kamu
   scale.set_scale(-7050);  
   scale.tare();              
 
   Serial.println("After setting up the scale:");
 
   Serial.print("read: \t\t");
   Serial.println(scale.read());                 
 
   Serial.print("read average: \t\t");
   Serial.println(scale.read_average(20));       
 
   Serial.print("get value: \t\t");
   Serial.println(scale.get_value(5));   
 
   Serial.print("get units: \t\t");
   Serial.println(scale.get_units(5), 1);        
 
   Serial.println("Readings:");
 }
 
 void loop() {
   Serial.print("one reading:\t");
   Serial.print(scale.get_units(), 1);
   Serial.print("\t| average:\t");
   Serial.println(scale.get_units(10), 5);
 
   scale.power_down();             
   delay(5000);
   scale.power_up();
 }