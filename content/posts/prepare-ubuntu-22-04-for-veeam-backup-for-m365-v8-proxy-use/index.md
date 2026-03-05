+++
title = "Prepare Ubuntu 22.04 for Veeam Backup for M365 v8 Proxy Use"
date = "2024-12-05T19:42:49Z"
draft = false
tags = [ "how to", "linux proxy", "VB365", "veeam", "Veeam Vanguard",]
categories = [ "M365", "Veeam",]
featureimage = "featured.png"
+++


With the latest release of [Veeam's Backup for Microsoft365, version 8,](https://www.veeam.com/products/saas/backup-microsoft-office-365/latest-release.html) they have started to support both proxy pools and for those proxies to be able to run on Linux. This is important for a number of reasons, not the least of which is cost when it comes to a fully scaled out infrastructure for the product. In short when you have tens if not hundreds of proxies within an environment those Windows Server licenses can really rack up. Further there is a case to be made for the easy of automated deployment and management that is a hallmark of a distributed system.

That said Veeam has had to make some interesting choices when it comes to supporting this capability on Linux for now and those choices all revolve around the support for the .net v8 runtimes. While there are open packages for these they do not have feature parity to the now somewhat legacy version that are available via the [Microsoft repository.](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet9&pivots=os-linux-ubuntu-2204) Veeam states that they are supporting the installation of proxies on [RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) 8.6-9.2 and [Ubuntu](https://ubuntu.com/download/server) 20.04 and 22.04 LTS. On the Ubuntu side you'll notice that the most recent LTS release, 24.04, is not listed. This is due to Microsoft themselves discontinuing support for their own feed starting with that release. While I do expect this to be rectified between Microsoft and Veeam in the future if you are Ubuntu fan like me 22.04 LTS will be your best choice for now.

Through some trial and error I've established a bit of a playbook for implementing their upcoming best practices as it pertains to installing the .net runtimes and installing the required components. These best practices include:

- Use the Microsoft feed
- Do not mix packages from different feeds (aka, block access to the Linux feed)

## Installation

```bash
# Linux Proxy configuration
# Once a proxy is deployed it can be shutdown and templated for quicker onboarding

### Get OS version info which adds the $ID and $VERSION_ID variables
source /etc/os-release

### Download Microsoft signing key and repository
wget https://packages.microsoft.com/config/$ID/$VERSION_ID/packages-microsoft-prod.deb -O packages-microsoft-prod.deb

### Install Microsoft signing key and repository
sudo dpkg -i packages-microsoft-prod.deb

### Clean up
rm packages-microsoft-prod.deb

### Update packages
sudo apt update

### Block access to Ubuntu repository via upgrade (KB 4658)
sudo sed -i '/^Unattended-Upgrade::Package-Blacklist {/a\        "dotnet-";' /etc/apt/apt.conf.d/50unattended-upgrades

### Install the runtime
sudo apt-get install -y dotnet-runtime-8.0
```
Once you have your proxy built I recommend turning this into a template or AMI for future deployments.

## Adding Your Proxy and Joining to a Pool

Now that you have your prerequisites completed let's switch over the the Powershell console of your VB365 server and get it registered and then added to a Proxy Pool

```powershell
#Add Proxy to inventory
$hostname = "my-pxy.product.lab"
$lpasswd = Read-Host "Supply Linux Password" -AsSecureString
$lcreds = New-VBOLinuxCredential -Account "myuser" -ElevateAccountToRoot:$true -Password $lpasswd
$proxy = Add-VBOProxy -Hostname $hostname -Port 22 -LinuxCredential $lcreds -force

#Add Proxy to a Proxy Pool called "pool1"
$poolName = "pool1"
$pool = Get-VBOProxyPool -Name $poolName
Set-VBOProxyPool -proxy $proxy -pool $pool
```
## Conclusion

In my opinion both Proxy Pools and Linux Proxies will be incredibly impactful to large scale consumers of VB365 such as Enterprises and Service Providers. While it's a bit of a pain having to jump through the extra hoops for now to deploy them the good news is we should be able to think of proxy pools as fluid objects, where you can literally destroy half the proxies at a time, deploy new with new configuration (like when support for native Ubuntu feeds comes) and then do the other half without downtime. Because the jobs and repositories are now decoupled from the singular proxy this is a massive improvement for the lifecycle of these systems.