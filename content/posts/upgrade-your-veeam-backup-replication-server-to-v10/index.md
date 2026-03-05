+++
title = "Upgrade Your Veeam Backup &#038; Replication Server to v10"
date = "2020-02-07T09:00:39Z"
draft = false
tags = [ "backup", "v10", "veeam", "virtualization",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


As we rapidly approach release day for Veeam Backup and Replication v10 (February 18!) Many of you are going to want to do upgrades on that day or shortly after. Personally for production level servers I advocate for waiting for patch 1 to come out, usually 2 weeks to 1 month after GA if history bears out. This is especially true if you utilize any Cloud Service Providers for offsite copies as this is what Veeam refers to as a "breaking" release. That means that if the cloud side VBR you are connecting to is not also on version 10 then you will see errors both during installation and then once you open the console and your backups WILL fail. That said if you have a testing environment or a lab GA is a great day to get at it. This post, now with video, will outline the steps necessary to do an in-place upgrade. One important thing to note before going down this road is upgrade to the RTM/GA is limited to 9.5 update 3 or later. If you happen to be running an older version you will need to upgrade to this first. \[video width="1892" height="924" mp4="Upgrading-to-VBR-v10.mp4"\]\[/video\] **Prerequisites:**

1. Go to [my.veeam.com](https://my.veeam.com) and download the ISO on or after 2/18.2020 and obtain a new v10 license file
2. Ensure that any and all jobs are not running. Usually this means Backup Copy Jobs need to be disabled as they are continuous (mostly)
 
 **Process:**1. Mount the ISO file by right click&gt;mount
2. Run setup.exe and click upgrade
3. VBR v10 is now based on the .NET Framework v4.7.2 and you will be prompted to install that if you haven't already. A reboot will be required before you can proceed.
4. Once the reboot has been completed (pretty quick on Windows Server 2019) we'll need to remount our ISO and run setup.exe again
5. Accept EULAs, Next
6. Verify versions you are upgrading from, Next
7. If you've already downloaded your new v10 compatible license file go ahead and install it now. If not, no worries because Veeam will be granting you a 60 day grace period to get this done. Once you are installed you can import the new license via the Menu&gt;License window in the VBR console. Hit Next
8. Next we want to verify the database configuration. It should automatically have all the information for where your VeeamBackup database is. Before you get to this point it is a best practice to take a SQL level backup of the database prior to upgrading. Hit Next and then confirm that you do want to upgrade the existing database.
9. Finally we are at ready to install. Go ahead and check the "Update remote components automatically" as this will have Veeam launch the updater wizard upon first launch of the console to update any scaled out proxies, repositories or WAN accelerators you may have. Hit Install.
10. Once complete hit Finish and choose yes to reboot.
11. Launch and log in to the VBR console
12. Upgrade any external components that need done
13. Go to Backup Infrastructure&gt;vSphere and rescan all your vSphere components. This may be overkill but I've always found a rescan after upgrade heads off many upgrade related issues.
 
 \[gallery type="slideshow" size="large" columns="2" ids="938,937,936,935,934,933,932"\]