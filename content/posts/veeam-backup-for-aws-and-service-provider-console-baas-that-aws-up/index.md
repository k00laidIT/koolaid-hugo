+++
title = "Veeam Backup for AWS and Service Provider Console: BaaS that AWS Up!\\u00a0"
date = "2023-04-28T13:01:38Z"
draft = false
tags = [ "AWS", "how to", "VBA", "veeam",]
categories = [ "AWS", "Service Provider", "Veeam",]
featureimage = "featured.png"
+++


As we continue our journey into exploring new products and features that Veeam has released for 2023 it’s well worth the time to look at what [Veeam Backup for AWS](https://www.veeam.com/aws-backup.html) (VBA) is looking like these days. If you haven’t been using this software yet with this version 6 release it has deepened its relationships with other Veeam products, namely Veeam Cloud Connect powered by [Backup and Replication](https://www.veeam.com/vm-backup-recovery-replication-software.html?ad=menu-products) (VBR) and [Veeam Service Provider Console](https://www.veeam.com/service-provider-console.html) (VSPC). This allows VCSPs to supply a true managed BaaS service without the customer needing their own VBR and/or VBA components.

In the first releases of Veeam Backup for AWS installation and licensing were exclusively done via the [Amazon AWS Marketplace](https://aws.amazon.com/marketplace/); customer goes and looks for it, installs it and then pays AWS a fixed fee for usage, all the while being required to manage their own backups. The more modern releases have allowed integration into a customer installed Veeam Backup and Replication, allowing for deployment and management via VBR’s console and allowing it to inherit Veeam Universal Licenses (VUL) via that installation. That is much better but still requires customer own and manage their backups and licensing for the most part, something that I’ve heard from numerous customers and potential customers that are fully into hyperscale cloud for their infrastructure they are hesitant to do.

Now that this combination of releases has come out, VBR v12, VSPC v7 and VBA v6, we have the ability to do something more like the common Shared Responsibility Model that cloud first customers are accustomed to; the customer owns the production workloads and data while the service provider owns the infrastructure that powers the backup service, with both capable of managing the backup jobs and copies as needed.

With each release not only has Veeam added to the deployment and management methods they have also added features. With this most recent release when coupled with the aaS model you have the capability to backup workloads through the following AWS services:

### What Can It Do 

- EC2 compute instances
- RDS databases
- EFS file systems
- VPC configuration

{{< figure src="featured.png" alt="" >}}

All of these backups will land into immutable, encrypted, and secured [AWS S3 storage](https://aws.amazon.com/s3/) with the capability to provide a second equally secured copy into a separate region and/or a separate AWS account. Further as part of your data protection policy creation you can also schedule AWS snapshots for the local availability zone (AZ) with replicas of snapshots then able to be sent to different regions and/or accounts. This is similar (but not quite) like VM replication. These replicas then show in inventory in the DR AZ and can be failed over to as needed. All in all you can protect the majority of services that most “cloud first” customers need and be able to backup, copy or replicate to a very promising number of locations.

### How Does This Thing Work 

For those who are used to how Veeam does backup job creation for traditional workloads this is quite a bit different in that it is policy based. Either you the customer or 11:11 Systems for a managed service create policy definitions for your workloads via Console. These policies define things like where to land backups, how copies should be handled, if snapshots are created and then replicated and schedules. Those policies can then be applied to workloads that are discovered via an AWS key pair that you create with defined IAM policies and then add to Veeam Backup for AWS via Console. Monitoring and management then also be provided by Console so in the end you have a modern, Shared Responsibility Model style BaaS capability with a single UI for the customer.

### Conclusion 

Backup for public cloud workloads is that thing that we as IT professionals truly need to care about. These are still running workloads that are critical to your business and just as we’d all shudder at thinking “snapshots are backups” in traditional virtualized environments you shouldn’t exclusively rely on that in the cloud. The combination of Veeam Backup for AWS, as well as Azure and GCP, and service provider style services provided by 11:11 Systems will allow customers to in effect have their clouds and back them up too.