+++
title = "V12 Preview: Appropriate Direct to Object Storage Use Cases"
date = "2023-02-22T09:00:00Z"
draft = false
tags = [ "object storage", "v12 launch", "veeam", "Veeam Vanguard",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


I’ve just completed watching the [Veeam v12 Data Platform Launch Event](https://go.veeam.com/v12) keynote and one theme I feel is getting a lot of chatter is the new “Direct to object storage” capabilities of the release. What this means is that as I create backups of my production data the first copy that is made is written to object storage. I’ve written quite a bit about v12 and object storage before, both in how to setup and consume it in the [performance tier of Scale Out Backup Repositories](https://1111systems.com/blog/veeam-12-preview/) as well as comparing [copy mode object storage and Veeam Cloud Connect Backup](https://1111systems.com/blog/veeam-12-preview-veeam-cloud-connect-backup-vs-object-storage/), but this is not that. Direct to object storage is the idea that you write your first backup copy of production data to object storage, rather than as a secondary copy.

[Anton Gostev](https://www.linkedin.com/in/agostev/) himself highlighted this as a favorite feature and outlined that there are limited uses cases where it should be used. As a long time Veeam administrator and of late an architect of their largest Service Provider partner I have some thoughts into what those use cases should and should not be that I’d like to share.

## The Do’s

### ✅ On Premises Backup Repository

The first and in my opinion most exciting use case for direct to object storage capabilities is as a replacement for your old block based on premises backup repositories. Object storage has numerous benefits over traditional storage servers using NTFS, ReFS or even XFS. These include true object-lock backed immutability, real scalability in that you simply continue to add nodes to the cluster as needed and API first, automation driven provisioning. All these things can combine to a scalable, secure, and durable on premises backup storage location.

### ✅ Distributed Workforce Agent Backups

As we find ourselves in the world of remote work in 2023 systems administrators have more concerns than in the past about protecting those laptops that our remote workers are using as critical company data further escapes the datacenter. By combining Veeam Backup and Replication v12, Veeam Service Provider Console v7 and public object storage services such as 11:11 Systems’ offering we can create a robust solution for managing these backups securely and at scale with self-service capabilities included.

{{< figure src="Direct-to-Object-Agents.jpeg" alt="" >}}

### ✅ NAS Backups

As much as cloud-based storage services such as OneDrive, Google Drive and Dropbox have become prevalent in modern IT there are still a lot of traditional Network Attached Storage file servers around. The problem is these are usually measured in 100s of TBs and backups don’t scale well in any case. In this case I believe it’s appropriate to back these up via the NAS backup feature of VBR directly to immutable cloud-based object storage. Recoverability is in terms of files as opposed to needing to write Virtual Machines to a hypervisor so far more appropriate.

## The Don’ts

Now that we’ve covered what are good use cases let’s talk about some things that should not be considered from a best practices point of view but are technically possible.

### ❌ Cloud-Based Object Storage for First Backup

There are going to be people who begin wanting to get rid of the on-premises backups all together and replace them with low-cost cloud object storage. While the immutability and ease of scale are tempting, don’t. Just don’t. Recovery from this for any backup platform would be painful at best, unsuccessful at worst. Further you lose so much of the power of Veeam Backup &amp; Replication by doing this with capabilities such as [Instant Recovery](https://helpcenter.veeam.com/docs/backup/vsphere/instant_recovery.html?ver=120) and [SureBackup](https://helpcenter.veeam.com/docs/backup/vsphere/surebackup_recovery_verification.html?ver=120) instantly going away.

### ❌ Remote Office/Branch Office (ROBO) Server Backups

One of the use cases specifically called out by Gostev for direct to object storage was the ROBO server. While I respect him very much, I do have to disagree with him here. As someone who’s had to restore this scenario in anger the pressure will be on in most if not all these situations to get that server back up and running as fast as possible, probably in your production datacenter with some creative networking setup, to get that remote location back up and in business as soon as possible. By and large direct to cloud-based backups for virtual machines or server grade agents should not in my opinion be considered as you quickly become limited in recoverability choices. If you cannot either back these up first to a small NAS unit at the ROBO or to storage available in your production location, then VCC-B may be interesting as a first write backup. While definitely not preferred at least things like [Instant Recovery to Cloud Director](https://helpcenter.veeam.com/docs/backup/vsphere/vcloud_director_instant_vm_restore_to_vcd.html?ver=120) can be an option to get these workloads available sooner.

### Conclusion

While writing backups from Veeam Backup &amp; Replication v12 directly to object storage is an exciting innovation to the platform it is a capability that should be given a great deal of consideration before putting into production grade use. Features such as immutability and scalability will drive adoption what you are using it for is far more important than the hype.