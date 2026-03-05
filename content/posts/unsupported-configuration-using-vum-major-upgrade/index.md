+++
title = "Unsupported Configuration when using VUM for a Major Upgrade"
date = "2014-11-06T00:00:05Z"
draft = false
tags = [ "how to", "tips", "virtualization", "vmware",]
categories = [ "Virtualization",]
featureimage = "featured.jpg"
+++


I've recently been working on getting my environment upgraded from vSphere 5.1 to 5.5. Last week I replaced one vCenter server with a clean install and upgraded another, in process implementing home brewed certificates thanks in no small part to Derek Seaman's excellent [SSL toolkit](http://vexpert.me/toolkit55 "Derek Seaman SSL 5.5 Toolkit") and tutorials. With that done and nice and clean this week I turned towards getting the ESX hosts updated. Like all right thinking folks, I typically like to use vSphere Update Manager for this task in a vCenter supported environment. The first host went very well and was up and patched without issue. After that the wheels fell off for the other two. I was continuously getting "Unsupported configuration" when I would try to scan the host, if I tried to push through and Remediate it would fail with "Software or system configuration of host &lt;hostnamehere&gt; is incompatible. Check scan results for details." Nice error messages right? I tried a few things, reinstalling the management agents via [VMware KB 1031919](http://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=1031919), rebooting the host, etc. After no luck there I logged a case with VMware where we began trying to find more information in the vua.log and verifying the correct fdm agent is installed via the *esxcli software vib list | grep fdm* command. In the end we were able to find my issue but I'll be honest the documentation and logging in this scenario is pretty bad. When Veeam Backup &amp; Replication creates a vPowerNFS share, mounting your backup datastore as an addressable datastore to your host that is added in at least one way as a series of lines in the /etc/vmware/esx.conf file as shown below:

```
/nas/VeeamBackup_backupserver/readOnly = "false"
/nas/VeeamBackup_backupserver/enabled = "true"
/nas/VeeamBackup_backupserver/host = "backupserver.domain.local"
/nas/VeeamBackup_backupserver/share = "/VeeamBackup_backupserver"
```
 [

{{< figure src="tasks-and-events-output-300x69.jpg" alt="tasks-and-events-output" >}}

](tasks-and-events-output.jpg)This is great except as I've moved from Veeam server to Veeam server with different names and I dismounted and removed the different datastores from the hosts the old lines of config weren't removed from esx.conf. Further after finally seeing the 'Error in ESX configuration file (esx.conf)' we got lead down the rabbit hole of the preprocessing of a VUM upgrade. Evidently one of the first steps (at the 12% mark of the remediate task in my case) is to run a variant of the esxcfg-info CLI command which in my case was producing this: ```
~ # esxcfg-info | grep 'System UUID'
Error: Unable to resolve hostname 'backupserver.domain.local'
~ #
```
 [

{{< figure src="scan-after-300x188.jpg" alt="scan-after" >}}

](scan-after.jpg)where backupserver.domain.local was the name of an old Veeam server we had used. When the unfiltered esxcfg-info command it would begin listing but would eventually bomb with the same error. After seeing the command output I opened up the esx.conf file with vi, found the offending lines of configuration and removed them. After saving the file I was able to scan the host again and the scan reported the host as being non-compliant instead of incompatible, just what we were looking for. A remediation then was successful and I was back in business. One item of note if you find yourself wanting to try this yourself is make sure you take a backup of the esx.conf file as a miss step here could result in production datastore being unavailable. For those not too familar with Linux style commands you can do this easily with ```
cp /etc/vmware/esx.conf /tmp/esx.conf
```
 **[

{{< figure src="original-error-300x188.jpg" alt="original-error" >}}

](original-error.jpg)Conclusion** In the end what I do know is that the act of adding a NFS datastore to an ESX host and then later removing it both from ESXi configuration as well as the underlying DNS zone is what caused the blocking of my upgrade. Now what I don't know if this is due to it being programmatically added by Veeam and then manually removed at a later date or if this is a situation that is common to the use of NFS datastores in general. More importantly, it would be great if VMware would work on how it is reporting such configuration issues. Even taking me out of the equation, if it takes your own Support Engineer 1.5 hours to track it down it isn't documented enough.