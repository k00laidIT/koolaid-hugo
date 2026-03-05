+++
title = "Configuring Networking for Nimble-vSphere iSCSI"
date = "2015-01-06T07:08:25Z"
draft = false
tags = [ "cisco", "nimble", "switching", "virtualization",]
categories = [ "Networking", "Systems", "Virtualization",]
featureimage = "featured.jpg"
+++


One of my last tasks for 2014 was integrating a new [Nimble Storage array](http://www.nimblestorage.com/products/specifications.php "Nimble Product Specs") into our environment. As this is the first of these I've encountered and I haven't been able to take the free one day [Nimble Installation and Operation Professional (NIOP)](http://www.nimblestorage.com/resources/nimble-university.php "Nimble University") course they provide I was left to feeling my way through it with great help from their documentation and only ended up calling support to resolve a bug related to upgrading from 2.14 of the Nimble OS. On the network side our datacenter is powered by Cisco Nexus 3000 series switches, also a new addition for us recently. These allowed us to use our existing Cat6 copper infrastructure while increasing our bandwidth to 10 GbE. In this post I'm going to document some of the setup required to meet the best practices outlined in Nimble's [Networking Best Practices Guide](http://www.nimblestorage.com/docs/downloads/bpg_nimble_storage_networking.pdf "Nimble Storage vSphere Network Best Practices") when setting up your system with redundant NX-OS switches.

<div class="baltazar-read-more">[Continue reading](/configuring-networking-nimble-vsphere-iscsi/)</div>