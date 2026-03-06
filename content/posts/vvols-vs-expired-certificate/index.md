+++
title = "VVOLs vs. the Expired Certificate"
date = "2018-01-12T15:54:47Z"
draft = false
tags = [ "certificates", "nimble", "vmware", "vvols",]
categories = [ "Security", "Systems", "Virtualization",]
featureimage = "featured.png"
+++


Hi all, I'm writing this to document a fix to an interesting challenge that has pretty much been my life for the last 24 hours or so. Through a comedy of errors and other things happening, we had a situation where the upstream CA from our VMware Certificate Authority (and other things) became very unavailable and the certificate authorizing it to manage certificates expired. Over the course of the last couple of days I've had to reissue certificates for just about everything including my Nimble Storage array and as far as vSphere goes we've had to revert all the certificate infrastructure to essentially the same as the out of the box self-signed guys and then reconfigure the VMCA as a subordinate again under the Root CA. Even after all that I continued to have an issue where my Production VVOLs storage was inaccessible to the hosts. That's not to say they weren't working, amazingly and as a testament to the design of how VVOLs works my VMs on it ran throughout the process, but I was very limited in terms of the management of those VMs. Snapshots didn't work, backups didn't work, for a time even host migrations didn't work until we reverted to the self-signed certs. Thanks for a great deal of support and help from both VMware support and Nimble Storage Support we were finally able to come up with a runbook in dealing with a VVOL situation where major certificate changes occurred on the vSphere side. There is an assumption to this process that by the time you've got here all of your certificates both throughout vSphere as well as with the Nimble arrays are good and valid.

1. **Unregister the VASA provider and Web Client integration from the Nimble array.** This can be done either through the GUI in Administration&gt;VMware Integration by editing your vCenter, unchecking the boxes for the Web Client and VASA Provider and hitting save. This can also be done via the CLI using the command ```
    vcenter --unregister <vcenter_name> --extension vasa
    vcenter --unregister <vcenter_name> --extension web
    ```
2. **Register the integrations back in.** Again, from the GUI simply just check the boxes back and hit save. If successful you should see a couple of little green bars briefly appear at the top of the screen saying the process was successful. From the CLI the commands are pretty similar ```
    vcenter --register <vcenter_name> --extension vasa
    vcenter --register <vcenter_name> --extension web
    ```
3. **[

{{< figure src="vasa-provider.png" alt="" >}}

](vasa-provider.png)Verify that your VASA provider is available in vCenter and online.** This is just to make sure that the integration was successful. In either the Web Client or the HTML5 client go to vCenter&gt; Configure&gt; Storage Provider and look for the entry that matches the name of your array group and in the URL has the IP address of your array's management interface. This should show as online. As you have been messing with certificates its probably worth looking at the Certificate Info tab as well while you are here to verify that the certificate is what you expect.
4. **Refresh the CA Certificates on each your hosts.** Next, we need to ensure that all of the CA certificates are available on the hosts to ensure they can verify the certificates presented to them by the storage array. To do this you can either right-click each host &gt; Certificates &gt; Refresh CA Certificates or if you navigate to the configuration tab of each host, go to Certificate there is a button there as well. While in the window it is worth looking at the Status of each host's certificate and ensure that it is Good. [

{{< figure src="cert_status.png" alt="" >}}

](cert_status.png)
5. **Restart the** **vvold service on each host.** This final step was evidently the hardest one to nail down and find in the documentation. The simplest method may be to simply reboot each of your hosts as long as you can put them into maintenance mode and evacuate them first. The quicker way and the way that will let you keep things running is to enter a shell session on each of your hosts and simply run the following command: ```
    /etc/init.d/vvold restart
    ```
    
     Once done you should see a response like the feature image on this post and a short while later your VVOLs array will again become available for each host as you work on them.
 
 That's about it. I really cannot thank the engineers at [VMware](https://twitter.com/vmwarecares?lang=en) (Sujish) and [Nimble](https://twitter.com/nimblestorage?lang=en) (Peter) enough for their assistance in getting me back to good. Also I'd like to thank Pete Flecha for jumping in at the end, helping me and reminding me to blog this. If nothing else I hope this serves as a reminder to you (as well as myself) that certificates should be well tended to, please watch them carefully. ;)