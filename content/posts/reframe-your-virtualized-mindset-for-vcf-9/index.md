+++
title = "Reframe Your Virtualized Mindset for VCF 9"
date = "2026-05-26T00:00:00-05:00"
draft = false
tags = ["VMware", "VCF", "Broadcom", "cloud native", "virtualization", "NSX", "vSAN"]
categories = ["Virtualization", "Cloud", "11:11 Systems"]
featureimage = "featured.png"
description = "VCF 9 isn't just another VMware release — it's a platform reboot. Here's what cloud native really means, and how VCF 9 fits the model."
+++

As I write this we are now almost 2.5 years post acquisition of VMware by Broadcom. In that time many things have changed. The partner program has shrunk and shrunk again. The portfolio has got smaller as non-core product lines such as VDI (now Omnissa) and Carbon Black have been divested. But in the face of these changes nothing has been as impactful as the wrapping of all the remaining capabilities into evolved [VMware Cloud Foundation (VCF) 9](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0.html) platform.

Even though [VCF](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/overview-of-vmware-cloud-foundation-9/what-is-vmware-cloud-foundation-and-vmware-vsphere-foundation.html) is itself not new, the pre-acquisition model had reached version 5.2 prior to its re-imagining, the fact that you could not piecemeal the components such as vCenter, Aria, and NSX is completely a post-acquisition construct. Further, coming in version 9.1, the idea of multi-tenancy previously made possible through Cloud Director will now be natively intertwined through [VCF Automation](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/overview-of-vmware-cloud-foundation-9/what-is-vmware-cloud-foundation-and-vmware-vsphere-foundation/vcf-automation-overview.html), leading to a (mostly) single deployment model that scales from a 5 host SMB through the largest of cloud service providers.

To understand why this shift has happened you have to understand the vision Broadcom has for the VMware portion of the company. Rather than be satisfied with being a virtualization platform you can run on-premises coupled with one that Service Providers can also access to build quasi-cloud like, virtualization only capabilities, the VCF vision is to create a hybrid cloud platform to rival the hyperscaler, cloud-native platforms such as AWS and Microsoft Azure to meet the modern world's needs for compute, storage and applications.

In this post let's take a bit of a look at what it means to be truly cloud native, then at how VCF positions Broadcom to fit that model, and finally what comes next for the platform.

## The Building Blocks of Cloud Native

I know, I know, cloud native is just another one of those terms you've mentally put into the dustbin of marketing hype. In previous years iterations I've seen it as shorthand for everything from "running in hyperscaler cloud using one or more named capabilities" to "refactor applications to be completely container-based microservices." In a more modern use we can think of cloud native as infrastructure that supports the following characteristics:

- **Loosely Coupled** - allows all of its services to be as tightly integrated or separated as needed for the application
- **Varied Infrastructure** - This isn't VMware vs Hyper-V, but instead think of it as VM, container, all the way to serverless applications
- **Zero Trust** - by default virtually every VM or service you deploy in the cloud has no capability to talk to any other VM or service let alone outside of the local subnet. In olden times we referred to this as microsegmentation.
- **Highly Available** - the infrastructure of all services is natively resilient to failure or maintenance windows without downtime.
- **Central Management, Distributed Deployment** - the ability to deploy workloads to various locations, including on-premises, while managing them with centralized UI, both graphical and programmatic. For the sake of brevity I'll include central IAM (users, groups, policies) here as well.

## How VCF Fits Into Cloud Native

So what exactly does VMware Cloud Foundation look like in this latest release? Let's revisit our list:

**Loosely Coupled** - While all of the above services are tightly intertwined, what they do is create a platform upon which individual workloads, applications, services, and tenants can all be deployed in a loosely coupled manner with zero trust principles. For example, at a top level you might have a [VCF Fleet](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0.html), equivalent to a cloud provider's region. That is then broken down to multiple VCF instances that would align to a cloud provider's availability zones within a region. Within that instance might be multiple vSphere clusters (vCenter plus hosts) to allow for relatively infinite scale out of available resources. Finally within or across those constructs would be tenants created in the form of projects, namespaces, and VPCs.

**Varied Infrastructure** - While modern vSphere has been flexible and capable of supporting containers through first VMware Integrated Containers (VIC) and then [Tanzu](https://techdocs.broadcom.com/us/en/vmware-tanzu.html), VCF 9 makes this capability less a bolt-on and more a side-by-side first-class citizen right beside Virtual Machines. Further, through the use of [VSAN Storage Clusters](https://www.vmware.com/docs/vmw-vsan-storage-clusters-design-and-operations), VCF has the capability to deliver storage-only services as well — providing things like NFS and Object Storage services for tenants.

**Zero Trust** - As opposed to traditional vSphere where NSX capabilities were available but not required, the whole of VCF 9 is built upon NSX's distributed routing and switching capabilities. This allows for highly scalable networks to be provided on top of loosely coupled interconnects to the physical network that, when used with the vDefend capability, can provide vNIC level security profiles for any deployed VM or container. This is further enabled through created VPCs to establish tenant or project level walled gardens and subnets so workloads cannot bleed over.

**Highly Available** - While vSphere has always had high availability as a cornerstone capability, VCF has largely gone to a "Hyperconverged Infrastructure (HCI) First" model through things like its [NSX](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0.html#nsx) reliance and [vSAN ESA](https://www.vmware.com/docs/vmw-vsan-storage-clusters-design-and-operations). What this means in terms of HA is that their reference architectures are designed for an even wider distribution of workloads that are managed at more the rack level rather than the server level, resulting in a more robust system design than we've seen before.

**Central Management, Distributed Deployment** - In its most basic deployment model VCF utilizes a hardened management domain (think vSphere cluster) with all of the management components for the entire fleet. These services include the [VCF Identity Broker](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/deployment/deploying-a-new-vmware-cloud-foundation-or-vmware-vsphere-foundation-private-cloud-/manual-deployment-of-components-to-complete-your-vcf-platform/installing-vcf-identity-broker.html) which centralizes your authentication and IdP integrations across the entire fleet, [VCF Operations](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/overview-of-vmware-cloud-foundation-9/what-is-vmware-cloud-foundation-and-vmware-vsphere-foundation/vcf-operations-overview.html) which centralizes deployment of scale-out infrastructure and monitoring, and VCF Automation which centralizes multi-tenancy management, UI, and core automation tasks and capabilities. From this management domain the entire solution can scale from an integrated workload domain to workload domains providing resources at a global level if desired, with as many or as few services available in each cluster.

## Conclusion

In the end, becoming more "cloudy" as a vSphere admin isn't about abandoning what you know, it's about consuming it differently. VCF 9 gives you the cloud-native building blocks: loosely coupled services, varied infrastructure, zero trust networking, high availability, and centralized management with distributed deployment. 

