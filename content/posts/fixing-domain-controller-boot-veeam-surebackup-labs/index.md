+++
title = "Fixing Domain Controller Boot in Veeam SureBackup Labs"
date = "2016-12-19T16:10:07Z"
draft = false
tags = [ "how to", "troubleshooting", "veeam", "Veeam Vanguard",]
categories = [ "Systems", "Veeam", "Virtualization",]
featureimage = "featured.png"
+++


We've been dealing with an issue for past few runs of our monthly SureBackup jobs where the Domain Controller boots into Safe Mode and stays there. This is no good because without the DC booting normally you have no DNS, no Global Catalog or any of the other Domain Controller goodness for the rest of your servers launching behind it in the lab. All of this seems to have come from a change in how domain controller recover is done in Veeam Backup and Replication 9.0, Update 2 as discussed in [a post on the Veeam Forums](https://forums.veeam.com/veeam-backup-replication-f2/surebackup-dc-starts-in-safe-mode-t37064.html). Further I can verify that if you call Veeam Support you get the same answer as outlined here but there is no public KB about the issue. There are a couple of ways to deal with this, either each time or permanently, and I'll outline both in this post. The booting into Safe Mode is totally expected, as a recovered Domain Controller object should boot into Directory Services Restore mode the first time. What is missing though is that as long as you have the Domain Controller box checked for the VM in your application group setup then once booted Veeam should modify the boot setup and reboot the system before presenting it to you as a successful launch. This in part explains why when you check the Domain Controller box it lengthens the boot time allowed from 600 seconds to 1800 seconds by default. 
## On the Fly Fix
If you are like me and already have the lab up and need to get it fixed without tearing it back down you simply need to clear the Safe Boot bit and reboot from Remote Console. I prefer to

1. Make a Remote Console connection to the lab booted VM and login
2. Go to Start, Run and type "msconfig"
3. Click on the Boot tab and uncheck the "Safe boot" box. You may notice that Active Directory repair option is selected
4. Hit Ok and select to Restart
 
 Alternatively if you are command inclined a method is available via [Veeam KB article 1277 ](https://www.veeam.com/kb1277) where you just run these commands 
 ```shell
bcdedit /deletevalue safeboot
shutdown -t 01 -r
```

 it will reboot itself into normal operation. Just to be clear, either of these fixes are temporary. If you tear down the lab and start it back to the same point in time you will experience the same issue. 
 
 ## The Permanent Fix
 The problem with either of the above methods is that while they will get you going on a lab that is already running about 50% of the time I find that once I have my DC up and running well I have to reboot all the other VMs in the lab to fix dependency issues. By the time I'm done with that I could have just relaunched the whole thing. To permanently fix the root issue is you can revert the way DCs are handled by creating a single registry entry as shown below on the production copy of each Domain Controller you run in the lab. 
 ```shell
[HKEY_LOCAL_MACHINE\SOFTWARE\Veeam\Veeam Backup and Replication]
"UseGranularBcdRestore"=dword:00000000
```

 Once you have this key in place on your production VM you won't have any issues with it going forward as long as the labs you launch are from backups made after that change is put in use. My understanding is this is a known issue and will eventually be fixed but at least as of 9.5 RTM it is not.