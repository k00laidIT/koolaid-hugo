+++
title = "From Zero to PowerCLI: CentOS Edition"
date = "2018-02-28T13:28:07Z"
draft = false
tags = [ "powershell", "scripting", "vmware", "vSphere",]
categories = [ "Automation", "Systems", "Virtualization",]
featureimage = "featured.png"
+++


Hi all, just a quicky to get everybody off the ground out there that are looking to use both PowerShell and PowerCLI from things that don't run Windows. Today VMware released [version 10 of PowerCLI](https://blogs.vmware.com/PowerCLI/2018/02/powercli-10.html) with support for installation on both Linux and MacOS. This was made possible by the also recently released [Powershell Core 6.0](https://blogs.msdn.microsoft.com/powershell/2018/01/10/powershell-core-6-0-generally-available-ga-and-supported/) which allows PowerShell to be installed on \*nix variants. While the ability to run it on a Mac really doesn't do anything for me I do like to use my iPad with a keyboard case as a quick and easy jump box and its frustrated me for a while that I needed to do an RDP session and then run a Powershell session from within that. With these releases I'm now an SSH session away from the vast majority of my scripting needs with normal sized text and everything. In this post I'll cover getting both Powershell Core and PowerCLI installed on a CentOS VM. To be honest, installing both on any other variant is pretty trivial but the basic framework of the difference [can be found in Microsoft Docs](https://docs.microsoft.com/en-us/powershell/scripting/setup/installing-powershell-core-on-macos-and-linux?view=powershell-6). 

**Step 1: Installing Powershell Core 6.0** First, you need to add the Powershell Core repository to your yum configuration. You may need to amend the "/7/" below if you are running a RHEL 6 variant like CentOS 6.

```shell
curl https://packages.microsoft.com/config/rhel/7/prod.repo | sudo tee /etc/yum.repos.d/microsoft.repo
```

 Once you have your repo added simply install from yum 
 ```shell
sudo yum install -y powershell
```

Congrats! You now have PowerShell on Linux. To run it simply run pwsh from the command line and do your thing. If you are like me and use unsigned scripts a good deal you may want to lower your Execution Policy on launch. You can do so by adding the parameter. 
```shell
pwsh -ep Unrestricted
```

{{< figure src="InvalidCertificate.png" alt="" >}}

**Step 2: Installing VMware PowerCLI** Yes, this is the hard part... Just kidding! It's just like on Windows, enter the simple one-liner to install all available modules. 
```PowerShell
Install-Module -Name VMware.PowerCLI -Scope CurrentUser
```

 If you want to check and see what you've installed afterward (as shown in the image) 
 ```PowerShell
Get-Module VMware.* -ListAvailable
```

 If you are like me and starting to burn this through in your lab you are going to have to tell it to ignore certificate warnings to be able to connect to your vCenter. This is simple as well just use this and you'll be off and running. 
 ```PowerShell
Set-PowerCLIConfiguration -InvalidCertificateAction Ignore
```

**Step 3: Profit!** Really, that's it. Now to be honest I still am going to need to jump to something Windows-based to do the normal ActiveDirectory, DNS or any other native Windows type module but that's pretty easy through Enter-PSSession. Finally, if you have got through all of the above and just want to cut and paste here's everything in one spot to get you installed. 
```shell
curl https://packages.microsoft.com/config/rhel/7/prod.repo | sudo tee /etc/yum.repos.d/microsoft.repo
sudo yum install -y powershell
pwsh -ep Unrestricted
Install-Module -Name VMware.PowerCLI -Scope CurrentUser
Set-PowerCLIConfiguration -InvalidCertificateAction Ignore
```
