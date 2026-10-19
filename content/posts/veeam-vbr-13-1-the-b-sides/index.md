+++
title = "Veeam VBR 13.1: The B Sides"
date = "2026-10-19T00:00:00-04:00"
draft = false
tags = ["veeam", "vbr", "v13", "Veeam Vanguard", "cloud connect", "vsa", "universal cdp"]
categories = ["Veeam"]
featureimage = "featured.png"
+++

Back in the olden days, when you bought a cassette single the song you'd heard on the radio was on the A side, and the B side was where the band put whatever else they had lying around. Every once in a while though you'd flip the tape over, hit play, and find the track you'd still be listening to 20 years later.

Veeam Backup & Replication 13.1 went GA on July 29th and, despite the "point release" label, it shipped with [more than 70 new features and enhancements](https://helpcenter.veeam.com/docs/vbr/wn/new_features.html). The A sides have already gotten plenty of airplay: automated Active Directory Forest Recovery, six new hypervisors, the Snap Scale engine for 100+ TB databases, and Veeam Intelligence growing up from an assistant into an agent. All great, all well covered.

But as we all know by now, the What's New document is where the real stories hide. So let's flip the tape over and look at the B sides, the things buried in the release notes that I think deserve a spin.

## Cloud Connect

If you've been around the service provider side of Veeam for any length of time you know Cloud Connect releases can be a bit sparse. Not so this time; [13.1 gives VCC](https://helpcenter.veeam.com/docs/vbr/wn/veeam_cloud_connect.html) more [Real Love](https://www.youtube.com/watch?v=NqmG8xkjfIk) than it's had in a while.

### Restore Encrypted Tenant Backups

While backup is always what people talk about, recovery is the undercover star and you gotta [Protect Ya Neck](https://www.youtube.com/watch?v=R0IUR4gkPIE) through available and proven recovery scenarios. With this release service providers can now restore encrypted tenant backups directly on the Cloud Connect server, as long as the tenant opts in and sets the scope of what the provider is allowed to restore. This is the piece that makes truly managed recovery possible: when the tenant's own backup server is the thing on fire, the provider can do the recovery without waiting for someone to find the encryption password.

As with all good B sides there's a little tape hiss. Per the [release notes](https://helpcenter.veeam.com/rn/veeam_backup_13_1_release_notes.html), backups that have tiered to a capacity or archive tier aren't decrypted, backups encrypted with a KMS key before the opt-in aren't decrypted, tenants with tape jobs can't use it, and a 13.1 tenant can't opt in if their provider is still running 13.0.x. Plan accordingly.

### Universal CDP, Now With Linux

The Universal CDP agent was one of the v13 features I was most excited about because it decouples near-zero RPO replication from the hypervisor. In 13.1 it extends to Linux VMs and physical servers, replicating to Cloud Connect targets backed by either VMware Cloud Director or vSphere hosts. [The Question Remained](https://www.youtube.com/watch?v=NiyhQ-A7Ygw): what to do when the source isn't one of those things? For service providers running VMware-based services, that's the real story here. Because the replication comes from an agent inside the guest, the source doesn't matter: any hypervisor, any cloud, or bare metal can all land on the same VMware-based DRaaS target. The provider no longer needs to care what the customer runs in production, only where it's going.

### RBAC for Cloud Connect Backups

Custom roles on the tenant's backup server now extend their scope to backups hosted at the provider. A scoped operator who can restore their department's VMs from local backups can now do the same from the off-site copy, which is exactly how it should have always worked when looked at through a proper [Eye Examination](https://www.youtube.com/watch?v=4DVoynoP0NE).

### Recover VCC to All the Things

Providers can now restore tenant backups from the Cloud Connect server to a much longer list of targets: entire VM restore to Nutanix AHV, Proxmox VE, oVirt KVM, Scale Computing HyperCore, and HPE Morpheus VM Essentials, plus Instant VM Recovery to Hyper-V. With customers scattering across hypervisors post-Broadcom, the provider no longer has to match the customer's platform to get them running again.

## Security and Manageability

### VSA Maturation

The Veeam Software Appliance (VSA) was the headline of v13, and like any 1.0 it had some rough edges. [13.1 sands a lot of them down](https://helpcenter.veeam.com/docs/vbr/wn/veeam_software_appliance_and_veeam_infrastructure_appliance.html):

- **Cross-subnet HA clusters** so your HA pair can live in different networks or sites
- **Prometheus-compatible metrics** via Node Exporter, plus syslog forwarding for appliance events
- **Enterprise Manager as an update mirror** for environments with restricted or proxied internet
- **HotAdd support** for vSphere backups in all-in-one VSA deployments
- **Custom TLS certificates** for the Host Management Console and a strict, global FIPS compliance mode

None of these are flashy, but they're the difference between an appliance you test in the lab and one that is [Hard Like A Criminal](https://www.youtube.com/watch?v=RJdQ9KSmWAY) and you can trust in production.

### API Access Moves to Port 443

The REST API no longer needs its own port and now answers on 443. Port 9419 stays open for backward compatibility so your existing scripts won't break on upgrade, but it will be deprecated in a future release, so now's the time to go update those scripts.

This pairs with a bigger change hiding a few lines away: **single-port transport**. Backup traffic used to need the dynamic 2500–3300 range, which was always a hard conversation with the firewall team. Now all of it runs over a single port. Fewer open ports means a smaller attack surface, and in a segmented network that's a big deal.

### Malware Scanning for NAS Backups

Up to now the malware detection story was largely about VMs and agents. In 13.1 it [extends to unstructured data](https://helpcenter.veeam.com/docs/vbr/wn/unstructured_data_protection.html), with file-level analytics that flag mass renames and deletions plus Indicators of Compromise scanning. Veeam Threat Hunter and YARA rule scanning now cover file share and object storage backups too. File shares are often where ransomware does its most visible damage, so it's good to see them get the same treatment. Note that this requires the Advanced edition.

### Storage Management in the VSA

Administrators can now add drives to an existing VSA after installation to grow capacity or create new repositories, and the appliances support Fibre Channel and iSCSI storage with multipathing. Put those together and a hardened, consolidated all-in-one VSA, with the backup server and its repository on one locked-down box, becomes a realistic design instead of a sizing gamble on day one.

## Platforms

### VCF 9.1 and VCD 10.6

For those of us still living in VMware land, 13.1 brings [support for VMware Cloud Foundation 9.1](https://helpcenter.veeam.com/docs/vbr/wn/hypervisor_protection.html) across backup, replication, and CDP, along with VDDK 9. On the service provider side, VMware Cloud Director 10.6.x, including 10.6.2, remains [fully supported](https://www.veeam.com/kb4488).

The sleeper here is cluster-wide vPowerNFS mounts for Instant Recovery. The recovered disks are now visible to every host in the cluster, so HA, DRS, and host maintenance keep working while you have VMs running out of a backup. Anyone who has had to babysit an Instant Recovery VM through a host patch window will appreciate this one.

### Universal Hypervisor API

The new hypervisors got the A-side treatment, but how two of them got there is the more interesting story. The Universal Hypervisor API gives vendors a defined path to Veeam compatibility: the vendor implements the standard API, and Veeam reviews and certifies the platform. VergeOS and Platform9 are the first two through the door. Instead of Veeam's engineers building every integration by hand, the vendors do the work, which should mean the list of supported platforms grows much faster from here.

### The Licensing Direction of Travel

This one isn't a feature, but it's worth calling out. The VSA only accepts [Veeam Universal License (VUL)](https://www.veeam.com/legal/licensing-policy.html) instance-based licensing, along with rental and NFR licenses. Windows deployments of 13.1 still support the legacy socket-based Standard, Enterprise, and Enterprise Plus licenses, as well as Community Edition.

So socket-based licenses still work today, but only if you stay on Windows. If the appliance is in your future, and with everything above it probably should be, the license conversion is part of the migration plan.

## Conclusion

None of these will headline a keynote, but they're the ones that will change how you build and run your Veeam environment day to day. Do yourself a favor and read the full [What's New document](https://www.veeam.com/veeam_backup_13_1_whats_new_wn.pdf) and the [release notes](https://helpcenter.veeam.com/rn/veeam_backup_13_1_release_notes.html) cover to cover. There are more B sides in there than I could fit on one tape.
