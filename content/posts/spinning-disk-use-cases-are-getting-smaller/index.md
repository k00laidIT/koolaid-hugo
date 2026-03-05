+++
title = "Spinning Disk Use Cases Are Getting Smaller"
date = "2024-01-08T14:32:58Z"
draft = false
tags = [ "gestalt", "sfd26", "Solidigm", "storage", "tech field day",]
categories = [ "Systems", "Tech Field Day",]
featureimage = "featured.jpg"
+++


As I’ve previously mentioned I was fortunate enough to recently attend the joint [SNIA’s Storage Developer 2023 Conference](https://storagedeveloper.org/events/sdc-2023/agenda/tracks) and [Gestalt Storage Field Day 26](https://techfieldday.com/event/sfd26/) Event. At these events we both heard directly from companies in \*FD style but also dove deep into the storage realm with an excellent collection of breakout sessions.

One thing you did not hear much about at either event was traditional spinning hard disks. For all the new hotness such as AI/ML model building it just simply isn’t fast enough without throwing literal racks of it at the problem to keep up with the ingress. For edge use cases such as the super cool keynote about the [Spaceborne Compute](https://www.hpe.com/us/en/compute/hpc/supercomputing/spaceborne.html) systems from [HPE](https://www.hpe.com) in the International Space Station or anything manufacturing related there is an idea that any kind of storage medium that moves will quickly become damaged because of environmental reasons.

Next comes density. For the longest time we all wanted SSDs but you largely weren’t going to be able to get even into terabyte range and if you did the cost per gig were going to be so astronomically higher it wasn’t possible except for high speed workloads. Today we are not only seeing flash based disks economically in the multi-terabyte range but with the innovations into QLC such as what Solidigm is up to lately we’re seeing SSD rival and surpass spinning disk both in capacity and price. Take for example the [D5-P5336 from Solidigm](https://www.solidigm.com/products/data-center/d5/p5336.html); these disks range from 15.36 TB up to 61.44 TB (coming soon) in a single device. That’s seems insane to me but at the same time this type of capacity is what is needed by the market. Paired with the D7-5810 by the Cloud Storage Acceleration Layer software as we saw during their [SFD26 presentation](https://techfieldday.com/video/solidigm-qlc-ssds-designed-for-value-performance-and-density/) to create a tiered storage system you can achieve amazing reads and writes while maintaining far lower cost than we associated with high speed, dense storage in the past.

Finally with modern flash storage there is a much greater level of energy efficiency. This was a major topic of the conference, with sustainability being a core datacenter architectural design constraint how storage power consumption is involved. End of the day flash is to storage as LED bulbs are to your home’s lighting, it’s just better and cheaper and the technological innovations we need.

## Conclusion

In the end where does that leave traditional spinning disks? I think you are going to still have the “cheap and deep” use case for now; think secondary backup storage or glacier style object storage platforms, but if the current trend of SSD pricing going to rock bottom continues those will become less common.