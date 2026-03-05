+++
title = "VBR v10: A Few of My Favorite Things Part 1"
date = "2020-02-04T11:37:37Z"
draft = false
tags = [ "backup", "v10", "veeam",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


Veeam Backup and Replication v10‘s release is now imminent after a loooooong wait. In fact, as of yesterday we now have a tentative release date: [February 18, 2020](https://go.veeam.com/v10). For the past few weeks, I’ve been able to work with the first Release Candidate in the lab, and I’ve found quite a few things to love in this release that I’d like to share here.

#### Linux, Linux, Linux!

 Veeam Backup &amp; Replication has long been a Windows first solution and everything else a far distant second. That worked and continues to work really well, but in 2020 the needs of larger customers require automation and management workload shrinkage that Linux-based components lends to. With this release, we now have [Linux-based proxies](https://helpcenter.veeam.com/archive/backup/100/vsphere/backup_proxy.html) as an option. These are not deployable appliances. You deploy them in the same way as you would a Windows Proxy: deploy the VM, add it to your backup infrastructure, then add it as a proxy, which installs the necessary software. While many of you may have the same “what, no appliance?” reaction I did, this actually makes sense as it lets organizations develop their own templates based on their own requirements and security policies. Then they can use their automation method of choice to deploy. This will be a big hit for the VSAN crowd, which should have a proxy per host to be in line with best practices. Further, while we have long had the ability for Linux-based proxies (especially for those wishing to mount NFS datastores as backup repositories), they were never the first-class citizen Windows or appliance-based repos were. With this release we get experimental support for[ fast cloning with XFS and BRFS](https://helpcenter.veeam.com/archive/backup/100/vsphere/backup_repository_block_cloning.html). From what I’m hearing they are far more confident in the former. In my own tests writes to this are potentially faster than to ReFS and without the memory requirements ReFS repos need. Finally, for the Veeam Agent for Linux crowd, there is now support for doing Application Aware Processing for Postgres and MySQL on Linux -- the same as we’ve seen for Microsoft SQL in VBR. As we now live in the [Veeam Universal Licensing](https://www.veeam.com/universal-licensing.html) world -- even if you have some of these VMs in your environment -- you can make the choice to back them up with a managed VAL install instead to a normal backup job to take advantage of this feature, all the while using the same licensing from the same VBR server. #### <span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;">NFS All the Things</span>

 <span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;">[

{{< figure src="NFS-backup-300x213.png" alt="" >}}

](NFS-backup.png)Speaking of using Linux to front end NFS shares, that is no longer required as we can now [natively address them as a repository](https://helpcenter.veeam.com/archive/backup/100/vsphere/nfs_share.html). Over the years, many have tried to address this as common SMB shares, but this capability has always been flaky and poor performing, comparatively, so everybody had their work arounds from using it. Now we can add NFS in a server:/share/folder manner and make use of all the capabilities of NFS 3 or 4.</span> <span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'>One of the other big features of the release is something I’m sure my friend </span>[<span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'>Michael Cade</span>](https://twitter.com/michaelcade1)<span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'> would love to tell you about, the ability to directly backup NFS or other file shares as a backup job. You can now go into the Inventory portion of your Veeam UI and add file shares there that can then be targeted for File Backup Jobs that are processed in a familiar manner. What is interesting to me with this is the backups are actually written in native blob format (think Azure Blob or Amazon S3). You have the ability to send them directly to object storage archives immediately after the backup hits the on-premises repository. It is worth noting that this is a Veeam Universal Licensed only feature with each 250 GB of data consuming a license instance. I personally think that threshold per instance is too low as it wouldn’t take long with these giant filers to have the NFS share consume more licenses than the virtualization workload at that rate, but licensing is not my fight (today)!</span>**<span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'>Backup Copy Enhancements</span>**

<span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'>[

{{< figure src="backup-copy-modes-300x213.png" alt="" >}}

](backup-copy-modes.png)I'll be honest, as [a shiny new architect in the VCSP space](https://www.koolaid.info/movin-right-along/) this is near and dear to my heart (and my job). Before that, I was[ a Cloud Connect customer](https://www.offsitedatasync.com/), and there is quite a bit here to be happy about. Probably the most visible of these is the new Mirror Mode, which allows you to mirror any on-prem job to your backup copy job easily. This is great if you are wanting a very simplistic policy for cloud-based copies. This also FINALLY gives us the ability to ship transaction logs via backup copy, which is very nice. The old method, now referred to as Pruning Mode, is still available, allowing you to pick backups from an existing backup job on the fly to create your backup copy.</span>

<span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'> </span>

<span style='font-size: 11.0pt; font-family: 'Calibri',sans-serif;'>[

{{< figure src="rpo-monitor-259x300.png" alt="" >}}

](rpo-monitor.png)Next, within the Advanced settings of your backup copy, you'll also now find a RPO monitor settings tab. I know from my limited time working for a provider, one of our common support concerns is customers will have a disconnect on the fact that their local jobs are failing for whatever reasons and then their off sites are silently broken because they have nothing to copy. With RPO monitor you can configure your backup copy job to send an alert if they job fails to copy any restore points for a given period of time. For me, I look forward to this being an escalation point by having it send text messages if it isn't happening. </span>

<span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;"> </span>

<span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;">Finally, also in this release we've finally seen some real improvements in the WAN accelerator portion. Five or six years ago when this feature was initially released, you had large numbers of customers who had sub 100 Mbps bandwidth for their off-site copies, and this was a great way to maximize those links and minimize the backup copy window.</span>

<span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;"> </span>

**<span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;">Conclusion</span>**

<span style="font-size: 11.0pt; font-family: 'Calibri',sans-serif;">As you can see there's a lot to like with version 10. Some of these things are answers to long-term requests. Others are keeping up with today's computing landscape. Either way, it exciting to see what is coming next!</span>

 *Tune in tomorrow for Part 2 of My Favorite Things about VBR v10!*