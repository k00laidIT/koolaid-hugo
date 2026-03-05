+++
title = "Setting up Object Storage Gateways For Data Migration to AWS S3"
date = "2025-08-18T04:00:00Z"
draft = false
tags = [ "data-migration", "object", "veeam",]
categories = [ "AWS", "Object", "Veeam",]
featureimage = "featured.png"
+++


As you may have noticed I've been talking quite a bit here recently about object storage migration, especially as it relates to Veeam based workloads. While you would think that using 3rd party tools such as rclone, AWS DataSync, and Azure's AZCopy would be the best for doing these kinds of migrations they often leave a lot to be desired when working with backup data. This is largely because they don't have a good mechanism to write object versioning information but in the end as a general rule backup vendors want to be the only thing that touches the data they write.

To this end as I've been writing about Veeam capabilities such as VeeaMover and evacuating Scale-Out Backup Repositories one thing I've found in the grand laid plans of Veeam administrators is the data path for these types of migrations. Often customers see the simplicity of these migration plans and don't think about the fact that by default they will be moving from VERY FAST CLOUD to VERY FAST CLOUD with a trip through their local Veeam Backup and Replication server which most likely is not connected to the Internet at the same levels of speeds. No only does this method slow the migration but it also may have the unintended consequence of clogging up both the upload and download capabilities for your location.

## Why All This?

By default when an object storage repository is created in Veeam it uses what is called “Direct” mode which will leverage the Veeam Backup and Replication (VBR) server itself to facilitate any data management tasks.

{{< figure src="image-36.png" alt="Veeam Edit Object Storage Repository wizard showing the Account tab with Connection Mode set to Direct" >}}

To overcome this the customer can deploy Object Storage Gateways in AWS to support a more efficient data transfer.

{{< figure src="image-37.png" alt="Architecture diagram showing on-premises Veeam VBR server managing data migration from source buckets in another cloud through AWS VPC gateway VMs to AWS S3 destination buckets via Internet Gateway and S3 Endpoint Gateway" >}}

## Considerations

To facilitate this architecture a few things should be considered:

- In a perfect world the object storage gateways should be deployed in the cloud 'closest' to the source bucket in terms of latency and access. This is often not possible due to compute availability, cost optimization, etc. Just know that any version of putting the data movers in the cloud is better than not doing it at all.
- The VBR server will need to have management connectivity to both source and destination buckets as well as the object storage gateway servers. This may require connectivity solutions between on-premises network and the AWS VPC or other cloud datacenter solutions.
- The VPC will also need connectivity to both the source and destination buckets. In AWS speak for the “other cloud” the VPC will need a public subnet with Internet Gateway configured. For AWS S3 access S3 Endpoint Gateway may need to be added.

## Process

- Deploy an appropriately sized VM/instance(s) in AWS EC2 or Amazon Elastic VMware Service (EVS) for each concurrent task to be processed. Both Windows and Linux Managed servers are supported as long as the version/distribution is [supported by Veeam](https://helpcenter.veeam.com/docs/backup/vsphere/system_requirements.html?ver=120#gateway-server).
- Add these VM/instance(s) to Veeam as Managed Servers under Backup Infrastructure. In this example 10.71.90.17 will be our object storage gateway.

{{< figure src="image-38.png" alt="Veeam Backup Infrastructure Managed Servers list showing Linux host 10.71.90.17 added as an object storage gateway alongside existing Windows and vCenter servers" >}}

- For each object storage repository source / destination pair modify the Connection Mode to “Through a gateway server” and select the appropriate gateway server.

{{< figure src="featured.png" alt="Veeam Edit Object Storage Repository Connection Mode dialog with Through a gateway server selected and host 10.71.90.17 chosen from the list" >}}

- Click Next, Next, Finish to save the properties modification. Repeat process for each pair of source/destination buckets.
- NOTE: Once data migration tasks have been completed you will probably want to revert all this work, putting the data migration path for these buckets back to "Direct" and terminate your cloud resources. Think of this as a temporary migration infrastructure so be sure to take note of everything you deploy to support this so you can destroy it once finished.

## Best Practices

- Consider deploying object storage gateways per concurrent task. If you have 12 jobs but only want to move 3 jobs at a time, deploy 3 object storage gateways. That way each gateway can be maximized for that task
- Object storage gateways may need to be scaled up as well as the scale out above. Data migration is largely a memory intensive process but the general thumb of 8 vCPU, 32 GB of RAM is a good starting point. Because every source cloud is different monitor your object storage gateways during a test or smaller migration for saturation of either compute variable and adjust accordingly.
- For any data migrated by Veeam data movers VBR tables will need to be updated throughout the process. For busy environments be sure to also monitor the SQL server utilized by the VBR server. You may need to adjust CPU or RAM here as well to maximize throughput of data writes.

## Conclusion

As you may have guessed by my recent glut of content around data migration it can often be a more advanced topic than click, click next or "It Just Works." While the setup for efficient transfer may be a bit more complex than not doing so the speed differences and capabilities will more than make up for the work.