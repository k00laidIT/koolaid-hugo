+++
title = "Installing .Net 3.5 on Server 2012/ Windows 8 and above"
date = "2016-11-10T10:06:05Z"
draft = false
tags = [ "how to", "troubleshooting", "vDM30in30", "Windows",]
categories = [ "Systems",]
featureimage = "featured.jpg"
+++


Hi all, just a quick post to serve as both a reminder to me and hopefully something helpful for you. For some reason Microsoft has decided to make installing .Net 3.5 on anything after Windows Server 2012 (or Windows 8 on the client side) harder than it has to be. While it is included in the regular Windows Features GUI it is not included in the on-disk sources for features to be installed automatically. In a perfect world you just choose to source from Windows Update and go about your day, but in my experience this is a hit or miss solution as many times for whatever reason it errors out when attempting to access. The fix is to install via the Deployment Image Servicing and Management tool better known as DISM and provide a local source for the file. .Net 3.5 is included in every modern Windows CD/ISO under the sources\\sxs directory. When I do this installation I typically use the following command set from an elevated privilege command line or PowerShell window:

```
dism /online /enable-feature /featurename:NetFX3 /all /Source:<WIN10DISKLETTER>:\sources\sxs /LimitAccess
```
 [

{{< figure src="Installed.jpg" alt="installed" >}}

](Installed.jpg)When done the window should look like the window to the left. Pretty simple, right? While this is all you really need to know to get it installed let's go over what all these parameters are that you just fed into your computer. - **/online** - This refers to the idea that you are changing the installed OS as opposed to an image
- **/enable-feature** - the is the CLI equivalent of choosing Add Roles and Features from Server Manager
- **/featurename** - this is where we are specifying which role or feature we want to install. This can be used for any Windows feature
- **/all** - here we are saying we not only want the base component but all components underneath it
- **/Source:d:\\sources\\sxs** - This is specifying where you want DISM to look for media to install for. You could also copy this to a network share, map a drive and use it as the source.
- **/Limit Access** - This simply tells DISM not to query Windows Update as a source
 
 While DISM is available both in the command line as well as PowerShell there is a PS specific command that works here as well that is maybe a little easier to read, but I tend to use DISM just because it's what I'm used to. To do the same in PowerShell you would use: ```
Add-WindowsFeature NET-Framework-Core -Source d:\sources\sxs
```