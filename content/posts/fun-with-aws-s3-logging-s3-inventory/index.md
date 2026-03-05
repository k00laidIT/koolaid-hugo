+++
title = "Fun with AWS S3 Logging: S3 Inventory"
date = "2025-08-28T14:31:25Z"
draft = false
tags = [ "AWS", "logging", "object storage",]
categories = [ "AWS", "Object",]
featureimage = "featured.png"
+++


In [my last post](/fun-with-aws-s3-logging-access-logging/) I started going down the rabbit hole of creating analytic data about, well, my data, specifically that data that's located in AWS S3. In that post I discussed the hows and whys of enabling Access Logging for S3 buckets which is exceptionally important from a security perspective. In many cases when it comes to object storage generally and AWS S3 in particular it is also important to know what the demographics of your data looks like as well and this is where AWS [Storage Lens](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html) and [S3 Inventory](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-inventory.html) comes in.

In my day job there are many use cases where knowing what S3 data looks like in terms of it's make up or metadata is impactful. A few use cases may include

- backup data for example we want to ensure that it is being written with [object-lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) enabled,
- if we are expecting data to be written in a particular [storage class](https://aws.amazon.com/s3/storage-classes/) we need to see if that's actually being done by our applications, and
- if that storage class has gotchas such as billing for small objects we want to know how impactful that will be for our use case, and
- if we are considering a data migration between buckets or storage systems its important to know how many objects we need to move and their size as well.

Let's take a look at Storage Lens and S3 Inventory and see how they can help.

## Storage Lens

Think of Storage Lens as the SaaSy, easy button to looking at your AWS Storage at a 1000 foot level. This service allows you to create dashboards, updated daily, to allow for the monitoring of your storage consumption and data at as high as an organization level and as low as a specific prefix or sub-folder. When you setup an AWS account and create an S3 bucket you will then be able see a default dashboard by clicking the "View dashboard" button in the Account Snapshot portion of the Amazon S3 homescreen under your AWS account.

{{< figure src="image-51.png" alt="" >}}

Once in the Storage Lens dashboard your default view will show you a snapshot of what all buckets across all regions looks like for you for the current day for all of the accounts available under your logged in account's management. These metrics are only pulled once a day and by default will only show you the data that is available for free, but it's a lot.

{{< figure src="image-50.png" alt="" >}}

There are a number of tabs that allow you to view the data on a different set of focus such as Regions, storage classes and buckets. In each of those tabs there is a consistent set of categories of metric categories allowing for more information to be shown. I'll say that what I do not like about Storage Lens is that there isn't a way to make these selections sticky, you have to re-select them each time.

{{< figure src="image-52.png" alt="" >}}

As I mentioned above there is a concept of free versus paid metrics. The paid metrics are exposed when you create your own dashboards and can provide a deeper look into your data. These can include anything from expired object delete marker lifecycle rule count to total lifecycle rule count. For a full list you can check out the [metrics glossary](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics_glossary.html) page. While the [pricing](https://aws.amazon.com/s3/pricing/) feels like it is high it's relatively minor depending on your use case. If you have 1 PB of Veeam Backup files advanced metric will cost you about 40 cents per month.

{{< figure src="image-53.png" alt="" >}}

One last thing about Storage Lens is that if you configure your own dashboard, which has all the same data, you can have it do a once a day export of the data to an S3 bucket for external analysis. This external export can be stored in CSV or Apache Parquet format and stored either in the source account or any other AWS account that is provided access to it. This will be based on either the free or advanced metrics so understand you will be charged for any data that is stored in the bucket so either be careful with your choices or enable a Lifecycle Policy on the destination bucket to expire and delete data after a given period of time.

{{< figure src="image-54.png" alt="" >}}

## S3 Inventory

Speaking of landing S3 data into a bucket for external analysis let's now turn to the S3 Inventory service. While Storage Lens takes a high level view of what data you have and lets you see it in the form of percentages and object counts, S3 Inventory literally generates a list of ever object in each configured bucket along with interesting metadata about each object. This metadata can be as mundane as the Key name (file name) to the Storage class or object lock retain until date. This data can be extremely useful when you are trying to learn how other systems are using object storage because you get a full listing of everything written without needing to store the actual data for analysis.

An example of when I use S3 Inventory is when I start evaluating how a new backup software or new version of backup software uses S3 I like to turn it on to see how it's writing and manipulating the data and storage classes to ensure things like

- Does it consistently use the correct storage class for everything (rarely)
- Does it leverage object lock to protect the data as advertised
- Does it correctly use it for everything

S3 Inventory definitely isn't for everyone but it's a good tool to know its there when the bill skyrockets and you don't know why. If you'd like to set up S3 Inventory know that much like for AWS Server Access Logging you need to first provide the logging service access to the destination log bucket, then configure each bucket to enable the service. This can be done via the Console UI under Management and Inventory Configurations. Be sure to take note of all the "optional" data under the metadata fields

{{< figure src="image-55.png" alt="" >}}

Much like the S3 Server Access Logging that I recently covered I am fundamentally lazy and don't want to have to do this over and over again for each bucket so in the [same script ](https://github.com/k00laidIT/AWS/blob/main/S3Logging/s3-invandlogging.ps1)shared for access logs I've also have the option for S3 Inventory Service. It's worth noting in the script access logging is enabled by default but S3 Inventory is not since it creates so much information.

## Conclusion

We all know at this point that while cloud computing and storage is great, click, click, next does not always equal secure and cost effective. Understanding the data that you land in AWS' S3 service can ensure that your data is both secure and is being stored in the most cost efficient manner possible. Using services like Storage Lens to understand our data at a macro level and S3 Inventory to understand it at the object level and power our own programmatic insights and analytics is a great way to learn about what we're writing.