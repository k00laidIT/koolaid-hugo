+++
title = "What To Expect When You Are Expecting VBR v13"
date = "2025-09-03T08:58:08Z"
draft = false
tags = [ "v13", "vbr", "veeam", "Veeam Vanguard", "vone", "vspc9",]
categories = [ "Veeam",]
featureimage = "featured.png"
+++


As we head into September 2025 I look back and find that August has been quite the "Veeamy" month for me; I've put out a number of Veeam related posts ([here](/setting-up-object-storage-gateways-for-data-migration-to-aws-s3/), [here](/setting-up-pgbouncer-for-veeam-backup-for-microsoft365-v8/), [here](https://1111systems.com/blog/simplify-vbr-direct-repository-migration-with-veeamover/), and [here](https://1111systems.com/blog/sobr-migration-move-veeam-capacity-tier-to-1111-object-storage-for-amazon-s3/)), had a number of [Veeam 100](https://community.veeam.com/p/veeam100directory) briefings and last week was able to register for this year's [Veeam 100 Summit](https://community.veeam.com/blogs-and-podcasts-57/highlights-from-the-veeam-100-summit-2024-9117). While August seemed for the community side of Veeam to be big the rest of year appears ready to be heavy on the software side of things with the <s>upcoming</s> [v13 release](https://www.veeam.com/products/veeam-data-platform/software-appliance.html)(s) of their flagship product, Veeam Backup and Replication.

While much of the commentary going back as far as last year but especially since [VeeamON](https://jorgedelacruz.uk/2025/05/12/veeamon-2025-v13-veeam-software-appliance-new-webui-ha-universal-cdp-instant-recovery-from-vault-and-more/) this year has been about the long awaited Linux flavor of VBR there is a great deal of other features that will be rolled into this version as well as a higher than normal amount a nuance to understand before you think you'll be able to install and roll with it on day 1.

## 13.0 Appliance Then 13.0.1 Configurable Deployment

The first thing to know is that there will be a concept of staged releases over a relatively short period of time. When initially released VBR v13 will come as what is being call the "Veeam Secure Appliance," a VMware OVA or ISO for hardware/other deployments that has relatively strict requirements. This will be what is referred to as the 13.0 release and will be what I call "Linux all the things."

{{< figure src="image.png" alt="VSA v13 console screen" >}}

 All supported components will be available in Linux variants, more specifically Veeam's security-hardened version of Rocky Linux they are calling Just Enough OS or JeOS. The OVA and ISO for the VBR controller will be based on this and installation of the controller will be as simple as booting to the ISO/OVA and configuring the network via a TUI. Further an ISO for JeOS will be made available for download as well so. you can utilize it for your proxies and Veeam Hardened Repositories. Just as importantly with Veeam's vision of the appliance/hardened OS model of deployment all updates, both application and operating system, will be managed by Veeam to create a more holistically managed system.

In terms of security capabilities for the 13.0 release this is where we will see the bulk of new features, many of which stem from the hardened OS that they are now based on. Probably the most considered by long time users of the software is support for granular Role Based Access Control (RBAC) to the VBR itself. Gone will be the days where anyone needing to logon to the VBR console will need to be a local Administrator on the server and either you have all the rights or you have none. Veeam will also now be supporting SAML/SSO for the VBR server itself as well, with easy integrations into IDP systems such as Azure Entra ID and Okta for a better authentication posture out of the box. Finally in this initial release Veeam will delve into the "four-eyes" world with the concept of a named Veeam Security Officer account/role. For actions that effect the security of the appliance itself as well as the backups actions can be requested by standard users but must be approved by the veeamso account. Think of actions like

- SSH access to the appliance
- Privilege elevation
- Backup deletion
- etc.

{{< figure src="image-2.png" alt="" >}}

 That already seems like a lot, right? But in the spirit of typing this on my Apple Macbook Pro, One more thing...

v13 will also begin the move of the primary User Interface for VBR to a Web UI! This UI in v13 will not be feature complete, trivial things like support for adding Object Storage repositories will not be there for example. For these things a new installable console will also be available for those things that are not already built in. If you are an old head like me and remember the VMware transition from thick console to Web Client this will feel very familiar. Oh, and also.... Dark Mode!

{{< figure src="featured.png" alt="" >}}

 Finally I've been told that both VeeamONE and Veeam Service Provider Console will also be getting new releases when VBR 13.0 drops but as neither of these products have had betas alongside VBR I won't state any knowledge as to what will or won't be there. I continue to be very disappointed by the lack of holistic beta programs for the full picture of what a major version upgrade looks like but it is what it is.

To be clear all of these things will happen with the next release, 13.0 but there are a number of things that will not including a true GA release.

## Supported Preview Then General Availability

This next release will introduce a new term into the Veeam Lexicon, "Supported Preview." The v13 release will not be considered a GA release because it will not have a number of things to meet that milestone but will be fully supported by Veeam. Even though we've now had 2 beta release consider this the build to really start your testing and validation engines. So what won't you get in this preview release? Let's make a list:

- **Veeam Secure Appliance Only** - In later versions there will be both the ability for Windows installations as well as support distributed controller deployments (separate application, catalog, and database servers) but for this release it will only be one of the 2 appliance deployment modes.
- **Upgrade capability** - v13 will only support greenfield deployments. This makes a lot of sense considering it will be Linux only but migrations via configuration restores will also be blocked and unsupported.
- **Cloud Connect Support** - If you are familiar with Veeam's partner provided backup and replication services those will not be available in this initial release. That is for both the client and service provider side so don't be thinking you'll be replicating VMs to your SP in this release.
- Advanced and Premium Veeam Data Platform
- **Universal CDP Agent** - One of the features in v13 I'm most excited about is the concept of an agent based CDP replication capability, allowing for replication to be source agnostic and decoupling support from the hypervisor.

So if you are like many Veeam admins and like to do upgrades on day 1 it's not even a "just don't" guidance this time and more a "just can't."

## So What About 13.0.1 Then?

At some point, hopefully sooner than later, after the release of 13.0 another build will come out, 13.0.1 or so we've been told. This will be the General Availability release and when the flood gates should be opened, to an extent. This release will have support for the following deployment models

- Secure Appliance
- Windows based installers
- Distributed Linux or Windows systems for larger installs
- Cloud Connect Service Provider side on Windows

From a Windows to Windows upgrade point of view that will be fully supported in 13.0.1 for anyone, but as we think about Windows to Linux migrations that is being communicated as being supported in stages, at least as officially as [a forum post](https://forums.veeam.com/post551647.html#p551647) and a [FAQ note](https://forums.veeam.com/post552310.html#p552310). Further you can sign up today for assistance in migration on the shiny new [Transition to VSA](https://go.veeam.com/vsa-conversion) sign up page.

## Conclusion

In the end this should be a very transformational version for Veeam's biggest product as well as supporting applications such as Veeam ONE and Veeam Service Provider Console. Just like any other transformation those things take time to do them right and I applaud Veeam for taking the walk before they run approach to full release and deployment. As a veteran of early Veeam releases when Support learned that a major version had been released when I called support (literally) it's awesome to see the maturity start to shine through. I'll also note reading through the release documents, especially the What's New document, you can really see the effects of Veeam's Security focus over the past 2+ years, evolving the company from best-in-class backup software to a best-in-class data protection platform.

P.S. -- If you'd like to learn more about these releases please do continue reading from the various What's New documents:

- VBR 13: [https://www.veeam.com/veeam\_backup\_13\_whats\_new\_\_wn.pdf](https://www.veeam.com/veeam_backup_13_whats_new__wn.pdf)
- VONE 13: [https://www.veeam.com/veeam\_one\_13\_whats\_new\_wn.pdf](https://www.veeam.com/veeam_one_13_whats_new_wn.pdf)
- VSPC 9: [https://www.veeam.com/veeam\_console\_9\_0\_whats\_new\_wn.pdf](https://www.veeam.com/veeam_console_9_0_whats_new_wn.pdf)

To get started you can now [download](https://www.veeam.com/products/veeam-data-platform/software-appliance.html) the Veeam Software Appliance today!
