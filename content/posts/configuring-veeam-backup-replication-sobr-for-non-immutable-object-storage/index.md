+++
title = "Configuring Veeam Backup &#038; Replication SOBR for Non-immutable Object Storage"
date = "2022-02-10T09:32:12Z"
draft = false
tags = [ "how to", "object storage", "veeam",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


Veeam Backup &amp; Replication (VBR) currently makes use of object storage through the concept of Scale-Out Backup Repositories, SOBR. A SOBR in VBR version 11 can contain any number of extents as the performance tier (made up of traditional repositories) and a single bucket for the capacity tier (object storage). The purpose of a SOBR from Veeam’s point of view is to allow for multiple on-premises repositories to be combined into a single logical repository to allow for large jobs to be supported and then be extended with cloud based object storage for further scalability and retention.

There are [two general modes](https://helpcenter.veeam.com/docs/backup/vsphere/capacity_tier.html?ver=110) for object storage to be configured in a SOBR:

- Copy Mode- any and all data that is written by Veeam to the performance tier extents will be copied to the object storage bucket
- Move Mode- Only restore points that are aged out of a defined window will be evacuated to object storage or as a failure safeguard only when the performance tier extents reach a used capacity threshold. With Archive mode within the Veeam UI the restore points all still appear as being local but the local files only contain metadata that points to where the data chunks reside in the bucket. The process of this occurring in Veeam is referred to as dehydration.

In this post let's demonstrate how to create the necessary buckets, how to create a SOBRs for both Copy and Move modes without object-lock (Immutability) enabled. If you haven't read my previous post about how to [configure aws cli to be used for object storage](https://www.koolaid.info/getting-started-with-s3-compatible-object-storage/) you may want to check that out first.

1\. Create buckets that will back our Copy and Move mode SOBRs. In this example I am using AWS CLI with the s3 endpoint to make the buckets.

```bash
% aws --endpoint=https://us-central-1a.object.ilandcloud.com \
      --profile=premlab s3 mb s3://premlab-sobr-unlocked-copy
make_bucket: premlab-sobr-unlocked-copy

% aws --endpoint=https://us-central-1a.object.ilandcloud.com \ 
      --profile=premlab s3 mb s3://premlab-sobr-unlocked-move
make_bucket: premlab-sobr-unlocked-move
```
2\. Now access your VBR server and start with adding the access key pair provided for the customer. You do this in Menu &gt; Manage Cloud Credentials.

{{< figure src="1.png" alt="" >}}

3\. Click on Backup Infrastructure then right click on Backup Repositories, selecting Add Backup Repository.

4\. Select Object Storage as type.

{{< figure src="2.png" alt="" >}}

5\. Select S3 Compatible as object storage type

{{< figure src="3.png" alt="" >}}

6\. Provide a name for your object repository and hit next.

7\. For the Account Settings screen enter the endpoint, region and select your created credentials.

{{< figure src="4.png" alt="" >}}

8\. In the Bucket settings window click Browse and select your created bucket then click the Browse button beside the Folder blank and create a subfolder within your bucket with the “New Folder…” button. **I'll note here do NOT check the box for “Make recent backups immutable for…” here as the bucket we have created above does not support object-lock. Doing so will cause an error.**

{{< figure src="5.png" alt="" >}}

9\. Click Apply.

10\. Create or select from existing traditional, Direct Storage repository or repositories to be used in your SOBR. Note: You cannot choose the repository that your Configuration Backups are targeting.

{{< figure src="6.png" alt="" >}}

11\. Right click on Scale-out Backup Repositories and select “Add Scale-out Backup Repository…”

12\. Name your new SOBR.

13\. Click Add in your Performance Tier screen and select your repository or repositories desired. Hit Ok and then Next.

{{< figure src="7.png" alt="" >}}

14\. Leave Data Locality selected as the Placement Policy for most scenarios.

15\. In the Capacity Tier section check to Extend capacity with object storage and then select the desired bucket.

16\. (Optional but highly recommended): Check the Encrypt data uploaded to object storage and create an encryption password. Hit Apply.

{{< figure src="8.png" alt="" >}}

17\. This will have the effect of creating an exact copy of any backup jobs that target the SOBR both on premises and into the object store. To leverage Move mode rather than Copy you simply check the other box instead/in addition to and set the number of days you would like to keep on premises.

{{< figure src="9.png" alt="" >}}

Now you simply need to target a job at your new SOBR to have it start working.

{{< figure src="10.png" alt="" >}}

In conclusion let's cover a bit about how we are going to see our data get written to object storage. For the Copy mode example it should start writing to data to the object store immediately upon completion of each run. In the case of leveraging Move mode you will see objects written after the run after the day specified to move archive. For example if you set it to move anything older than 7 days on-prem dehydration will occur after the run on day 8. These operations can be seen in the Storage Management section of the History tab in the VBR console.

{{< figure src="featured.png" alt="" >}}

Further if I recursively list my bucket via command line I can see lots of data now, data is good. ;)

```bash
% aws --endpoint=https://us-central-1a.object.ilandcloud.com --profile=premlab s3 ls s3://premlab-sobr-unlocked-copy/ --recursive
```
{{< figure src="image-41.png" alt="" >}}