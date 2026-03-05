+++
title = "Synology DS923+: Immutable Microsoft365 Protection"
date = "2024-10-24T14:52:49Z"
draft = false
categories = [ "Uncategorized",]
featureimage = "featured.png"
+++


In continuing my look at the latest generation Synology DS devices, in this case a DS923+, one aspect that I'm continually impressed with is DSM's simple to use ActiveBackup capabilities for cloud services Microsoft365 and Google Workspaces. For many organizations a small, low cost solution coupled with an offsite copy is sufficient for practical data protection as well as compliance needs.

While Synology does not have a capability to have immutable first write storage volumes it does have a capability to create immutable snapshots. Further when coupled with CloudSync feature you can offload a copy of these backups to immutable object storage, albeit without the capability to actively write the immutability, instead needing to leverage the provider's native bucket policy capabilities.

In this post we'll create a legitimate, 3-2-1-1-0 compatible data protection strategy for my Microsoft365 account in 3 simple steps.

1. Configure ActiveBackup for Microsoft365 to backup to a local folder
2. Setup local, immutable snapshots for that folder
3. Offload that folder to an immutable AWS S3 bucket with CloudSync

## 0. Prerequisites

Install all the needed applications. By default DSM has no data protection applications installed so you will need to go to Package Center and for these tasks ensure the following is installed:

- Active Backup for Microsoft365
- Active Backup for Microsoft365 Portal (WebUI for facilitating restores)
- Snapshot Replication
- CloudSync

## 1. Configure ActiveBackup for Microsoft365

**Activate Active Backup product.** Upon first launch of the application you will need to activate it. As there is no additional cost to use the software I am not sure why this is necessary, here we are.

{{< figure src="12E58FD5-C111-47D8-B586-A081CC8523D4.png" alt="" >}}

**Create a folder for your backups.** This to be honest is an optional task but one that fits my own tendencies. Installation automatically creates an ActiveBackupforBusiness\\ActiveBackupforMicrosoft365 folder structure upon installation but I assume I may have a point where I want to protect more than a single organization so I create a folder for each organization.

{{< figure src="image-13.png" alt="" >}}

**Create a Active Backup Task.** In Synology's terminology a backup job is a task married to an organization. There really isn't a concept of creating multiple jobs for a single organization, but as i stated earlier, it errs on the side of simplicity.

{{< figure src="image-14.png" alt="" >}}

**Create a Certificate Password for Entra ID authentication.** Like all the other M365 data protection products that make use of Modern Authentication you must have a local certificate generated to authenticate to the Entra ID Application used to provide access. I do like that Synology has chosen to protect this certificate with a password.

{{< figure src="image-18.png" alt="" >}}

**Authenticate and grant rights.** As opposed to the old device code method Active Backup launches directly into authenticating to your M365 organization immediately after clicking next. The workflow that follows is much like adding your account to Apple Mail or Outlook so I won't go into what's involved there but it is good to know what rights you are granting to the Microsoft365 organization. It is important to note that you should only try to do this with an account with global administrator rights.

{{< figure src="image-15.png" alt="" >}}

**Creating an Azure AD application.** Those that know the ire I have in my heart for the Entra ID name that Azure AD has been changed to will recognize the happiness I felt in seeing the Synology UI using the old name. That said, it should probably be updated to the new one if I'm being picky, but the app registration is definitely straight forward enough and automatic.

{{< figure src="image-16.png" alt="" >}}

**Save an offline copy of your certificate.** Once you have successfully authenticated and created your AD app (sorry, old habits) the application will prompt you to save a copy of your certificate in a safe place. This will be important in case the link is ever broken for some reason.

{{< figure src="image-17.png" alt="" >}}

Once you have linked your account you can then create a backup task. In my case I'm going to keep it simple and backup everything for my 2 users but you can be far more granular, selecting different users and M365 services by clicking Edit. You can also optionally enable the web base portal that allow for self service restores. For my little use case it isn't needed but I'll enable for this purpose.

{{< figure src="image-4.png" alt="" >}}

Now one thing I really do like about Synology's Active Backup is the Auto-discovery capability. In the next sscreen you can predefine what to look for in terms of linked accounts and data types to automatically handle any new users or external entities that become linked to your account.

{{< figure src="image-5.png" alt="" >}}

Finally you set your backup policy. It's most appropriate for you to choose what matters for your own organization here but I would say a daily backup is sufficient for most organizations.

{{< figure src="image-6.png" alt="" >}}

And with that you are done with the backup portion. You will be prompted to run now and it's worth doing so. Once completed you should have green checks across the board and Backup status of Complete.

{{< figure src="image-11.png" alt="" >}}

## 2. Setting Up Immutable Snapshots

While I have already covered off this topic some in another post, [Two Simple Ways To Immutability With Synology](https://www.koolaid.info/two-simple-ways-to-immutability-with-synology/), I think it is important enough to show how to enable immutable snapshots in a Synology Array, especially if you are using it for backup. If you'll remember way back in step 1 we created an ActiveBackupforBusiness folder structure.

We'll now quickly launch the Snapshot Replication app and click on our shared folder and choose settings. We can then enable a snapshot schedule in hours|days|weeks|etc. to fit our needs. As I'm only doing a daily backup a daily snapshot should be sufficient as well. I'll also enable the immutable snapshots here. While you can select up to 30 days 7 is good for my needs.

{{< figure src="image-8.png" alt="" >}}

Next you'll want to click on the retention tab and enable a retention policy, limiting the number of snapshots you keep. As we are only keeping 30 versions of the backup day 30 days worth should be good here as well.

{{< figure src="image-9.png" alt="" >}}

Once completed you can click Snapshot, take a snapshot to go ahead and get your first one done.

{{< figure src="image-10.png" alt="" >}}

## Conclusion

Data protection of SaaS applications is important in today's security minded world. As we think about those backups we also want to make sure we are storing that data in an encrypted and periodically immutable form. With Synology and it's Active Backup for Microsoft365 software this can be achieved even for the smallest of organizations.