+++
title = "VMware Tools Security Bug and Finding which VMware Tools components are installed on all VMs"
date = "2016-08-05T10:43:29Z"
draft = false
tags = [ "how to", "scripting", "vSphere", "vsphere 6",]
categories = [ "Security", "Systems", "Virtualization",]
+++


Just a quick post related to today's VMware security advisories. VMware released a pair of advisories today, [CVE-2016-5330 and CVE-2016-5331](http://www.vmware.com/security/advisories/VMSA-2016-0010.html) and while both are nasty their scopes are somewhat limited. The 5331 issue is only applicable if you are running vCenter or ESXi 6.0 or 6.0U1, Update 2 patches the bug. The 5330 is limited to Windows VMs, running VMware Tools, and have the option HGFS component installed. To find out if you are vulnerable here's a Power-CLI script to get all your VMs and list the installed components. Props to [Jason Shiplett](https://twitter.com/jshiplett) for giving me some assistance on the code.

```
$vms = Get-VM | where {$_.PowerState -eq "PoweredOn" -and $_.GuestId -match "Windows"}
 
ForEach ($vm in $vms){
	Write-Host $vm
	$namespace = "root\CIMV2"
	$componentPattern = "hcmon|vmci|vmdebug|vmhgfs|VMMEMCTL|vmmouse|vmrawdsk|vmxnet|vmx_svga"
	(Get-WmiObject -class Win32_SystemDriver -computername $vm -namespace $namespace |
		where-object { $_.Name -match $componentPattern } |
		Format-Table -Auto Name,State,StartMode,DisplayName
	)
}
```
 While the output is still a little rough it will get you there. Alternatively if you are just using this script for the advisory listed you can change <span class="lang:ps decode:true crayon-inline">where-object { $\_.Name -match $componentPattern }</span> to <span class="lang:ps decode:true crayon-inline ">where-object { $\_.Name -match "vmhgfs" }</span> . This script is also available on [GitHub.](https://github.com/k00laidIT/Learning-PS/blob/master/Get-VMwareToolsParts.ps1)