+++
title = "Thinking About… Storage in 2023"
date = "2023-10-25T20:25:38Z"
draft = false
tags = [ "Ctera", "gestalt", "sfd26", "SNIA", "Solidigm", "storage", "tech field day",]
categories = [ "Community", "Tech Field Day",]
featureimage = "featured.png"
+++


I was recently invited to attend [Gestalt IT](https://gestaltit.com)’s [Storage Field Day 26](https://techfieldday.com/event/sfd26/) event in conjunction with SNIA’s [Storage Developer Conference](https://storagedeveloper.org) in Fremont, CA. Through the SFD26 event we heard from

- [ctera](https://www.ctera.com), talking about their distributed object to block filer gateway and caching system and their new security focused capabilities that overlay it
- [Solidigm](https://techfieldday.com/companies/solidigm/) (the artist formerly known as Intel SSD by way of SK Hynix), who was talking about their high density, low(er) cost QLC SSDs
- And [SNIA](https://snia.org) (now a word, not an acronym), who highlighted their view of the state of the industry and put forth some of their new research projects.

<figure class="wp-block-image alignright size-large">

{{< figure src="img_1046-1.jpg" alt="" >}}

<figcaption class="wp-element-caption">Storage Field Day 26 Delegates at SDC2023</figcaption></figure>I’ll be honest, I’m not exactly a storage systems subject matter expert but I am a long time consumer of storage systems. Of late would definitely consider myself “storage adjacent” as my work has largely revolved around backups and data protection. I say that to say that going to an event like this was very much so a kick into the deep end of the pool. There were things that blew my mind (CXL and [DNA based storage media](https://gestaltit.com/tech-field-day/sulagna/preserving-data-through-centuries-without-hard-drives-meet-dna-data-storage/)) but also things which were completely in my lane such as the session advocating for S3 to become a standards based protocol.

In this series of posts I’ll be covering the event and the presenting organizations starting with some take aways that I had from SNIA’s Storage Developer Conference.

## What Is Old Is New Again

If you are like me and storage is at best a secondary technology for your attention you may have heard the of [Compute Express Link (CXL)](https://www.computeexpresslink.org) but maybe not the adjacent term that was everywhere at the event, storage class memory. As I’ve sat through a number of sessions and read the [excellent primer by Andy Banta](https://andybanta.substack.com/p/cxl-composable-infrastructures-missing) I’ve come to think of them as 2 sides of the same coin; CXL is putting expanded memory onto the PCIe bus and thus making it possible to radically scale the amount of RAM that can be available to a system and heavily cached RAM packaged as storage on the PCIe bus sold as storage class memory.

So why does this matter? It comes down to what leverage you need to expand for your need. If you need to have more RAM available per computing processor the CXL path is more appropriate. If you need ultra fast storage to either meet a specific workload need or to act as part of a tiered storage system such as the proposed SEF standard storage class memory may be more your target.

In both of these cases it is definitely early days of actually seeing it in the wild. CXL is rapidly working its way through the versions of the standard with the forthcoming 3.0 release being the one that I think will be the one that starts to see more widespread adoption by providers and even wider use cases. With storage class memory it first came onto the scene with Intel’s Optane memory products which were then quickly killed in spin out to what was eventually Solidigm but possibly because it was an idea that was too expensive and too soon. That said with the [just announced DL7-P5810](https://www.youtube.com/watch?v=1wPf1AZNnEU) from the aforementioned Solidigm it appears they are ready to try again.

What was interesting to me was to hear all the talk about CXL, and memory/flash tiered systems such as the [Software Enabled Flash](https://storagedeveloper.org/events/agenda/session/564) standard being proposed is they are both new approaches to old conversations we’ve been having in the virtualization space for years. CXL is being born from the idea that there as always there is usually a need for more RAM capacity than processing power and it’s essentially creating a software defined memory scale out capability. Sound familiar?

Conversely Software Enabled Flash and any of the other concepts that will allow for tiering Storage Class Memory or even the various classes of SSD is very much so the same considerations as what those of us buy CS series Nimble arrays last decade were taking.

In the end a lot of the software defined conversations present in the modern storage space are the same ones we’ve been having for the past 10-15 years, we just now want to do things much, much faster.

## Conclusion

In the end the technologies around the storage industry continue to evolve, giving us the ability to read and write data in unfathomable quanities while continuing to make it faster and smaller. But while the technology to create storage changes, the ways we consume it, the ways we present it, the ways we leverage its capabilities seems very cyclical to me. In the end I’m very curious to see where we go from here.

In the next post I will look at how companies such as Solidigm are pushing the traditional hard disk further into the recycling bin of history.