+++
title = "VB365 v7: SaaSy Immutability"
date = "2023-02-09T09:00:00Z"
draft = false
tags = [ "immutability", "object storage", "object-lock", "VB365", "VB365 v7", "veeam",]
categories = [ "Security", "Veeam",]
featureimage = "featured.png"
+++


In the past few years Immutability, the concept of making data unable to be deleted or modified, has been a core tenant of disaster recovery design and has driven the rise of Object Storage for backup purposes. To this point in the Veeam ecosphere immutability has been contained to traditional Infrastructure backups, virtual machines, and cloud native instances, but there has been a great appetite for this capability to apply to SaaS backups as well.

With the upcoming v7 release of Veeam’s Backup for Microsoft365 (VB365) the product now has a method of allowing true, verifiable immutability or object-lock on backup sets. In their interpretation of how to make this capability happen Veeam has incorporated a long known best practice for all things backup, adhering to the 3-2-1 backup methodology where there are 2 copies of the backup. This happens because immutability can only occur on the secondary copy of the backup set, leaving the primary set on unlocked, performant object storage to ensure that recovery operations are capabilities in a optimized manner.

## So What’s Changed?

Starting with VB365 v6 support for backup copies have been available but only in very limited situations. First the backups must land in Azure Blob or Amazon S3 for the first copy, second the copies could only go to related secondary locations. For example, backups residing in AWS S3 could only be copied to S3, S3 Infrequent Access or AWS Glacier storage. Further while these backups could be encrypted, they could not have the object-lock attribute, the object storage attribute that powers immutability, set.

With VB365 v7 both statements have changed. First backup copies can now land on Azure, S3 or any S3 compatible backup storage that supports the necessary functions of the S3 API. Further those backups can now optionally have the object-lock attribute set at the object repository level, with the immutability expiration automatically set to the duration of the retention period. In other words, unlike Veeam Backup and Replication where retention points are set at the job level and immutability is set at the repository level, with VB365 both are set together at the repository level.

## VB365 Immutability in Action 

1\. Add primary object storage and backup repository. On this repository is when you want to set your long-term retention as needed. Repeat the process until you have repositories to support your organization’s backup needs in accordance with best practices for maximum supported objects per repository.

<figure class="wp-block-gallery aligncenter has-nested-images columns-4">

{{< figure src="Screenshot-2023-02-03-at-10.56.19-AM.png" alt="" >}}

{{< figure src="Screenshot-2023-02-03-at-10.56.34-AM.png" alt="" >}}

{{< figure src="Screenshot-2023-02-03-at-10.56.44-AM.png" alt="" >}}

{{< figure src="Screenshot-2023-02-03-at-10.56.56-AM.png" alt="" >}}
</figure>2\. Add your secondary object storage and VBO repositories. These should arguably be setup in a different object storage environment as your primary copy but still well connected. Because you will be writing data that is set to object-lock for the retention period of the repository you should consider the shortest retention period here in accordance with your organization’s data policy and standards.

<figure class='wp-block-gallery aligncenter has-nested-images columns-default is-cropped'>

{{< figure src="Screenshot-2023-02-03-at-10.57.11-AM.png" alt="" >}}

{{< figure src="Screenshot-2023-02-03-at-10.57.22-AM.png" alt="" >}}

{{< figure src="Screenshot-2023-02-03-at-10.57.37-AM.png" alt="" >}}

</figure>3\. Create backup jobs targeting your primary backup repositories. These will automatically copy to the secondary repository and become immutable as it is written.

{{< figure src="Screenshot-2023-02-03-at-11.06.47-AM.png" alt="" >}}

## Conclusion

This capability is going to be a game changer for everyone who uses VB365 to protect their M365 workloads. While this capability is only supported for VB365 data residing on object storage there's an argument to be made that if you haven't already moved or reseeded that data to object by now you should be working on it. Customers will be able to maintain a secondary copy of their backup sets on disparate systems to ensure the durability of their backups. If you can't tell I'm actually very excited by this capability and look forward to using it in production!