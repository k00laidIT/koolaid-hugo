+++
title = "Commvault Shift: Backups are InfoSec and InfoSec is Backups"
date = "2023-11-20T10:58:06Z"
draft = false
tags = [ "backup", "commvault", "commvaultshift", "event", "gestalt", "security",]
categories = [ "Community", "Service Provider", "TechFieldDay",]
featureimage = "featured.png"
+++


In twenty plus years in the Information Technology field Information Security has always been a function of the job, albeit one with differing levels. Since the beginning of the pandemic the need for security capabilities to be overlaid on all facets of cloud infrastructure has become an absolute one, mostly driven by the big business that modern ransomware has evolved into.

The Backup and Disaster Recovery segments of that industry are no exception. That task once delegated to the junior sysadmin has now become a major tool in providing a layered defense of our organizations' data and resources. As mentioned in [my last post](https://www.koolaid.info/veeam-100-summit-2023/), Veeam's upcoming release is very security focused, providing new ways to look at data to help identify and recover from attacks while beefing up their capability to protect backups from attacks against them.

## Commvault Shift

They are not unique in that modern approach. I recently was invited to attend [Commvault’s Shift](https://discover.commvault.com/event-shift-launch-on-demand-thank-you.html) event in New York and the story they were wanting to tell was one of cyber resilience, where backup capabilities are a cornerstone of not only providing a trusted path towards restoration of services after an attack but in actually preventing the execution of the attack in the first place. These attacks are evolving in their opinion with the rise of artificial intelligence that we’ve seen in the past few years, telling of a future where attacks are performed by AI themselves and capable of mutating as needed to stay ahead of protections.

To this point the event largely was trying to create a new buzzword concept, Shift Right. For years we’ve heard about Shift Left, the idea that we need to build security practices and concepts into development and even product ideation so that when a software product gets released and into lifecycle it begins on a better footing for vulnerability management and code security. Shift Right is the idea that we now need to build security practices and concepts into backup and recovery capabilities to ensure that that backup data is well protected, that recovery takes security threats into account and that the backup platform itself is active in the defense of production systems.

In line with what I mentioned above the concept of layering security into backup, replication and recovery products is not unique, just about everybody in the space is doing it, but the terminology is unique and it remains to be seen if it actually takes off in the way things like 3-2-1 have to define how we in the BCDR space message our capabilities.

## Commvault Cloud

This is an interesting take and response, building on their cloud based SaaS capabilities called [Metallic](https://www.commvault.com/platform/metallic-ai) and allowing for it to be a large scale metadata monitoring platform for both their BaaS capabilities as well as tie in their on-premises installations. Once that metadata is available in the [Commvault Cloud](https://www.commvault.com/platform) platform they say that they can use that data, from backups, from [honeypots](https://www.commvault.com/platform/threatwise), from [monitoring production systems](https://www.commvault.com/platform/threat-scan) themselves, to then allow their AI to hunt threat actor AI.

![Commvault Cloud licensing tier comparison chart showing three packages: Foundational Protection, Autonomous Recovery, and Cyber Resilience, with features like immutable storage, threat scanning, AI-driven threat detection, and cyber deception checked across tiers](commvault-cloud-licensing.png)

One other thing that comes from the announcement and the overreaching, platform driven approach to their product set is that they are billing it as an “all SaaS” solution, with a new set of SKUs and licensing model that replaces all the others. I’ll be honest, I’m dubious about the current trend of backup vendors that have historically been channel driven with a robust set of service providers iterating on their solutions putting themselves into a position where they “own” the interface to their products and limiting the licensing model. While simplification of the licensing has been a long time coming for Commvault I will wait and see what that does to their more integrated partners to create solutions using their products.

## Conclusion

The announcement of Commvault Cloud at their Shift event on November 9, 2023 introduces some interesting capabilities from a security point of view. Further it gives them a new marketing pitch to work with in the new era of “Cyber Resilience.” Finally they have taken the opportunity to change how they go to market with their products with a new all SaaS model of licensing and delivery. It will be interesting to watch how the company takes that combination of things and if it makes a dent in the very real threats against production data today.