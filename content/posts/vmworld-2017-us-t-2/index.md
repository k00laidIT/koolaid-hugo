+++
title = "VMworld 2017 US: T -2"
date = "2017-08-27T15:40:54Z"
draft = false
tags = [ "community", "conferences", "veeam", "virtualization", "vmware", "VMworld", "vSphere",]
categories = [ "Education", "Virtualization",]
featureimage = "featured.jpg"
+++


I write this while traveling to sunny and amazingly hot Las Vegas for the 2017 edition of VMworld US. I hope to provide feedback and news throughout the conference, highlighting not only the excellent content and programs but also the best the virtualization community has to offer.

Today will be a travel day as well as a day to meet up with friends, new and old. Tomorrow, the Sunday before the conference, is when the real fun begins with things like [Opening Acts](https://blog.vmunderground.com/opening-acts/) for me, TAM and partner content for others as well as a number of social events.

### What We Know So Far

Yesterday was the day that Vmware went on a killing spree, announcing the depreciation of [Windows based vCenter](https://blogs.vmware.com/vsphere/2017/08/farewell-vcenter-server-windows.html), the [flash based vSphere web client](https://blogs.vmware.com/vsphere/2017/08/goodbye-vsphere-web-client.html) and the [vmkLinux APIs and its associated driver ecosystem](https://blogs.vmware.com/vsphere/2017/08/vmware-plans-deprecate-vmklinux-apis-associated-driver-ecosystem.html). All of these enter the depreciated state with the next major version of vSphere and then will be gone for ever and ever in the revision after that. Each of these are significant steps towards the evolution of vSphere as we know it, and when coupled with the advances in PowerCLI in version 6.5 the management of our in house infrastructure has been changed for the better.

These announcements came rapid fire on the Friday before Vmworld with the death of the Windows based vCenter coming first. As we have had versions of varying success of the vCenter Server Appliances (VCSA) for over 5 years now it's been a long time coming. I myself migrated two years ago and while it was good then with the latest 6.5 version, with its PhotonOS base, excellent migration wizard and in appliance vCenter Update Manager support it has show it is definitely the way forward.

The flash client was the next announcement to come and again, we are looking at an depreciation that needs to happen and is most definitely going to be a good thing but does come with some apprehension. With most things that have been depreciated by Vmware we've had at least 1 feature rich version of the replacement out and stable before they announced the predecessor's demise. This isn't the case with the flash based web client. While the latest builds are getting very, very good there are still major things that either are quirky or simply aren't there yet. The good news to this is we have been given almost immediately assurances by everyone involved with the product management that we the vSphere admins will never be left without a GUI management ability for any given task we have today and I for one believe them. The last components of what is known as the HTML5 client in my opinion simply can't come enough, I'm tired of having to hop through multiple GUIs and browsers to be able to perform basic tasks in my daily work life.

Finally the day was finished with the announced depreciation of the non-native Linux drivers. To be honest I didn't know that these were even still a thing as every Linux VM I've rolled for the past many years have been able to work with the native drivers. I'm sure there are those that at this point may still need additional time but the as the removal is still a couple of versions off this should be something can be mitigated now that the end is known.

### Conclusion

With all of these preconference announcements related to Vmware's flagship product is this going to be the year where Vmworld is chocked full of improvements to vSphere. This will be my 3rd one in 4 years and each year I've felt their focus was elsewhere. While vSAN, NSX, and the like are definitely where the company's seeing growth all of these things rely on vSphere as an underlay. I for one would be happy to see a little love shown here.

With that happy thought I'm going to shut it down and land. For those coming to Vmworld this weekend safe travels and for those at home look for more info as its known here on koolaid.info.