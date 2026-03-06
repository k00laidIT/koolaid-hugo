+++
title = "Fun with the vNIC Shuffle with Cisco UCS"
date = "2016-11-02T08:30:54Z"
draft = false
tags = [ "Cisco UCS", "vDM30in30", "virtualization", "vSphere",]
categories = [ "Networking", "Systems", "Uncategorized", "Veeam", "Virtualization",]
featureimage = "featured.jpg"
+++


Here at This Old Datacenter we've recently made the migration to using Cisco UCS for our production compute resources. UCS offers a great number of opportunity for system administrators, both in deployment as well as on going maintenance, making updating the physical as manageable as we virtualization admins are getting used to with the virtualized layer of the DC. Of course like any other deployment there is always going to be that one "oh yeah, that" moment. In my case after I had my servers up I realized I needed another virtual NIC, or vNIC in UCS world. This shouldn't be a big deal because a big part of what UCS does for you is it abstracts the hardware configuration away from the actual hardware. For those more familiar with standard server infrastructure, instead of having any number of physical NIC in the back of the host for specific uses (iSCSI, VM traffic, specialized networking, etc) you have a smaller number of connections as part of the Fabric Interconnect to the blade chassis that are logically split to provide networking to the individual blades. These Fabric Interconnects (FI) not only have multiple very high-speed connections (10 or 40 GbE) but each chassis typically will have multiple FI to provide redundancy throughout the design. All this being said, here's a very basic design utilizing a UCS Mini setup with Nexus 3000 switches and a copper connected storage array: [

{{< figure src="ucs-design.jpg" alt="ucs-design" >}}

](ucs-design.jpg) So are you starting to thing this is a UCS geeksplainer? No, no my good person, this is actually the story of a fairly annoying hiccup when it comes to the relationship between UCS and VMware's ESXi. You see while adding a vNIC should be as simple as create your vNICs in the Server Profile, reboot the effected blades and new NIC(s) are shown as available within ESXi, it of course is not that simple. What happens in reality when you add new NICs to an existing Physical NIC to vSwitch layout is that the relationships are shuffled. So for example if you started with a vNIC (shown as vmnicX in ESXi), vSwitch layout that looks like this to start with [

{{< figure src="1.before.png" alt="1-before" >}}

](1.before.png) After you add NICs and reboot it looks like this [

{{< figure src="2.after_.png" alt="2-after" >}}

](2.after_.png) Notice the vmnic to MAC address relationship in the 2. So while all the moving pieces are still there different physical devices map to different vSwitches than as designed. This really matters when you think about all the differences that usually exist in the VLAN design that underlay networking in an ESXi setup. In this example vSwitch0 handles management traffic, HQProd-vDS handles all the VM traffic (so just trunked VLANS) and vSwitch1 handles iSCSI traffic. Especially when things like iSCSI that require specialized networking setup are involved does this become a nightmare; frankly I couldn't imagine having to do this will a more complex design. **The Fix** So I'm sure you are sitting here like I was thinking 'I'll call support and they will have some magic that with either a)fix this, b) prevent it from happening in the future, or preferably c) both. Well, not so much. The answer from both VMware and Cisco support is to figure out which NICs should be assigned to which vSwitch by reviewing the MAC to vNIC assignment in UCS Manager as shown and then manually manage the vSwitch Uplink assignment for each host. [

{{< figure src="3.corrected.png" alt="3-corrected" >}}

](3.corrected.png) [

{{< figure src="4.correctedesx.png" alt="4-correctedesx" >}}

](4.correctedesx.png) As you may be thinking, yes this is a pain in the you know what. I only had to do this with 4 hosts, I don't want to think about what this looks like in a bigger environment. Further, as best I can get answers from either TAC or VMware support there is no way to make this go better in the future; this was not an issue with my UCS setup, this is just the way it is. I would love it if some of my "Automate All The Things!!!" crew could share a counterpoint to this on how to automate your way out of this but I haven't found it yet. Do you have a better idea? Feel free to share it in the comments or tweet me [@k00laidIT](https://twitter.com/k00laidIT).