+++
title = "Cisco Voice Servers Version 11.5 Could Not Load modules.dep"
date = "2017-06-13T10:20:14Z"
draft = false
tags = [ "cisco", "how to", "telephony", "troubleshooting",]
categories = [ "Voice",]
featureimage = "featured.png"
+++


About 6 months ago we updated 3/4 of our Cisco Telephony environment from 8.5 to 11.5. The only reason we didn't do it all is because UCCX 11.5 wasn't out yet so it went to 11. While there were a few bumps in the road; resizing VMs, some COP files, etc. the update went well. Unfortunately once it was done we starting having a glorious issue where after a reboot the servers sometimes failed to boot, presenting "FATAL: Could not load /lib/modules/2.6.32-573.18.1.el6.x86\_64/modules.dep: No such file or directory". Any way you put it, this sucked. The first time this happened I call TAC and while they had seen it, they had no good answer except for rebuild the VM, restore from backup. Finally after the 3rd time (approximately 3 months after install) [the bug had been officially documented](https://bst.cloudapps.cisco.com/bugsearch/bug/CSCvb21486) and (yay) it included a work around. The good news is that the underlying issue at this point has been fixed in 11.5(1.11900.5) and forward so if you are already there, no problems. The issue lies with the fact that the locked down build of RHEL 6 that any of the Cisco Voice server platforms are built on don't handle VMware Tools updates well. It's all good when you perform a manual update from their CLI and use their "*utils vmtools refresh*" utility, but many organizations, mine included, choose to make life easier and enable vCenter Update Manager to automatically upgrade the VMware tools each time a new version is available and the VM is rebooted. So how do you fix it? While the bug ID has the fix in it, if you aren't a VMware regular they've left out a few steps and it may not be the easiest thing to follow. So here I'm going to run down the entire process and get you (and chances are, myself when this happens in the future) back up and running.

0. Go out to the [cisco.com](https://cisco.com) site and download the recovery CD for 11.5. You should be able to find that [here](https://software.cisco.com/portal/pub/download/portal/select.html?&mdfid=286306100&flowid=79971&softwareid=282074294), but if not or if you need a different version browse through the downloads to Downloads Home > Products > Unified Communications > Call Control > Unified Communications Manager (CallManager) > Unified Communications Manager Version 11.5 > Recovery Software. Once done upload this to any of the datastores available to host your failing VM resides on.

1. If you've still got the VM running, shut it down by right clicking the VM > Power > Power Off in the vCenter Web UI or the ESXi embedded host client.

2. Now we need to make a couple of modifications to the VM's settings to tell it 1) attach the downloaded ISO file and check the "Connected at boot" box and 2) Under VM Options > Boot Options to "Force BIOS setup" at next boot. By default VMs do not look at attached ISOs as the first boot device. Once both of these are done it's time to boot the VM.

{{< figure src="2.force-bios.png" alt="VMware VM settings showing Boot Options with Force BIOS Setup enabled and CD/DVD drive attached and connected at boot" >}}

3. I personally like to launch the VMware Remote Console first and then boot from there, that way I've already got the screen up. After you power on the BIOS in a VM is the same old Phoenix BIOS we all know and love. Simply tell the VM to boot to CD before hard drive, move to Exit and 'Save and Exit' and your VM will reboot directly into the recovery ISO.

{{< figure src="3.-boot-to-cd.png" alt="VMware Remote Console showing Phoenix BIOS boot order screen with CD-ROM set as the first boot device" >}}

4. Once you get up to the Recovery Disk menu screen as shown below we need to get out to a command prompt. To do this hit Alt-F2 and you'll be presented with a standard bash prompt.

{{< figure src="4.-Rescue-CD.png" alt="Cisco Unified Communications Manager 11.5 Recovery Disk boot menu screen" >}}

5. The root cause of this issue is that the initramfs file is improperly sized after an automatic VMware Tools upgrade. Now that we have our prompt we first need to verify that we are actually seeing the issue we expect. To do this run `find / -name initramfs*`. This command should produce the full path and filename of the file. To get the size run `ls -lh /mnt/part1/boot/initramfs-2.6.32-573.18.1.el6.x86_64.img`. If you aren't particularly used to the Linux CLI once you get past ...initr you should be able to hit tab to autocomplete. This should respond by showing you that that file is incorrectly sized somewhere between 11-15 MB.

{{< figure src="5.-Verify-corrupt-file.png" alt="Linux bash prompt showing find and ls -lh commands confirming the initramfs file is undersized at approximately 13 MB" >}}

6. Now we need to perform a chroot on the directory that contains boot objects: `chroot /mnt/part1`

7. Finally we need to manually re-run the VMware Tools installer to get the file properly sized. Run `/usr/bin/vmware-config-tools.pl -d`. There are various steps throughout the process where it is going to ask for input. Unless you know you have a reason to differ just hit enter at each one until it completes. Once done, rerun the `ls -lh` command from step 5. You should now see the file size changed to 24 MB or so.

{{< figure src="6.-after-vmware-tools-install.png" alt="Linux bash prompt showing VMware Tools reinstallation output and ls -lh confirming initramfs file is now correctly sized at approximately 24 MB" >}}

8. Now we just need to do a little clean up before we reboot. Go into Settings for your VM and tell it not to connect the ISO at boot. Once you make that change flip back over to your console and simply type `reboot` or `shutdown -r 0` to reboot back to full functionality.