+++
title = "Reboot-VSS Script for Veeam Backup Job Pre-Thaw Processing"
date = "2018-11-01T09:50:28Z"
draft = false
tags = [ "scripting", "veeam", "vss",]
categories = [ "Systems", "Virtualization",]
featureimage = "featured.jpg"
+++


One of the issues that Veeam Backup &amp; Replication users, actually those of any application aware backup solution, is that the various VSS writers are typically very finicky to say the least. Often you will get warnings about the services only to do a "vssadmin list writers" and see either writers in a failed state or not there at all. In most of these cases a reboot of either the service or the target system itself is an easy quick fix. But do you really want to rely on yourself to remember to do this every day? I know I don't and going with the mantra of "When in doubt, automate" here's a script that will help out. The [Reboot-VSS.ps1](https://github.com/k00laidIT/Veeam/blob/master/Restart-VSS.ps1) script assumes that you are using vSphere tags to dynamically identify VMs to be included in backup jobs, looks at the services in the given services array and if they are present on the VM will restart them.

```
#   Name:   Restart-VSS.ps1
#   Description: Restarts list of services in an array on VMs with a given vSphere tag. Helpful for Veeam B&R processing
#   For more info on Veeam VSS services that may cause failure see https://www.veeam.com/kb2041

Import-Module VMware.PowerCLI

$vcenter = "vcenter.domain.com"
$services = @("SQLWriter","VSS")
$tag = "myAwesomeTag"
Connect-VIServer $vcenter
$vms = Get-VM |where {$_.Tag -ne $tag}

ForEach ($vm in $vms){
  ForEach ($service in $services){
    If (Get-Service -ComputerName $vm -Name $service -ErrorAction SilentlyContinue) {
      Write-Host $service "on computer" $vm "restarting now."
      Restart-Service -InputObject $(Get-Service -Computer $vm -Name $service);
    }
  }
}
```
 This script was designed to be set in the Windows scripts section of guest processing settings within a Veeam Backup and Replication job. I typically only need the SQL writer service myself but I've included VSS in the array as well here as an example of adding more than one. There are quite a few VSS services that VSS aware backup services can access, [Veeam's KB 20141](https://www.veeam.com/kb2041) is a great reference for all of these that can be included here based on your need.