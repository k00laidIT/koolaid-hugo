+++
title = "3 steps to really reset a Cisco 7900 Phone"
date = "2015-01-29T15:57:45Z"
draft = false
tags = [ "cisco", "how to", "telephony",]
categories = [ "Voice",]
featureimage = "featured.jpg"
+++


Recently had some issues with one of our phones at the office and you know how it goes, reboot it. What you may not know is that there are different levels of "reboot" for the 7900 series phones, each of which are a little more pervasive. In this post I'll outline how to go about performing these 3 ways to reset your desk phone to cure what may or may not be ailing you.

### **I. The Simple Reset**

 Sure you could go into ccmadmin and hit the reset button but that doesn't work as well if you are standing right in front of it. A quick reset can be performed by doing the following directly from the device 1. Hit the settings button on the device
2. Hit \*\*#\*\* on the keypad
3. You should then see the screen display the "Resetting..." message followed by a reboot
 
### **II. Configuration Erase**

 When you boot your 7900 series IP phone as part of the boot sequence it reaches out to your Publisher's TFTP server to grab a copy of either its specific configuration file or if none exist the default configuration file. Once this occurs it is stored locally to allow for quicker subsequent reboots. From time to time this locally cached copy will get gummed up and it is necessary to erase it and have it download a fresh copy. To do this the steps are 1. Hit the settings button on the device
2. Hit the \*\*# buttons in order, afterwards you will see "Settings Unlocked!" display on the screen and a "More" soft button appear on the screen
3. Hit the "More" soft button followed by the "Erase" soft button.
4. You should then see the screen display the "Resetting..." message followed by a reboot
 
### **III. Factory Reset**

 This is the big daddy, if neither of the previous fixes worked then this process will erase not only the configuration but any firmware updates you have pushed to it as well, resulting in a phone as fresh as when it left the factory from a software perspective. To perform this process do the following steps: 1. Unplug the power cable and/or the switch cable if using PoE
2. Plug the device back in, pressing and holding the "#" key before the Speaker button flashes on and off
3. Continue to hold the # button until each line button flashes on and off in sequence (amber).
4. Next release the # and in order hit 123456789\*0#
5. After the sequence is done correctly the line buttons will flash red and then the phone will reboot.
6. The phone will go through multiple reboot processes as various firmware loads and configuration files are downloaded.
7. Do not remove power in any way until the reset process is completed in its entirety. You will know that this is done when the phone either correctly registers to CUCM or display the "Registering..." message on the screen.
 
 That's it, if you've made it this far without fixing your issue then you either need to get back in CUCM and check you configurations of the device or contact TAC for a replacement device.