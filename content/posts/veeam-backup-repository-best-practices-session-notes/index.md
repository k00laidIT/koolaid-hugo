+++
title = "Veeam Backup Repository Best Practices Session Notes"
date = "2015-11-05T17:44:45Z"
draft = false
tags = [ "backup", "conferences", "vDM30in30", "Veeam Vanguard", "veeamon",]
categories = [ "Education", "Veeam", "Virtualization",]
featureimage = "featured.png"
+++


After a couple days off I'm back to some promised VeeamON content. A nice problem that VeeamON had this year is the session choices were much more diverse and there were a lot more of them. Unfortunately this led to some overlap of some really great sessions. A friend of mine, [Jaison Bailey](https://twitter.com/penlem166) of [vBrisket](http://vbrisket.com) fame and fortune, got tied up in another session and was unable to attend what I considered one of the best breakout sessions all week, [Anton Gostev](https://twitter.com/gostev)'s Backup Repository Best Practices so he asked me to post my notes. For those not too familiar with Veeam repos they can essentially be any manner of addressable disk space, whether local, DAS, NAS, SAN or even cloud, but when you start taking performance into account you have to get much more specific. Gostev, who is the Product Manager for Backup &amp; Replication, lines out the way to do it right. Anyway, here's the notes including links to information when possible. Any notations I have are in bold and italicized. Don't underestimate the importance of Performance

- Performance issues may impact RTOs
 
 Five Factors of choosing Storage - Reliability
- Fast backups
- Fast restores
- DR from complete storage loss
- Lowest Cost
 
 Ultimate backup Architecture - Fast, reliable primary storage for fastest backups, then backup copy to Secondary storage both onsite AND offsite
- Limit number of RP on primary, leverage cheap secondary
- Selectively create offsite copies to tape, dr site, or cloud
 
 Best Repo: Low End - Any Windows or Linux Server 
    - Can also serve as backup /backup proxy server
- Physical server storage options 
    - Local Storage
    - DAS (JBOD)
    - SAN LUN
