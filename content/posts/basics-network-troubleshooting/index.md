+++
title = "The Basics of Network Troubleshooting"
date = "2016-06-08T09:35:57Z"
draft = false
tags = [ "#TheMoreYouKnow", "how to", "switching", "troubleshooting",]
categories = [ "Education", "Networking",]
featureimage = "featured.jpg"
+++


The following post is something I wrote as an in-house primer for our help desk staff. While it a bit down level from a lot of the content here I find more and more the picking and reliably going with a troubleshooting methodology is somewhat of a lost art. If you are just getting started in networking or are troubleshooting connectivity issues at your home or SMB this would be a great place to start.

We often get issues which are reported as application issues but end up being network related. There are a number steps and logical thought processes that can make dealing with even the most difficult network issues easy to troubleshoot. The purpose of this post is to outline many of the basic steps of troubleshooting network issues, past that it's time to reach out and ask for assistance.

1. **<span id="step_title_9f5bd46c-6a3b-46d7-8234-5299607b1e62">Understand the basics of OSI model based troubleshooting</span>**
    
    The conceptual idea of how a network operates within a single node (computer, smartphone, printer, etc.) is defined by something called the OSI reference model. The OSI model breaks down the operations of a network into 7 layers, each of which is reliant on success at the layers below it (inbound traffic) and above it (outbound traffic). The layers (with some corresponding protocols you'll recognize) are:
    
     7. Application: app needs to send/receive something (HTTP, HTTPS, FTP, anything that the user touches and begins/ends network transmission) 6. Presentation: formatting &amp; encryption (VPN and DNS host names) 5. Session: interhost communication (nothing to see here:)) 4. Transport: end to end negotiations, reliability (the age old TCP vs. UDP debate) 3. Network: path and logical addressing (IP addresses &amp; routing) 2. Data Link: physical addressing (MAC addresses &amp; switches) 1. Physical: physical connectivity (Is it plugged in?) The image below is a great cheat card for keeping these somewhat clear: \[caption id="attachment\_477" align="aligncenter" width="800"\][

{{< figure src="OSI_2014.jpg" alt="OSI_2014" >}}

](OSI_2014.jpg) Image source: http://www.gargasz.info/osi-model-how-internet-works/\[/caption\] How OSI is used today is as a template for how to understand and thus troubleshoot networking issues. The best way to troubleshoot any IT problem that has the potential to have a network issue is from the bottom of the stack upwards. Here are a few basic steps to get you going with troubleshooting.
2. **<span id="step_title_334b3416-ad21-4dc9-b4d1-38978d023705">Is it plugged in?</span>**
    
    This may seem like a smart ass answer, but many times this is just the case. Somebody's unplugged the cable or the clip has broken off the Cat6 cable and every time somebody touches the desk it wiggles out. Most of the time you will have some form of a light to tell you that you have both connectivity to the network (usually green) and are transmitting on the network (usually orange).
    
     This troubleshooting represents layer 1 troubleshooting.
3. **<span id="step_title_381099d7-ea8d-4143-89b4-7237ed712038">Is the network interface enabled?</span>**
    
    So the cable is in and maybe you've tried to plug the same cable from the wall into multiple devices; you get link lights on other devices but no love on the device you need. This may represent a Data Link issue where the Network Interface Card (NIC) has been disabled in the OS. From the client standpoint this would be within Windows or Mac OSX or whatever, on the other side it's possible the physical interface on the switch that represents the other end of the wire may be disabled. Check out the OS first and then reach out to your network guy to check the switch if need be.
4. **<span id="step_title_b8485ac3-b2e7-428a-b429-fde6ad42c9b6">Can the user ping it?</span>**
    
    Moving up to the Network layer, the next step is to test if the user can ping the device which they are having an issue with. Have the user bring up a command prompt and ping the IP address of the far end device.
5. **<span id="step_title_43413ab9-04a8-444b-b9e4-f27afc460705">Can you ping it?</span>**
    
    By the very nature of you being an awesomesauce IT person you are going to have more ability to test than the user. To start with, see if you can ping it from your workstation. This will rule out user error and potentially any number of other issues as well. Next if you can't, are you on the same subnet/VLAN as the device you are trying to access? If not try to access a device in the same subnet as the endpoint device you are testing and ping it from there. That may give you some insight into having issues with default gateway configuration or underlying routing (aka Layer 3) issues.
6. **<span id="step_title_ca256b28-48d6-4d56-aeea-460db159ab0d">Can you ping it by name?</span>**
    
    Let's say you can ping it by IP address from all of the above. If the user is trying to access something by name, say server1.foo.com have them ping that as well. It's possible that while the lower three layers of the stack are operating well, something has gone awry with DNS or other forms of naming that happen at the Presentation layer.
7. **<span id="step_title_1cb1218c-fdc3-4476-934d-b8c040cc667b">Application firewalls and the like</span>**
    
    Finally we've reached the top of the stack and we need to take a look at the individual applications. So far you've verified that the cable's plugged in, the NICs on both sides are enabled and you can ping between the user and the far device by both IP and hostname but still the application won't work so now's when we look at the actual application and immediately start rebooting things.
    
     Just kidding :) No now we need to look at services that are being present to the network. If we are troubleshooting an e-mail issue is the services running on the server and can we connect to it. When talking about TCP/IP-based traffic (meaning all traffic) all application layer traffic occurs over either a TCP or UDP protocol port. This isn't something you physically plug-in, but rather it is a logical slot that an application is known to talk on, kind of like a CB radio channel. For example SMTP typically runs on TCP port 25, FTP 21, printing usually on 9100. If you are troubleshooting an e-mail issue bring up a command prompt and try to connect to the device via telnet like "telnet server1.foo.com 25." If the SMTP server is running on that port at the far end then it will answer, if not the connection will time out.
8. **<span id="step_title_d64b2efb-d5e5-4bbb-99ff-4a54cceaf13b">Call in reinforcements</span>**
    
    If you've got this far it's going to take a combination of multiple brains and probably some application owners/vendors to unwrangle the mess those crazy users have made. Reach out to your network and application teams or call in vendor support at this point.
 
Network troubleshooting isn't hard, you just have to know where to start.