+++
title = "Quieting the LogPartitionLowWaterMarkExceeded Beast in Cisco IPT 9.0.x Products"
date = "2016-03-30T09:40:55Z"
draft = false
tags = [ "how to", "telephony", "tips", "troubleshooting", "uccx",]
categories = [ "Uncategorized", "Voice",]
featureimage = "featured.jpg"
+++


As a SysAdmin I'm used to waking up, grabbing my phone and seeing the 20 or so e-mails that the various systems and such have sent me over night, gives me an idea of how the day will go and what I need start with. Every so often though you get that morning where the 20 becomes 200 and you just want to roll over and go back to bed. This morning I had about 200, the vast majority of which was from my Cisco Unified Contact Center Express server with the subject "LogPartitionLowWaterMarkExceeded." Luckily I've had this before and know what to do with it but on the chance you are getting it too here's what it means and how to deal with it in an efficient manner. **WTF Is This?!?** Or at least that was my response the first time I ran into this. If you are a good little voice administrator one of the first things you do when installing your phone system or taking one over due to job change is setup the automatic alerting capability in the Cisco Unified Real Time Monitoring Tool (or RTMT, you did install that, right?) so that when things go awry you know in theory before the users do. One of the downsides to this system is it is an either on or off alerting system meaning what ever log events are saved within the system are automatically e-mailed at the same frequency. This particular error message is the by-product of a bug ([CSCul18667](https://bst.cloudapps.cisco.com/bugsearch/bug/%20CSCul18667)) in the 9.0.x releases of all the Cisco IP Telephony products in which the JMX logs produced by the at the time new Unified Intelligence Center didn't get automatically deleted to maintain space on the log partition. While this has long since been fixed phone systems are one of those things that don't get updated as regularly as they should and such it is still and issue. The resulting effect is that when you reach the "warning" level of partition usage (Low Water Mark) it starts logging ever 5 minutes that the level has been reached. **Just Make the Screaming Stop** Now that we know what the issue is how do we fix it?

| Go back to the RTMT application, and connect to the affected component server. Once there you will need to navigate to the Trace &amp; Log Central tool then double-click on the Remote Browse option. | [

{{< figure src="remote-browse-269x300.jpg" alt="remote-browse" >}}

](remote-browse.jpg) |
|---|---|
| Once in the Remote Browse dialog box choose "Trace Files" and then we really only need one of the services selected, Cisco Unified Intelligence Center Serviceability Service and then Next, Next, Finish. | [

{{< figure src="select-cuic-261x300.jpg" alt="select-cuic" >}}

](select-cuic.jpg) |
| Once it is done gathering all of the log files it will tell you your browse is ready. You then need to drill all the way down through the menu on each node until you reach "jmx." Once you double-click on jmx you will see the bonanza of logs. It is best to just click one, Ctrl+A to select all and then just hit the Delete button. | [

{{< figure src="browse-to-node-300x198.jpg" alt="browse-to-node" >}}

](browse-to-node.jpg) |
| After you hit delete it will probably take it quite a while to process through. You will then want to click on the node name and hit refresh to check but when done you should be left with just the currently active log file. Afterwards if you have multiple nodes of the application you will need to repeat this process for the other. | [

{{< figure src="all-clean-300x178.jpg" alt="all-clean" >}}

](all-clean.jpg) |

 And that's it really. Once done the e-mail bleeding will stop and you can go about the other 20 things you need to get done this day. If you are experiencing this and if possible I would recommend being smarter than me and just update your CIPT components to a version newer than 9.0 (11.5 is the current release), something I am hoping to begin the process of in the next month or so.