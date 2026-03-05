+++
title = "Setup Rocky Linux 9 for VMware Templates"
date = "2022-07-19T14:22:18Z"
draft = false
tags = [ "cloud-init", "how to", "linux", "rocky linux",]
categories = [ "Automation", "Systems",]
featureimage = "featured.png"
+++


For those that haven't been playing in the RHEL/CentOS/Fedora space for a while Red Hat finally got around to making CentOS a more "productized" Linux Distribution and [replaced it with CentOS Stream](https://www.cyberciti.biz/linux-news/centos-linux-8-will-end-in-2021-and-shifts-focus-to-centos-stream/). That then spawned a [few](https://almalinux.org/) [forked](https://vzlinux.org/) distributions to fill the gap, most notably [Rocky Linux](https://rockylinux.org/) which recently released their version 9 to track the current cycle of RHEL.

Aside from the name pretty much everything in Rocky looks and feels the same as what you are used to with CentOS at this point, but because it is such a newly named Operating System VMware hasn't really known how to deal with it until the 7.0u3c release. As you may be aware the 7.0u3 releases have had a bit of troubling history so many organizations have chosen to stay on the 7.0u2 for now so upgrading to get named release isn't really going to work. This is quite the problem for those of us who are used to using the combination of VMware templates and Custom Specifications to rapidly deploy virtual machine instances.

Luckily there are a couple of options that VMware has finally documented in [KB59557](https://kb.vmware.com/s/article/59557). The first of which is kind of janky, edit the /etc/redhat-release file and change the word "Rocky" to "CentOS." Sure this works but anytime you run a system upgrade it's going to change it back. The better option is to install and configure Canonical's [cloud-init](https://cloud-init.io/). If you haven't looked at cloud-init yet it's definitely time as it allows you to be a bit more distribution agnostic in how you automatically provision virtual machines and cloud instances. As it is from the same maker Ubuntu has been supporting it and installs it by default for some time now so having support here is just nice.

{{< figure src="image-1.png" alt="" >}}

So first thing's first when you go to build your template source VM set the distribution to CentOS 8. This is as close as you are going to get until you upgrade to 7.0u3c or later. You then can build out your VM template as you normally would. Once the system is up you simply need to install cloud-init.

```bash
sudo yum makecache --refresh
yum -y cloud-init
```
Once installed it's worth checking out /etc/cloud/cloud.cfg and ensure that the `disable_vmware_customization` parameter is set to false. This will allow VMware to utilize cloud-init if it is available.

{{< figure src="featured.png" alt="" >}}

Now that you have installed cloud-init you can shutdown the VM (after making sure the system is up to date of course) and convert it to a template. It is then just a matter of using your VMware Customization Specification under Policies and Profiles to supply your rules for how you will automate the deployment.

{{< figure src="image-2.png" alt="" >}}