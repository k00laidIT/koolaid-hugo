+++
title = "Synology DS923+: Overcoming the HCL"
date = "2024-05-22T09:00:00Z"
draft = false
tags = [ "git", "how to", "scripting", "synology",]
categories = [ "Automation", "Storage", "Systems",]
featureimage = "featured.png"
+++


As I mentioned in my last post one of the things that most vexes me with Synology's line of storage arrays is that it has a Hardware Compatibility List that skews heavily toward their own branded HDDs, SSDs, and M.2 NVMe drives. In the case of Hard Disk Drives there is a legitimate reprieve with drives from some of the major vendors available, even if hidden under a "3rd Party" drop down, but there don't appear to be any non-Synology branded SSDs or NVMe drives supported. With a [400 GB Synology M.2 NVMe](https://www.amazon.com/Synology-2280-SNV3410-400GB-SNV3410-400G/dp/B09QMSS528/) going for about the same price as a 2 TB option from [Crucial](https://www.amazon.com/dp/B0B25ML2FH/ref=twister_B0BHTPL5G5), [Samsung](https://www.amazon.com/Samsung-Internal-Computer-MZ-V9E2T0B-AM/dp/B0CRC7H66Z) or [Western Digital](https://www.amazon.com/Western-Digital-SN700-Internal-Devices/dp/B09H1D7Y93) it would be nice with no discernible differences once you get to NAS grade devices it's a challenge.

In my case I wanted to use the Western Digital SN700s linked above to power a volume to 1, host the DSM application but to also be a landing spot for virtual machines and containers. Much to my infinite sadness I was immediately greeted with this:

{{< figure src="FB75AFC1-55C8-4DB5-A9FB-D9D6C44BDB37.png" alt="" >}}

Luckily as usually the community provides, in this case with the [Synology\_HDD\_db script ](https://github.com/007revad/Synology_HDD_db)on Github, a tool designed to list the devices found in your unit and inject them into the compatible drives database on your local unit. In this post I'll walk through getting started with this and how you can automate getting it schedule to run after each reboot so it will survive DSM updates.

## Setting Things Up

**Enable SSH.** First off I found it easiest to just SSH into the array and work that way so first I needed to enable SSH. While this screenshot doesn't show it it's advisable to change the default SSH port as well as set an explicit allow list, especially if you are going to enable the QuickConnect feature.

{{< figure src="image-4.png" alt="" >}}

**Enable home directories.** By default Synology doesn't create home directories for users. As we will be downloading this script and scheduling it for subsequent runs a temp directory really won't do so i think home drives are better. To enable them go to Advanced under Users/Groups in Control Panel and enable the user home service.

{{< figure src="image-5.png" alt="" >}}

**Download script.** Now that you have a home directories enabled next you'll need to ssh into your server. I tend to like to do a couple of things, creating a scripts directory and when working with GitHub or other git enabled resources I like to use the git clone method. This is because it's easy to download but also easy to keep the code up to date. To do this first grab the git url from the repository

{{< figure src="image-6.png" alt="" >}}

Once you have a link move to the location you want to store your script and run `git clone <url>`. Now if you get into the created Synology\_HDD\_db directory you should be able to see the latest version of the repository as files.

{{< figure src="image-7.png" alt="" >}}

**Run the script for the first time.** now that we've got it there we need to run the script for the first time to get our disks into inventory. Per the readme file on the repository the script will need to be run either as root (bad) or through sudo (good) and with the -nr parameter. As you are already in the script's folder a full path would be `sudo -s /path-to-script/syno_hdd_db.sh -nr`. This will result somewhat as the below, with the exception that I've already done this so it shows my drives already being in the database.

{{< figure src="image-8.png" alt="" >}}

**Check your drive inventory.** Now that I've run this and I look in Storage Manager I now see a different outcome than in the first screenshot of this post, with my M.2 NVMe available for use. While this is great as the readme also states these changes will not/may not survive a DSM upgrade. For that reason we need to setup a scheduled task to run the script everytime the system boots up.

{{< figure src="image-9.png" alt="" >}}

**Setup Scheduled Task.** While the above is a great outcome as the readme also states these changes will not/may not survive a DSM upgrade. For that reason we need to setup a scheduled task to run the script everytime the system boots up. Start by navigating to Control Panel &gt; Task Scheduler and create a new Triggered Task. Luckily the maintainer has already thought about this and created at guide in the [how\_to\_schedule.md](https://github.com/007revad/Synology_HDD_db/blob/main/how_to_schedule.md) file.

{{< figure src="image-10.png" alt="" >}}

**Create your general task.** Simply give your task a name, set it to run as root and set the task to run on Boot-Up.

{{< figure src="image-11.png" alt="" >}}

**Edit the task settings.** Now click the Task Settings screen and we're going to simply provide a path to our script and add any parameters we might like. As suggested I'm using the --auto-update 3 option to tell it not to bother if the DB has been updated within the last 3 days. Simply hit OK and you are good to go create your volumes!

{{< figure src="image-12.png" alt="" >}}