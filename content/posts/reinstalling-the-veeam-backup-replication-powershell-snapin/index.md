+++
title = "Reinstalling the Veeam Backup &#038; Replication Powershell SnapIn"
date = "2018-06-05T12:47:21Z"
draft = false
tags = [ "powershell", "troubleshooting", "veeam",]
categories = [ "Systems",]
featureimage = "featured.png"
+++


As somebody who lives by the old mantra of "Eat your own dog food" when it comes to the laptops I use both personally and professionally I tend to be on the early edge of installs. So while I am not at all ready to start deploying Windows 10 1803 to the end users I've recently upgraded my Surface Pro to it. In doing so I've found that doing so broke access to the [Veeam Powershell SnapIn](https://helpcenter.veeam.com/docs/backup/powershell/getting_started.html?ver=95) on my laptop when trying to run a script. After some Googling I found a [very helpful post on the Veeam Forums](https://forums.veeam.com/powershell-f26/veeampssnapin-not-found-t26632.html) that I thought I'd condense the commands to run here for us all. Let me start with a hat tip to James McGuire for finding this solution to the problem. For the those that aren't familiar with VBR's Powershell capabilities, the SnapIn is installed either when you run the full installer on your VBR server or, as is my case when you install the Remote Console component on another Windows system. Don't let me get started about the fact that Veeam is still using a SnapIn to provide PowerShell access, that's a whole different post, but this is where we are. The sign that this has occurred is when you get the "Get-PSSnapin : No Windows PowerShell snap-ins matching the pattern 'VeeamPSSnapin' were found." error when trying to get access to the SnapIn. In order to fix this, you need to use the installutil.exe utility in your latest .Net installation. So in my example, this would be C:\\windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.ex e. If you've already installed the VBR Remote console The SnapIn's DLL should be at C:\\Program Files\\Veeam\\Backup and Replication\\Console\\Veeam.Backup.PowerShell.dll. So to get the installation fixed and re-added to being available to Powershell you just need to do the following from an elevated PoSH prompt:

```
C:\windows\Microsoft.NET\Framework64\v4.0.30319\InstallUtil.exe C:\Program Files\Veeam\Backup and Replication\Console\Veeam.Backup.PowerShell.dll
Add-PSSnapin VeeamPSSnapin
```
 [

{{< figure src="VBRsnapin-afterinstall-150x150.png" alt="" >}}

](VBRsnapin-afterinstall.png)Then to load it and be able to use it simply ```
Get-PSSnapin VeeamPSSnapin
Connect-VBRServer -Server <serverFQDN>
```
 From there it's up to you what comes next. Happy Scripting!