- Virtual 
    - iSCSI LUN connected to in guest Volume
 
 Best Backup Repo: High End - Deduplicating storage devices 
    - [EMC Data Domain](http://www.emc.com/data-protection/data-domain/index.htm)
    - [ExaGrid](http://www.exagrid.com/exagrid-products/product-line/)
    - [HP StoreOnce](http://www8.hp.com/us/en/products/disk-backup/product-detail.html?oid=5196525)
- Sometimes Virtual Tape Library (VTL) will be a better (faster) option for backups
 
 Backup Repos to Avoid - Low-end NAS &amp; appliances 
    - If stuck with it, use iSCSI instead of other protocols <span style="color: #339966;">***\* Ran into this myself with a Qnap array as my secondary storage, not really even feasible to run anything I/O heavy on it***</span>
- SMB (CIFS) network shares 
    - Lots of issues with existing SMB clients
    - If share is backed up by server, add actual server instead
- VMDK on VMFS ***\*Nothing wrong with running a repo from a virtual machine, but don't store backups within, instead connect an iSCSI LUN directly to the VM and format NTFS***
    - Extra logic on the data path- more chances for data corruption
    - Dependent on vSphere being functional
- Windows Server 2012 Deduplication (scalability) ***\*I get his rationale, but honestly I live and die by 2012 R2 deduplication, it just takes more care and feeding than other options. See [my session's slides for notes](/presenting-at-veeamon-2015-design-manage-and-test-your-data-protection-with-veeam-availabilty-suite/) on how I implement it.***
 
 Immediate Future: Technologies to keep in mind - [Server 2016 Deduplication](http://blogs.technet.com/b/filecab/archive/2015/05/05/data-deduplication-in-windows-server-technical-preview-2.aspx)
    - Same deduplication, far greater performance and scale (64 TB files) ***\*This really will be a big deal in this space, there is a lot of upside to a simple dedupe ability rolled into a Windows server***
- ReFS 2.0 
    - Great fit for backup repos because it has built in data corruption protection
    - Veeam is currently working on some things with it
 
 Raw Disk - Raid10 whenever you can (2x write penalty, but capacity suffers)
- Raid5 4x write penalty, greater risks)
- Raid6 severe performance overhead (6x write penalty
- Lookup Maximum performance per spindle
- A single job can only keep about 6-8 spindles busy- use multiple jobs if you have them to saturate
- RAID volume 
    - Stripe Size 
        - Typical I/O for Veeam is 25k-512KB
        - Windows Server 2012 defaults to 64KB
        - **At least 128 KB stripe size is highly recommended**
            - Huge change for things like Synthetics, etc
    - RAID array 
        - Fill as many drives as possible from the start to avoid expansion
        - Low-end sorage systems have significant performance problems
    - File System 
        - NTFS (Best Option) 
            - Larger block size does not affect performance, but it helps avoid excessive fragmentation so 64KB block size recommend
            - Format with /L to enable larger file records
            - 16 TB max file size limit before 2012 (now 256)
            - ***\* Full string of best practices for format NTFS partition from CLI:* *Format &lt;drive:&gt; /L /Q /FS:NTFS /A:8192***
        - ReFS not ready for prime time yet
        - Other 
            - [ZFS worth a look](https://www.freebsd.org/doc/handbook/zfs.html)
    - Backup Job Settings 
        - Always a performance vs disk space choice
        - Reverse incremental backup mode is 3x I/O per block
        - Consider forever incremental instead
        - Evaluate transform performance
        - Repository load 
            - Limit concurrent jobs to a reasonable amount
            - Use ingest rate throttling for cross-SAN backups
 
 Dedupe Storage: Pains and Gains - Gains 
    - True global dedupe
    - Lowest cost/ TB
- Do not use deduplicating storage as your primary backup repository!
- But if you must leverage vendor-specific integrations, use backup modes without full backup transformation, us active fulls instead of synthetics
- If backup performance is still bad, consider VTL
- 16TB+ backup storage optimization for 4MB blocks (new)
- Parallel processing may impact dedupe ratios
 
 Secondary Storage Best Practices - Vendor-specific integrations can make performance better
- Test Backup Copy retention processing performance. If too slow consider Active Full option of backup copy jobs (new in v9)
- If already invested and stuck 
    - Use as primary storage and leverage native replication to copy backups to DR
 
 Backup Job Settings BP Built-In deduplication - Keep **ON** for best performance (except lowest end devices) even if it isn't going to help you with Per VM backup files
- Compression 
    - Instead of disabling keep Optimal enabled in job and use "decompress before storing- even locally
    - Dedupe-friendly isn't very friendly any more (new) 
        - Will hinder faster recovery in v9
- Vendor recommendations are sometimes self-serving to achieve higher dedupe ratios but negatively effect performance
 
 Disk-based Storage Gotchas - Gostev loves tape 
    - Cheaper
    - Reliable
    - Read-only
    - Customer Success is the biggie
    - Tape is dead 
        - Amazon, Google &amp; 50% of Veeam customers disagree
- Storage-level corruption 
    - RAID Controllers are your worst enemies
    - Firmware and software bugs are common, too
    - VT402 Data Corruption tomorrow at 1:30 for more
- Ransomware possible
 
 The 2 Part of the 3-2-1 Rule - 3 copies, 2 different medias, 1 offsite
- Completely different storage type!
 
 Storage based replication - Betting exclusively on storage-based replication will cost you your job
- Pros: 
    - Fantastic performance
    - Efficient bandwidth utilization
- Cons: 
    - Replicates bad data too
    - Backups remain in a single fault domain
 
 Backup Copy vs. Storage-Based Copy - Pros: 
    - Breaks the data loop (isolated source and target storage)
    - Implicitly validates all source data during its operation
    - Includes backup files health check
- Cons: 
    - Higher load on backup storage
 
 Make Tape out of drives - Low End: 
    - Use rotated drives
    - Supported for both primary &amp; backup copy jobs
- Mid-range: 
    - Keep an off-site copy off-prem (cloud)
- High End: 
    - Use hardware-based WORM solutions
 
 Virtualize your Repository (SOBR) - simplify backup storage and backup job management
- Reduce storage hardware spending by allowing disks to be fully utilized
- Improve backup storage performance and scalability
 