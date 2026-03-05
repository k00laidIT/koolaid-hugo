+++
title = "Veeam v11 Proxy Feature Comparison"
date = "2021-04-08T08:30:53Z"
draft = false
tags = [ "backup", "linux", "linux proxy", "v11", "veeam",]
categories = [ "Veeam", "Virtualization",]
featureimage = "featured.png"
+++


I recently had the opportunity to read through [Anthony Spiteri's](https://twitter.com/anthonyspiteri) [excellent post](https://anthonyspiteri.net/v11-service-providers-linux-proxy/) on the enhancements to the Linux Proxy in the most recent release of it's flagship Backup and Replication product. In the course of reading it I wondered how close to feature parity the Linux variant is to the Windows version and while the gap is rapidly closing I found that we aren't quite there yet. Thanks to [Rick Vanover](https://twitter.com/rickvanover) and [Michael Cade](https://twitter.com/michaelcade1) for coming through with some answers I've created the following table.

In short when it comes to the actual moving of data the vast majority of VBR users will be able to leverage Linux proxies without an issue, although this is a good reason to not be collapsing all the proxy types into a single server. While by and large this is still a fine idea there are situations where you should not. If you are doing the next step of Guest Processing you may need to take the extra step of specifying either the VBR server itself or another Windows server to act as the Guest Interaction Proxy but that should be doable for most without adding additional infrastructure.

One final note regarding proxies that is relevant to the v11 release it is considered best practice to never share the CDP proxy role with any thing else, it should be a dedicated server.

**Feature** | **Windows** | **Linux** |
|---|---|---|
| Physical Deployment | X | X |
| Virtual Deployment | X | X |
| Direct Storage Access Transport | X | X |
| Hot Add Transport | X | *X\** |
| Network Transport | X | X |
| Backup from Storage Snapshot | X | *X\*\** |
| Guest Interaction | X |  |
| NFS Storage Integration | X |  |
| File Backup Proxy | X |  |
| Continuous Data Protection | X |  |
| Hyper-V Backup/Replication | X |  |

Linux backup proxies that use virtual appliance (Hot-Add) transport mode do not support the VM copy scenario.*  
*\*\* Backup from Storage Snapshot with Linux Proxies is support on iSCSI and Fibre Channel targets only.*

Source: [Backup and Replication v11 User Guide](https://helpcenter.veeam.com/docs/backup/vsphere/backup_proxy_requirements.html?ver=110)