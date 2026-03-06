+++
title = "CFD12: MemVerge Launches Big Memory Cloud"
date = "2021-11-23T08:33:01Z"
draft = false
tags = [ "cloud field day", "MemVerge", "multi-cloud", "ted h field day", "virtualization",]
categories = [ "Tech Field Day", "Virtualization",]
featureimage = "featured.jpg"
+++


I recently attended [Cloud Field Day 12](https://techfieldday.com/event/cfd12/) put on by [Gesalt IT](https://gestaltit.com). While there were many great presentations and some really exciting technology discussed I’d like to highlight what I considered the highlight of the week, the [Big Memory Cloud](https://bigmemorycloud.com) announcement by [MemVerge](https://memverge.com).

MemVerge has some very big ideas around taking the “software defined” concept to memory, allowing advanced optimizations and flexibility of instance memory usage. In the past the company has launched Memory Machine products related to making the most of Intel Optane memory capabilities, but the new Big Memory Cloud product set is built all around allowing you to move stateful applications between clouds and instances.

The example given is around the idea of spot public cloud instances. For those unfamiliar with the concept the idea is to use excess capacity in a given region during non-peak times, allowing the provider to sell those instances for a much lower cost but subject to needing instances to be torn down quickly as capacity is needed. For that reason spot instances work great for stateless workloads where they can easily be torn down in one place and started in another without issue, but it doesn’t work well for stateful applications or more to MemVerge’s point big, CPU and memory intensive work loads like AI, graphics rendering, research that may need to run for days or weeks to complete a single process. MemVerge Big Memory Cloud is designed to solve that problem by allowing you to capture the running state of an application at any time, taking a snapshot, and then transferred to another running instance seamlessly.

{{< figure src="img_0333.jpg" alt="MemVerge Big Memory Cloud diagram showing a stateful workload and Memory Machine Cloud Edition running on a compute instance, with ZeroIO in-memory snapshots capturing the workload into a Memory Capsule that can be loaded, replicated, recovered, and transported across clouds" >}}

The technical concept of this is around what they call an AppCapsule. An AppCapsule is essentially a snapshot of the DRAM memory of one instance that can then be applied via the software to another instance of the same workload elsewhere. I think the concept has dreams of being a “multi-cloud vMotion” where a workload is running in cloud A and then is “moved” to cloud B. Today it is more along the lines of “multi-cloud Fault Tolerance” where you have to have 2 running copies of the workload, 1 in each cloud and the active version of the workload is moved from one to another (or even to a third instance).

While you can see that this is currently very young it is still very very cool. At the moment the [supported workloads](https://memverge.com/compatibility-guide/) for the underlying Memory Machine technology are pretty limited, mostly related to databases and caching systems but with this new announcement I look for that to grow. I can see this as a big winner for the IaaS and BCDR services industry, allowing for hard to move workloads to now be on the table. Of course those are down the road type things that might come through partnerships but exciting all the same.