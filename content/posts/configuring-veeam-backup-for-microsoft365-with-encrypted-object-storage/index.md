+++
title = "Configuring Veeam Backup for Microsoft365 with Encrypted Object Storage"
date = "2022-02-07T13:19:43Z"
draft = false
tags = [ "how to", "iland", "object storage", "veeam", "Veeam Vanguard",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


In [my last post](https://www.koolaid.info/getting-started-with-s3-compatible-object-storage/) I worked through quite a few things I've learned recently about interacting with [S3 Compatible storage](https://iland.com/services/iland-object-storage/) via the CLI. Now that we know how to do all that fun stuff it's time to put it into action with a significant Service Provider/Disaster Recovery slant. Starting with this post I'm going to highlight how to get started with some common use cases of object storage in Backup/DR scenarios. In this we're going to look at a fairly mature use case, with it backing [Veeam Backup for Office (now Microsoft) 365](https://www.veeam.com/backup-microsoft-office-365.html?ad=menu-products).

Veeam Backup for Microsoft 365 v6, which was recently showcased at [Cloud Field Day 12](https://techfieldday.com/event/cfd12/), has been leveraging object as a way to make it's storage consumption more manageable since version 4. Object also provides a couple more advantages in relation to VBM, namely an increase in data compression as well as a method to enable encryption of the data. With the upcoming v6 release they will also support the offload of backups to AWS Glacier for a secondary copy of this data.

VBM exposes its use of object storage under the Object Storage Repositories section of Backup Infrastructure but it consumes it as a step of the Backup Repository configuration itself, which is nested within a given Backup Proxy. I personally like to at a minimum start with scaling out repositories by workload (Exchange, OneDrive, Sharepoint, and Teams) as each data type has a different footprint. When you really need to scale out VBM, say anything north of 5000 users in a single organization, you will want to use that a starting point for how you break down and customize the proxy servers.

Let's start by going to the backup proxy server, in this case the VBM server itself, and create folder structure for our desired Backup Repositories.

{{< figure src="image-17.png" alt="Windows Explorer showing backup repository folders for ilandproduct-exch, ilandproduct-od, ilandproduct-sp, and ilandproduct-teams" >}}

Now that we have folders let's go create some corresponding buckets to back them. We'll do this via the [AWS S3 CLI](https://aws.amazon.com/cli/) as I showed in my last post. At this point VBM does not support advanced object features such as Immutability so no need to be fancy and use the s3api, but I just prefer the command structure.

{{< figure src="image-18.png" alt="Terminal showing AWS CLI s3api create-bucket commands and s3 ls output confirming 4 VBM buckets created" >}}

Ok so now we have folder and buckets, time to hop in to Veeam. First we need to add our object credentials to the server. This is a simple setup and most likely you will only need one set of credentials for all your buckets. Because in this example I will be consuming iland Secure Cloud Object Storage I need to choose the "S3 Compatible access key" under the "Add..." button in Cloud Credential Manager (menu&gt; Cloud Credentials). These should be the access key and secret provided to you by your service provider.

{{< figure src="image-19.png" alt="VBM Cloud Credential Manager Add Credential dialog for S3 compatible access key and secret key" >}}

Now we need to go to Backup Infrastructure &gt; Object Storage Repositories to add our various buckets. Start by right clicking and choose "Add Object Storage."

{{< figure src="image-20.png" alt="VBM New Object Storage Repository name step with "ilandproduct-exch" entered" >}}

{{< figure src="image-21.png" alt="VBM object storage type selection with S3 Compatible option chosen" >}}

{{< figure src="image-22.png" alt="VBM S3 compatible storage configuration showing endpoint URL, region, and credentials fields" >}}

{{< figure src="image-23.png" alt="VBM S3 bucket dropdown showing all available ilandproduct VBM buckets" >}}

{{< figure src="image-24.png" alt="VBM bucket step with bucket and folder selected and Finish button ready" >}}

Now simply repeat the process above for any and all buckets you need for this task.

{{< figure src="featured.png" alt="VBM Object Storage Repositories list showing 4 configured S3 compatible repositories" >}}

Now that we have all our object buckets added we need to pair these up with our on premises repository folders. It's worth noting that the on-prem repo is a bit misleading, no backup data as long as you use the defaults will ever live locally in that repository. Rather it will hold a metadata file in the form of a single jetDB file that service as pointers to the objects that is the actual data. For this reason the storage consumption here is really really low and shouldn't be part of your design constraints.

Under Backup Infrastructure &gt; Backup Repositories we're going to click "Add Repository.." and let the wizard guide us.

{{< figure src="image-26.png" alt="VBM New Backup Repository name step with "ilandproduct-exch" entered" >}}

{{< figure src="image-27.png" alt="VBM New Backup Repository location step specifying proxy server and folder path" >}}

{{< figure src="image-29.png" alt="VBM Add Password dialog for encryption with hint "ilandproduct Encryption Password"" >}}

{{< figure src="image-30.png" alt="VBM object storage backup repository step with offload and encrypt checkboxes enabled" >}}

{{< figure src="image-31.png" alt="VBM retention policy step showing 7 years retention with item-level retention selected" >}}

One note on that final step above. Often organization will take the "Keep Forever" option that is allowed here and I will say I highly advise against this. You should specify a retention policy that is agreed upon with your business/organization stakeholders as keeping any backup data longer than needed may have unintended consequences should a legal situation arise; data the organization believes to be long since gone is now discoverable through these backups.

Also worth noting item-level retention is great if you are using a service provider that does not charge you on egress fees because it gives you more granular control in terms of retention. If you use a hyperscaler such as Amazon S3 you may find this option will drive your AWS bill up because of a much higher load on egress each time the job runs.

Once you've got one added again, rinse and repeat for any other repositories you need to add.

{{< figure src="image-28.png" alt="VBM Backup Repositories list showing 4 repositories with item-level retention and 50GB capacity each" >}}

Finally the only step left to do is create jobs targeting our newly created repositories. This is going to have way more variables based on your organization size, retention needs, and other factors than I can truly do justice in the space of this blog post but I will show how to create a simple, entire organization, single workload job.

You can start the process under Organizations &gt; Your Organization &gt; Add to backup job...

{{< figure src="image-32.png" alt="VBM New Backup Job name step with "ilandproduct-exch" entered" >}}

{{< figure src="image-33.png" alt="VBM New Backup Job select objects step with Add dropdown showing Organization option highlighted" >}}

{{< figure src="image-34.png" alt="VBM Add Objects dialog showing ilandproduct.onmicrosoft.com organization checked" >}}

{{< figure src="image-35.png" alt="VBM Edit Processing Options showing Mail and Archive checked, OneDrive, Sites, and Teams unchecked" >}}

{{< figure src="image-36.png" alt="VBM New Backup Job showing ilandproduct organization with Mail and Archive listed in process column" >}}

{{< figure src="image-37.png" alt="VBM Select objects to exclude step with empty exclusion list" >}}

{{< figure src="image-38.png" alt="VBM Specify backup proxy and repository step showing CUSTOMER-VBO proxy and ilandproduct-exch repository selected" >}}

{{< figure src="image-39.png" alt="VBM Select scheduling options showing daily run at 10PM with retry 3 times configured" >}}

Once again you'd want to repeat the above steps for all your different workload types but that's it! If we do a s3 ls on our s3://premlab-ilandproduct-vbm365-exch/Veeam/Backup365/ilandproduct-vbm365-exch/ full path we'll see a full folder structure where it's working with the backup data, proving that we're doing what we tried to do!

{{< figure src="image-40.png" alt="AWS CLI s3 ls output showing Veeam folder structure in bucket including CommonInfo, CriticalDataBackup, Encryption, Organizations, and RepositoryLock folders" >}}

In conclusion I went way into depth of what is needed here but in practice it isn't that difficult considering the benefits you gain by using object storage for Veeam Backup for Microsoft365. These benefits include large scale storage, encryption and better data compression. Hope you find this helpful and check back soon for more!