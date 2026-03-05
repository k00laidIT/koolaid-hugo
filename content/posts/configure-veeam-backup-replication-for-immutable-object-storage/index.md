+++
title = "Configure Veeam Backup &#038; Replication for Immutable Object Storage"
date = "2022-02-11T09:00:00Z"
draft = false
tags = [ "how to", "object storage", "veeam",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


In my last post, [Configuring Veeam Backup &amp; Replication SOBR for Non-immutable Object Storage](https://www.koolaid.info/configuring-veeam-backup-replication-sobr-for-non-immutable-object-storage/), I covered the basics of how to consume object storage in Veeam Backup &amp; Replication (VBR). In general this is done through the concept of Scale-out Backup Repositories (SOBR). In this post we are going to build upon that land layer in object storage’s object-lock features which is commonly referred to in Veeam speak as Immutability.

First, let’s define [immutability](https://www.merriam-webster.com/dictionary/immutable#:~:text=Definition%20of%20immutable,of%20or%20susceptible%20to%20change). What the backup/disaster recovery world thinks of as immutability is much like the old Write Once, Read Many (WORM) technology of the early 00’s, you can write to it but until it ages out it cannot be deleted or modified in any way. Veeam and other backup vendors definitely treat it this way but object-lock under the covers actually leverages the idea of versioning to make this happen. I can still delete an object through another client but the net effect is that a new version of that object is created with a delete marker attached to it. This means that if that were to occur you could simply restore to the previous version and it’s like it never happened.

With VBR once Immutability is enabled objects are written with [Compliance mode retention](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html) for the duration of the protected period. It recognizes that the object bucket has object-lock enabled and then as it writes it each block is written with the policy directly rather than assuming a bucket level policy. If you attempt to delete a restore point that has not yet had its retention policy expire it won’t let you delete but instead gives you an error.

{{< figure src="12.png" alt="Veeam backup deletion job log showing a failed attempt to delete an immutable backup with the error "Unable to delete backup in the Capacity Tier because it is immutable until 10 February 2022"" >}}

Setting up immutability with object storage in Veeam is the same as with non-immutability but with a few differences. This starts with how we create the bucket. In the last post we simply used the [**s3 mb**](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/mb.html) command to create a bucket, but when you need to work with object-lock you need to use the [**s3api create-bucket**](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/create-bucket.html) command.

```bash
aws --endpoint=https://us-central-1a.object.ilandcloud.com --profile=premlab s3api create-bucket --bucket premlab-sobr-locked-copy --object-lock-enabled-for-bucket
```

Once your bucket is created you will go about adding your backup repository as we’ve done previously but with one difference, when you get to the Bucket portion of the New Object Store Repository wizard you are going to check the box for “Make recent backups immutable” and set the number of days desired.

{{< figure src="13.png" alt="Veeam New Object Storage Repository Bucket step showing the Make recent backups immutable checkbox enabled for 30 days" >}}

You now have an immutable object bucket that can be linked to a traditional repository in a SOBR. Once data is written (still the same modes) any item that is written is un-deleteable via the VBR server until the retention period expires. Finally if I examine any of the objects in the created bucket with the [s3api get-object-retention](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/get-object-retention.html) command I can see that the object's retention is set.

```bash
aws --endpoint=https://us-central-1a.object.ilandcloud.com --profile=premlab s3api get-object-retention --bucket premlab-sobr-locked-copy `
--key "Veeam/Archive/premlab-sobr-locked-copy/cc846946-5315-4d7a-bb3d-22bac6da3102/2f906844-5990-4485-a59b-6dd6ade9afd7/blocks/6da2de41248d47446cd3609625a8b69e/1035.371def52c773e7d026675a6f17ec9016.00000000000000000000000000000000.blk"
{
    "Retention": {
        "Mode": "COMPLIANCE",
        "RetainUntilDate": "2022-03-06T18:30:06+00:00"
    }
}
```
