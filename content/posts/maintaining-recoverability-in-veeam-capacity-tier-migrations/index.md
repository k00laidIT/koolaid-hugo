+++
title = "Maintaining Recoverability in Veeam Capacity Tier Migrations"
date = "2024-09-25T07:48:14Z"
draft = false
tags = [ "how to", "object storage", "veeam", "Veeam Vanguard",]
categories = [ "Service Provider", "Veeam",]
featureimage = "featured.png"
+++


Veeam Backup and Replication Administrators often want to be able to transition cloud object storage providers in today’s era of backup systems management. This can be due to several factors including, cost, availability, geo-location, and cloud preference.

Historically the way to address object storage in VBR is through a [Scale Out Backup Repository](https://helpcenter.veeam.com/docs/backup/vsphere/backup_repository_sobr.html?ver=120), or SOBR, where you have one or more block based primary repositories on-premises in the performance tier and then a single object storage bucket with a Cloud Service Provider (CSP) in the [capacity tier](https://helpcenter.veeam.com/docs/backup/vsphere/capacity_tier.html?ver=120). The capacity tier can be used in one of two ways:

- **[MOVE mode](https://helpcenter.veeam.com/docs/backup/vsphere/capacity_tier_move.html?ver=120)** - Backup restore points in the performance tier are dehydrated and the data is placed into object storage after a given number of days. In move mode the restore points still “appear” to be on prem and there is only once copy of the data between the two locations.
- **[COPY mode](https://helpcenter.veeam.com/docs/backup/vsphere/capacity_tier_copy.html?ver=120)** – Backup restore points written to the performance tier are immediately copied to the capacity tier. This is a synchronous form of backup copy, where once the SOBR offload job is completed there will be 2 copies of the data, 1 in the performance tier repositories and one in the capacity tier repositories.

As you can see in the screenshot below you can also choose both options to allow for both offload of storage and 3-2-1 level data protection. Since version 12 VBR now allows for multiple buckets in the capacity tier, but they must all be of the same time (object or block) and in the case of object of the same Cloud Service Provider type ([Amazon S3](https://aws.amazon.com/s3/), [Azure Blob](https://azure.microsoft.com/en-us/products/storage/blobs), [S3 Compatible](https://1111systems.com/services/object-storage/), etc.)

{{< figure src="image-8.png" alt="Veeam Edit Scale-out Backup Repository wizard showing the Capacity Tier configuration panel with 'lax-cap-tier2' repository selected, both Copy and Move options checked, and Move set to files older than 1 day" >}}

### Changing to a new Cloud Service Provider

Now that we’ve covered off what Capacity Tier is but let’s discuss how you can change the CSP who provides it since you can’t mix them in the same SOBR tier. If you can handle the bandwidth moving is quite simple. First go and disable the capacity all together and allow the wizard to finish processing. Next add your new repository or repositories as backup repositories and then in the Capacity Tier configuration screen as shown above click the “Choose…” button for repository capacity, remove the existing repository and add the new ones.

Once you complete the wizard you will be prompted to choose if you’d like to move only the latest set of restore points or move all that are present in the performance tier repositories. Veeam Backup &amp; Replication will then immediately begin offloading your choice of restore points to the capacity tier and copies will begin with the next run.

### Migrating Extended Backup Chains

As you may be thinking this sounds a bit too simple, what about all those restore points you’ve got in your old CSP? You have a need to retain those, as most do, you will now need to strategize how you will move your retained backups from object storage system to another. Unfortunately, there is no silver bullet to be used here there are some definite guide posts to lean on.

The first option I would look to here is if you are moving into an object storage platform that has its own data migration service or capability, I recommend that you use that. For S3 this would be [AWS DataSync](https://aws.amazon.com/datasync/) and it is best for moving into S3, especially from other hyperscale level object storage platforms. DataSync is great as it is easily configurable and highly performant while being well support by many vendors for migrations.

My second choice for doing this background migration would be the [rclone](https://rclone.org/) utility. Rclone is an [open-source project](https://github.com/rclone) that allow for data migration across a wide variety of storage types but well supports object to object migrations via either sync, copy, or move operations. This is an excellent choice if you are more familiar with traditional [robocopy](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy) type tools or are comfortable with being more hands on with the migration. The only drawbacks to rclone are that it can be a bit of trial and error to find an optimized set of settings for migrating between systems and there are some vendor systems that do not fully support it as a migration tool.

### Making Retired Capacity Tier Restore Points Visible

Now we reach the meat of our post. Veeam does not allow you to directly view capacity tier data either outside of the capacity tier or on the source VBR server at all. This is mostly due to overwhelming concern for data safety but in any case, it is a limitation. To be able to expose restore points that were in your old capacity before migrating to the new location you can follow these steps.

- If you are currently syncing or copying backup data between systems in the background those jobs should be paused or stopped prior to moving forward.
- Build out a new, temporary Veeam Backup &amp; Replication VM. This server doesn’t need to be of any real size, and you can use the simple installation method.
- Create an empty repository on your new server. This can just be a folder on the system drive even, you won’t ever have any data in it.
- Add your capacity tier object storage buckets (and more specifically the folder that Veeam saw them as the root) as repositories in Backup Infrastructure &gt; Backup Repositories.
- Create a new SOBR with your dummy repository in in the performance tier and your existing capacity tier repository into the capacity tier with similar settings as what they were when removed from the source.
- Once it finishes you’ll be prompted to move latest or all to the capacity tier. This doesn’t matter as there is no data in the performance tier so select All.
- This will kick off a SOBR offload job that will fail. Ignore this failure but let it complete all the way through.
- Right click your SOBR and choose Rescan. This should take a bit of time as it indexes all the files in the object storage repositories and brings them into inventory.
- If the scan indexes properly then if you go to Home &gt; Backups you will either see your backups under Disk (Encrypted) if they were written with encryption enabled or into Capacity Tier (Imported) if not. Please encrypt your backups. ;)

{{< figure src="image-10.png" alt="Veeam Home panel showing the Backups tree with 'Disk (Encrypted)' selected and 'Cust Workloads' backup job listed with backup path 'Cust_Workloads'" >}}

- If they are encrypted right click on each backup job listed and choose “Decrypt…” entering your encryption password when prompted. Once successfully decrypted for the use of this VBR then your backups will be populated under Capacity Tier (Imported.)

{{< figure src="image-11.png" alt="Veeam 'Specify Password' dialog with a hint showing 'Created by PREM\jjones at 7/26/2023 12:36 AM' and a masked password entered, overlaid on the Backups tree showing 'Disk (Encrypted)' selected with 'Cust Workloads' listed" >}}

Your backups are now available for any normal restore or interaction purposes. Understand that unless immutability is set on your backups it is possible to interact with this data, so if you are planning to migrate the data you should tread lightly. I would also either destroy this temporary landing spot or put your capacity tier repositories into maintenance mode before proceeding with your migration.