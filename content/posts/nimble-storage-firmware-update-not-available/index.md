+++
title = "Why Is My Nimble Storage Firmware Update Not Available"
date = "2016-12-20T09:54:43Z"
draft = false
categories = [ "Systems",]
featureimage = "featured.png"
+++


Today, like everyday as a technology professional, I got the opportunity to learn something new. After seeing posts on social media and articles that Nimble Storage with their [NimbleOS version 3.6](https://infosight.nimblestorage.com/InfoSight/media/cms/active/pubs_NimbleOS_Release_Notes_ohp1476220347212.ditamap.pdf) supports the shiny new features of VMware's vSphere 6.5 release including VVOLs 2.0 and VASA 3.0. After reading through the release notes and not seeing anything to really stress me out in the known issues I went to begin the download for an update in the off hours. To my early adopter horror I saw there was no download available! Had I misread the releases, did I imagine that the release notes really were for 3.6? No, those were real and it should be there. After asking around I learned that Nimble in a notable effort to save us from ourselves will from time to time blacklist you from receiving updates due to things they observe through their excellent [InfoSight](https://infosight.nimblestorage.com) analytics system. The problem with this is they don't really make easily apparent that you are blacklisted from anywhere close to the download screen. In order to see if you are blacklisted you have to switch over from the array management screen to InfoSight, go to Manage &gt; Assets &gt; Click on the Array, and then at the top where it says "Version: ...." click on the version link. There finally you will either see the new version in black if you are good to upgrade or as shown in my image, in red if blacklisted. Even with this it still doesn't tell you why you are blacklisted, you have to call support to learn that. \[caption id="attachment\_583" align="aligncenter" width="300"\][

{{< figure src="Nimble-Software-Blacklist-300x85.jpg" alt="" >}}

](Nimble-Software-Blacklist.jpg) Blacklisted\[/caption\] \[caption id='attachment\_588' align='aligncenter' width='300'\][

{{< figure src="Nimble-Software-No-Blacklist-300x82.jpg" alt="" >}}

](Nimble-Software-No-Blacklist.jpg) Not Blacklisted\[/caption\] **Conclusion** The idea of blacklisting arrays that show signs of things known not to play well with future versions of software is a noble idea and has the potential to keep the load off of your support staff. The problem is the current way it is shown to the user almost ensures that a support call is going to have to be made anyway to either a) find out why the array is blacklisted (OMG, what's wrong with my array that it can't be upgraded!?!?) or b) find out why new software isn't available. I would recommend that if an array is blacklisted and an admin attempts to download software let him know that he is blacklisted, and why, there on the array's download software dialog. This would save everybody a good deal of time. As an addendum as I post this I see that 3.6.1 has been release as well and my time on the blacklist is over. Off to upgrade!