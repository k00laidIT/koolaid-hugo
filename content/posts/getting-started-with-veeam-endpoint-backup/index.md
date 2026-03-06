+++
title = "Getting Started with Veeam Endpoint Backup"
date = "2015-05-01T08:45:15Z"
draft = false
tags = [ "free", "how to", "veeam", "virtualization",]
categories = [ "Security", "Systems", "Veeam", "Virtualization",]
featureimage = "featured.jpg"
+++


This week Veeam Software officially released their new [Endpoint Backup Free](https://www.veeam.com/endpoint-backup-free.html) product introduced at [VeeamON](https://www.veeam.com/veeamon) last October after a few months of beta testing. The target for this product is to allow image based backup of individual physical machines, namely workstations, allowing for Change Block Tracking much like users of their more mature Backup &amp; Replication product have been used to in virtualized environments. Further Veeam has made a commitment that in the product is and should always be freely available making it possible for anybody to perform what is frankly enterprise level backup of their own computers with no cost other than possibly a external USB drive to store the backup data. I've been using the product throughout the beta process and in this post I'll outline some of the options and features and review how to get started with the product. Also released this month by Veeam is the related [Update 2 for Backup &amp; Replication 8](https://www.veeam.com/kb2024). This update in this case allows a Backup Repository to be selected as a target for your Endpoint Backup job after some configuration as shown here. Keep in mind if you are wanting to backup to local USB or a network share this isn't necessary but if you are already a B&amp;R user this will make managing these backups much better. **Getting Started with Installation** [

{{< figure src="install.jpg" alt="Your installation options" >}}

](install.jpg)I have to say Veeam did very well keeping the complexity under the water in this one. Once [downloaded](https://www.veeam.com/endpoint-backup-free-download.html) and run the installation choices consist completely of one checkbox and one button. That's it. Veeam Endpoint Backup seems to rely on a local SQL Server Express installation to provide backend services just like the bigger Backup &amp; Replication install but it is installed on the fly. I have found that if there is pending Windows Updates to complete the installer will prompt you to restart prior to continuing to configuring your backup. **Configuring the Job** Once the installation is complete the installer will take you directly into configuring the backup as long as you are backing up to an external storage device. If you plan to use a network share or Veeam Backup Repository you will need to skip the step and configure the job once in the application. Essentially you have the following options:

- What you wantto backup 
    - Entire computer; which is image based backup
    - Specific volumes
    - File level backup
- Where you want to back it up to (each will generate another step or two in the wizard) 
    - Local storage
    - A shared folder
    - Veeam Backup &amp; Replication repository
- Schedule or trigger for backups 
    - Daily at a a specific time
    - Trigger a backup on a lock, log off or when the backup target is connected
 
 \[gallery link='file' columns='5' ids='316,319,318,317,320'\] Personally I use one of three setups depending on the scenario. For personal computers I use a external USB drive triggered on when the backup target is available but set so that it never backs up more than once every 24 hours. In the enterprise using Endpoint Backup to deal with those few remaining non-virtualized Windows servers these are configured to backup to a Veeam Backup Repository on a daily schedule. Finally I will soon begin rolling this out to key enterprise laptop users and there backup will be to a B&amp;R Repository as well but triggered on the user locking the workstation with a 24 hour hold down. Keep in mind all of these options can be tweaked via the Configure backup button in the Veeam Endpoint Backup Control Panel. **[

{{< figure src="media-create.jpg" alt="media-create" >}}

](media-create.jpg)Creating the Recovery Media** The last step of installing/configuring Endpoint Backup is to create the restore media. This creates a handy disk or ISO that you can boot off of to allow you to do a Bare Metal (or Bare VM :)) recovery of the machine. From an enterprise standpoint if you are rolling Endpoint Backup out to a fieldful of like machines I really can't find a good reason to create more than one of these per model of device. Personally I've been creating the ISOs for each model and using it in conjunction with a [Zalman VE-300](http://www.zalman.com/global/product/Product_Read.php?Idx=674) based external hard drive to keep from having lots of discs/pen drives around. If you are using this to backup physical servers it would also be a first step to being able to quickly restore to a VM if that is part of your disaster recovery plan. As a trick what I've found is I have installed the product on a VM for no other reason but to create the recovery media. This way I know I'll have the drivers to boot to it if need be. Further once you boot to the recovery media you'll find all kinds of little goodies that make it a good ISO to have available in your bag. **Conclusion** I've played with lots of options, both paid and free, over the years for backing up a physical computer on a regular basis and even setting the general Veeam fanboy type stuff aside, this is the slickest solution for this problem I've ever seen. The fact that it is free and integrates into my existing Enterprise solution are definitely major added bonuses, but even in a standalone, "I need to make backups of Grandma's computer" situation it is a great choice. If you find you need a little help with getting started the Veeam has created a whole [Endpoint Backup forum](http://forums.veeam.com/veeam-endpoint-backup-f33/) just for this product. My experience both here and with other products is that there is generally very quick response from very knowledgeable Veeam engineers, developers and end users happy to lend a hand.