+++
title = "Dude, Where&#8217;s My Managed Service Accounts?"
date = "2019-01-23T14:22:36Z"
draft = false
tags = [ "active directory", "ADFS", "how to", "Windows",]
categories = [ "Systems",]
featureimage = "featured.jpg"
+++


So I am probably way late to the game but today's opportunities to learn have included ADFS and with that the concept of Managed Service Accounts.

What's a Managed Service Account you ask? So we've all installed applications and either set the service to run with the local system account or with a standard Active Directory account. Since the release of Windows Server 2008 R2 this feature has been available (and with Windows Server 2012 greatly enhanced,) gMSA lets you create a special type of account to be used for services where Active Directory itself manages the security of the account, keeping you secure while not having to update passwords regularly.

While there are quite a few great [step by step guides](http://www.rebeladmin.com/2018/02/step-step-guide-work-group-managed-service-accounts-gmsa-powershell-guide/) for setting things up and then creating your first Managed Service account, I almost immediately ran into an issue where my Active Directory didn't seem to include the Managed Service Accounts container (CN=Managed Service Accounts,DC=mydomain,DC=local). My domain was at the correct level, Advanced Features were turned on in AD Users &amp; Computers, everything seemed like it should be just fine, the container just wasn't there. In this post I'll outline the steps I ultimately took that resulted in getting the problem fixed.

### Step 0: Take A Backup

While you probably are already mashing on the "take a snapshot" button or starting a backup job, its worth saying anyway. You are messing with your Active Directory, be sure to take a backup or snapshot of your Domain Controller(s) which holds the various FSMO roles. Now that you've got that backup depending on how complex your Active Directory is it might be worth leveraging something like Veeam's [SureBackup](https://www.koolaid.info/setting-external-access-veeam-surebackup-virtual-lab/) (er, I mean [DataLab](https://www.veeam.com/blog/new-datalabs-overview.html)) like I did and create you a test bed where you can try it out on last night's backups before doing this in production.

### Step 1: ADSI Stuff

Now we are going to have to start actually manually editing Active Directory. This is because you might have references to Managed Service Accounts in your Schema but are just missing the container. You also have to tell AD it isn't up to date so that the adprep utility can be rerun. Be sure you are logged into your Schema Master Domain Controller as an Enterprise Admin and launch the ADSIEdit MMC.

1. Right click ADSI Edit at the top of the structure on the left, Click Connect... and hit OK as long as the Path is the default naming context.
2. Drill down the menu structure to CN=Domain Updates, CN=System, DC=&lt;mydomain&gt;,DC=&lt;mytld&gt;
3. Within the Operations Container you will need to delete the following containers entirely.
    1. CN=5e1574f6-55df-493e-a671-aaeffca6a100
    2. CN=d262aae8-41f7-48ed-9f-35-56-bb-b6-77-57-3d
4. Now go back up a level and right click on the CN=ActiveDirectoryUpdates container and choose Properties
    1. Scroll down until you find the "revision" attribute, click on it and click Edit
    2. Hit the Clear button and then OK
    3.

### Step 2: Run ADPrep /domainPrep

So now we've cleaned out the bad stuff and we just need to run ADprep. If you have upgraded to your current level of Active Directory you probably have done this at least once before, but typically it won't let you run it on your domain once its been done; that's what the clearing the revision attribute above did for us. Now we just need to pop in the (probably virtual) CD and run the command

<div class="wp-block-image"><figure class="aligncenter">

![](adprep-result.jpg)

<figcaption>Yay! It actually worked!</figcaption></figure></div>1. Mount the ISO file for your given operating system to your domain controller. You can either do this by putting the ISO on the system, right click, mount or do so through your virtualization platform.
2. Open up a command line or powershell prompt and navigate to &lt;CDROOT&gt;:\\support\\adprep
3. Issue the .\\adprep.exe /domainPrep command. If all goes well it should report back "Adprep successfully updated the domain-wide information."

Now that the process is completed you should be able to refresh or relaunch your Active Directory Users &amp; Computers window and see that Managed Service Accounts is available right below the root of your domain as long as Advanced Features is enabled under View and you are now good to go!