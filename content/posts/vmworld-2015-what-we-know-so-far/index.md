+++
title = "VMworld 2015: What We Know So Far"
date = "2015-08-31T14:28:34Z"
draft = false
tags = [ "announcements", "conferences", "virtualization", "vmware", "VMworld",]
categories = [ "Virtualization",]
featureimage = "featured.png"
+++


As the first general keynote is wrapping up here in San Francisco I've been trying to keep track of what's been announced this morning both in the keynote but also by way of the blogsphere. Long story short my take is there isn't any thing new for the traditional vSphere customer, but if you are ready to start moving some of those workloads to the cloud there is going to be plenty of new things to enable what VMware is calling the hybrid cloud (repeatedly); the ability to support both your legacy apps (you know what we're actually using) as well the new, shiny cloud native apps your developers are deploying at the speed of light. Please forgive the notes based format found below, but I wanted to get the information out there. Announcements so far:

- [

{{< figure src="Picture2-1024x475-300x139.png" alt="Picture2-1024x475" >}}

](Picture2-1024x475.png)EVO SDDC Manager 
    - "Single Pain of Glass for managing all the hardware in your datacenter racks including 
        - EVO:Rail for compute, storage
        - Partner networking devices for management, spine and top of rack
        - Rack power distribution
        - Covers vRealize Suite, NSX 6.2, VSAN 6.1, vSphere 6
    - Is this the EVO:Rack they hinted at last year?
    - <http://www.vmware.com/radius/vmworld-2015-the-end-of-the-beginning-lets-go/>
- Vmware Integrated OpenStack 2 
    - Updates to the Kilo release, enabling features including 
        - Expanded language support
        - Multi-region, multi-hypervisor support
        - Load Balancing as a Service
        - Autoscaling
- vSphere Integrated Containers &amp; Photon Support 
    - Enables the truly hybrid cloud, with Photon/Bonneville/ESXi handling life under vCenter and Photon Machine powering your Cloud Native Apps
- Project SkyScraper; hybrid cloud capabilities for vSphere allowing for extending DC to public cloud while supporting on premises standard concerns like security and business continuity ideas 
    - Cross Cloud vMotion &amp; content sync between on-prem and vCloud Air
    - vCloud Air Hybrid Cloud Manager- free download behind fee based capability
- NSX 6.2 update allowing for deeper integration with the physical devices below it 
    - Allows for the microsegmentation of physical servers, big differentiator past when compared to Cisco ACI
    - Will need partners, not known at this point but I'm guessing not Cisco
    - Also now supports cross vCenter vMotion over VXLAN
    - Has a TraceFlow capability allowing visability to what data is passing through
    - Announced late last week that there are now over 700 NSX customers, about double what was announced at Vmworld last year
    - Greater reliability through support for a secondary NSX manager that will take over if the primary fails
    - <http://www.crn.com/news/networking/300077934/vmware-gets-physical-with-latest-nsx-software-defined-networking-update.htm>
- VSAN 6.1 
    - 3rd total release
    - VSAN Stretched Cluster support, can now have geographically diverse clusters with synchronous replication between sites
    - VSAN for ROBO- Seems interesting, can have large number of 2 node VSAN clusters at your Remote Offices that are then centrally managed through vCenter. 
        - Does it make use of stretched cluster for for data protection per site?
    - Now supports native Windows and Oracle clustering methods, WSFC and RAC
    - New high performance hardware supportd in ULLtra DIMM SSDs and NVM interfaces
    - New management features such as a Web Client Health Check plugin for VSAN and a management pack for vROPS
 
- <http://www.punchingclouds.com/2015/08/31/vmware-virtual-san-6-1/>
 
- SRM 6.1 
    - Stretched Cluster as well, seems to be the theme this year
    - Storage Policy Protection Groups; uses tags 1. tag a VM; 2. tag a datastore; protect the datastore with SRM
    - http://www.viktorious.nl/2015/08/31/vmworld-2015-srm-6-1-whats-new-stretched-cluster-support-and-more/
- Other: 
    - vSphere Content Library will be able to sync content between on-prem and vCloud Air bidirectionally
    - Vmware identity services, VMW's assault on Active Directory