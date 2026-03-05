+++
title = "Updating the Code of a ipbase Licensed Cisco Catalyst 3750X Switch Stack"
date = "2014-06-03T09:49:52Z"
draft = false
tags = [ "cisco", "how to", "ios", "switching",]
categories = [ "Networking",]
featureimage = "featured.jpg"
+++


Here in the office the Access Layer of our switching infrastructure is handled completely with a 7 unit stack of Cisco <span class="scayt-misspell-word" data-scayt-word="3750X">3750X</span> switches. There is no need for these to do any routing other than <span class="scayt-misspell-word" data-scayt-word="intervlan">intervlan</span> so when purchased 3 years ago we just ordered the IP Base licensing level. Well from what I can tell there is a universal code base and a licensed feature level of each code revision. The universal naming convention looks like c3750e-universalk9-mz.122-55.SE1 while the <span class="scayt-misspell-word" data-scayt-word="ipbase">ipbase</span> looks like c3750e-ipbasek9-mz.150-2.SE6. What I found is that I do not have the ability to download the universal code of later releases due to my licensing level and possibly the lack of <span class="scayt-misspell-word" data-scayt-word="SmartNet">SmartNet</span> I keep on these, but I do have access to the <span class="scayt-misspell-word" data-scayt-word="ipbase">ipbase</span> code. When attempting to update the code on this stack I was presented with the error

<div> ```
Error: The image in the archive which would be used to upgrade
Error: system number 1 does not support the same feature set.
```
 After some searching [I found reference](http://slaptijack.com/networking/gotcha-upgrading-catalyst-to-new-feature-set/) to [others trying](https://supportforums.cisco.com/discussion/10409656/cat0-3750-upgrade-error-system-number-1-does-not-support-same-feature) to go from IP Base to Advanced IP Services code having to put the **/allow-feature-upgrad**e switch on the archive <span class="scayt-misspell-word" data-scayt-word="download-sw">download-sw</span> code in order to allow the upgrade as well as it seems a downgrade. Evidently this feature came about with IOS version 12.2(35). Now the upgrade progressed and I have happy little upgrades switches. </div><div><div> ```
switch#archive download-sw /overwrite /allow-feature-upgrade tftp://172.16.3.40/c3750e-ipbasek9-tar.150-2.SE6.tar
Loading c3750e-ipbasek9-tar.150-2.SE6.tar from 172.16.3.40 (via Vlan3): !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
[OK - 25671680 bytes]

Loading c3750e-ipbasek9-tar.150-2.SE6.tar from 172.16.3.40 (via Vlan3): !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
examining image...
extracting info (106 bytes)
extracting c3750e-ipbasek9-mz.150-2.SE6/info (522 bytes)
extracting info (106 bytes)

Stacking Version Number: 1.49

System Type:             0x00000002
  Ios Image File Size:   0x0137E200
  Total Image File Size: 0x0187BA00
  Minimum Dram required: 0x08000000
  Image Suffix:          ipbasek9-150-2.SE6
  Image Directory:       c3750e-ipbasek9-mz.150-2.SE6
  Image Name:            c3750e-ipbasek9-mz.150-2.SE6.bin
  Image Feature:         IP|LAYER_3|SSH|3DES|MIN_DRAM_MEG=128
....
All software images installed.
```
 Another note about this upgrade I found in the [official release notes](http://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst3750x_3560x/software/release/15-0_2_se/release/notes/OL25302.html#pgfId-193618) is any upgrade from 15.0(2)SE to later will result in a <span class="scayt-misspell-word" data-scayt-word="microcode">microcode</span> upgrade which when unmitigated will lead to an exceptionally long restart of the switch. You can mitigate this either by using the /<span class="scayt-misspell-word" data-scayt-word="force-ucode-reload">force-ucode-reload</span> parameter when downloading the code to the devices or by using the archive <span class="scayt-misspell-word" data-scayt-word="download-sw">download-sw</span> /<span class="scayt-misspell-word" data-scayt-word="upgrade-ucode">upgrade-ucode</span> privileged EXEC mode command afterwards. </div></div>