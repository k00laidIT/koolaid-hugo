+++
title = "Veeam v11: Automate Installation of Linux Transport Services"
date = "2021-09-24T08:34:57Z"
draft = false
tags = [ "linux", "powershell", "v11",]
categories = [ "Automation", "Veeam",]
featureimage = "featured.png"
+++


Veeam's Backup and Replication [version 11](https://www.veeam.com/whats-new-backup-replication.html) has brought a number of enhancements to it's support of Linux-based Infrastructure components as has been covered quite well In Anthony Spiteri's [posts](https://anthonyspiteri.net/v11-linux-immutability/) on the [subject](https://anthonyspiteri.net/v11-service-providers-linux-proxy/). In my mind and experience one of the biggest upgrades here that is flying well below the service is the addition of a legitimate Transport service for Linux repositories. While we are used to this type of setup for Windows servers in our VBR Infrastructure, where a service is installed on the repository and it handles the communication path between other components (proxies and cloud gateways) to the repository on Linux servers this has been handled by per-connection SSH tunnels. So for a heavily loaded repository in a Service Provider environment it was not uncommon to have hundreds if not thousands of concurrent SSH sessions between the cloud gateways and the repositories through which the veeamagent utility would actually be doing the work.

With v11 Veeam has finally brought Linux server support up to par with its own transport service, making scalability much better, but unfortunately this is not a standard upgrade task. While any new managed Linux servers will have the service installed by default any existing servers will show as "Up to Date" and but still be using SSH as it's transport method. The best way to discover if it is in fact installed is to leverage the `Get-VBRPhysicalHost` cmdlet and if the components parameter is empty then it hasn't been installed. For example to narrow it down I use the following to discover per VBR server:

```powershell
Get-VBRPhysicalHost | Where-Object {($_.OsType -eq "Linux") -and ($_.Components.Name -notcontains "Transport")}
```
<figure class="wp-block-image size-full">[

{{< figure src="image-2.png" alt="" >}}

](image-2.png)<figcaption class="wp-element-caption">1 set without install, 1 set after installation of transport services</figcaption></figure>## Installing the Linux Transport Service

Now that you've discovered where you still need to do this the pointy-clicky method to get the service installed is pretty straight forward:

1. Right click on each server needed under Managed Servers in Backup Infrastructure
2. Choose Properties to launch the Server Settings Wizard
3. Click Next, Next...Finish until it completes.

While this is great and all when you are in a large scale environment nobody wants to do that process tens or hundreds of times over and over again. For this let's look at a way to automate the installation at scale using powershell.

Using our existing list created above we can then feed that through `set-vbrLinux -server $server.name -force` to make the transport service actually install. Depending on how many you are doing at once this may take a bit to complete as they are done asynchronous but still better than wearing out your mouse clicking finger. The full script to use is

```powershell
$servers = Get-VBRServer -Type Linux
foreach ($server in $servers){
    # Only update Managed Server if Transport service is not installed
<code>    if (Get-VBRPhysicalHost | Where-Object {($_.Name -eq $server.Name) -and ($_.OsType -eq "Linux") -and ($_.Components.Name -notcontains "Transport")}){
        $server | Set-VBRLinux -Force
    }    
}</code>
```
Much thanks to [Chris Arceneaux](https://twitter.com/chris_arceneaux) for the assist on getting the script working. You can find his blog at [arsano.ninja](https://www.arsano.ninja).