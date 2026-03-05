+++
title = "Simplify VBR Direct Repository Migration with VeeaMover"
date = "2025-08-13T09:04:02Z"
draft = false
tags = [ "data-migration", "object", "veeam",]
categories = [ "Object", "Veeam",]
featureimage = "featured.png"
+++


Migrating backup data between Veeam Backup &amp; Replication (VBR) object storage repositories is a critical step for organizations looking for portability in our hybrid cloud world. These transitions can seem overwhelming, especially when data integrity and uptime are on the line. That’s where VeeaMover comes into play. It’s a built-in VBR tool that takes the complexity out of direct repository migrations, while helping you maintain business continuity.

In this post, I’ll focus on how to use VeeaMover to migrate a job from one VBR direct object storage repository to another, highlighting best practices and outlining a clear step-by-step process for a smooth migration.

### Relevant Veeam Documentation[](https://helpcenter.veeam.com/docs/backup/vsphere/backup_moving.html?zoom_highlight=move+backup&ver=120)

- [Backup Move - User Guide for VMware vSphere](https://helpcenter.veeam.com/docs/backup/vsphere/backup_moving.html?zoom_highlight=move+backup&ver=120)
- [Move-VBRBackup Powershell cmdlet](https://helpcenter.veeam.com/docs/backup/powershell/move-vbrbackup.html?ver=120)

### The Basics

VeeaMover works at both the job and the object levels, allowing for jobs to be moved from one repository to another and objects (VMs) to be able to be moved from one job to another. Further, VeeaMover works in 2 different flavors:

- Copy - migrates the data from source to destination with the option to delete the source after a period of time. Any job still using the data will have to be manually disabled prior, updated to the new repository after. Best served for the migration of legacy, non-active data.
- Move - migrates the data from source to destination but also fully automates the job management portions of the task. Best served for the migration of active backup data.

Backup jobs cannot be moved while being actively run so one way or another you will need to disable the jobs prior to beginning a move.

#### Migrating a job from one repository to another

- Add your new destination repository if it does not exist already.
- Locate the backup job under Home &gt; Backups and right click, choosing “Move backup…”

{{< figure src="image-30.png" alt="Veeam VBR console Backups list with right-click context menu open on a backup job, highlighting the Move backup option" >}}

- Select the repository that you want to move the backup job to. Optionally click “Show backups” to see size of backup job to be moved.

{{< figure src="featured.png" alt="Veeam Move Backup to Another Location dialog showing destination repository selection and backup job size of 318 GB" >}}

Once the migration begins if the job is active it will be disabled automatically. The move can then be monitored from History&gt; System&gt; Move and Copy and choose statistics like any other Veeam job. Once it completes the job will automatically update to the new repository and be re-enabled automatically.

{{< figure src="image-32.png" alt="Veeam VBR Move Backup job progress showing four VMs with Moving status and log messages confirming the migration is in progress" >}}

**Migrating a VM between backup jobs**

- Open up your Backups list under Home in the VBR Console. Open a supported backup set and identify the VM you wish to move between backups. Click 'Move Backup'

{{< figure src="image-33.png" alt="Veeam VBR Home Backups list with right-click context menu on an individual VM within a backup job, showing the Move backup option highlighted" >}}

- Choose a supported job to migrate the VM's backups to and click OK to begin migration.

{{< figure src="image-35.png" alt="Veeam Move Backup to Another Job dialog showing destination job selection and gsp-cf01 VM backup at 17.6 GB to be moved" >}}

NOTE: A inter-backup job migration is a 1 way process. Once you migrated a VM to a different job you will not be able to migrate it back unless all restore points of that VM have aged out or have been removed.

### Common Exceptions

- VeeaMover will not work with any Veeam Cloud Connect repositories.
- **VeeaMover cannot make use of any data that is migrated by 3rd party tools such as rclone or AWS DataSync**. For the purposes of the above please assume that the destination repository has no data/objects that relate to the source backup job. Attempts to use the capability with existing data present will at worst result in migration failure and at least storage inefficiency.
- For older legacy data that is per-VM but that the metadata file is not per-VM (if each VM does not have it’s own .vbm file) you will need to right click on the job and choose “Upgrade Backup Format”
- Backup chains that aren't per-VM at all will not be able to migrated via VeeaMover.
- Only agents that are in Managed Mode, either by VBR or VSPC, can be moved with this tool.
- There are other exceptions to consider, please review [](https://helpcenter.veeam.com/docs/backup/vsphere/backup_moving.html?zoom_highlight=move+backup&ver=120)[Backup Move - User Guide for VMware vSphere](https://helpcenter.veeam.com/docs/backup/vsphere/backup_moving.html?zoom_highlight=move+backup&ver=120)

### Best Practices

If moving cloud to cloud but the jobs are managed by an on-premises VBR server consider creating a object storage gateway in either the source and/or destination cloud and link the buckets to the gateway(s) to keep data from hairpinning through the on-prem VBR.

As a further best practice consider this a great time “right size” your jobs that may have rogue monster VMs within it. Remembering that jobs will be disabled through out the move, it may be advantageous to create a new job and using the object move capability move the monster VMs out to other jobs for ongoing processing prior to moving the entire job from repository to repository. This should help in minimizing job downtime.

## Conclusion

We still having had the dust completely settle on Veeam's guidance for migrating object storage from cloud to cloud. There are numerous scenarios related to both source/destination choices, how the data has been written, what you want to do with it once it's moved, among others. In most cases when it comes to Veeam consider it as the best way forward that "Veeam only wants Veeam to touch any data that it's writing" and utilize their native tools to move data whenever possible.