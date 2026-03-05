+++
title = "Veeam Backup for Office365 v5: Purging Organization Data and Licenses"
date = "2021-10-04T14:12:36Z"
draft = false
tags = [ "vbo", "veeam",]
categories = [ "Automation", "Systems", "Veeam",]
featureimage = "featured.jpg"
+++


If there is any part of being an IT professional that I actively dislike it is the need to know the intricacies of how various vendors license their software products. As bad as it was when I was a "Geek of Many Hats" back when I used to work in the SMB space, believe me or not its even worse in the Service Provider space. This is because when I typically have to get involved with licensing questions or tasks it's because something has gone sideways for a customer organization or they are wanting to do "creative" things with their licensing dollars. I get it, I really do, I used to be there and you have to get as much out of every budget dollar you possibly can because with "Enterprise IT" at any scale those licensing spends usually equate to efficiencies or compliance check boxes, not products sold on a linear line like it is in other scenarios.

That said today I have the joy of trying to clean up after a human error situation with [Veeam Backup for O365](https://www.veeam.com/backup-microsoft-office-365.html?ad=menu-products). Now while many of you may know and/or love this product in a one off scenario where the only organization you are protecting is your own VBO is also considered a Service Provider product where the software at scale such as [at iland](https://iland.com/services/iland-secure-backup-microsoft-365/). While it is good for this, it's a whole different world when you need to architect solutions where many organizations will share the same backup infrastructure and then be billed for just their use. In this case we have a situation where a customer has licensed a very small subset of their much larger overall Office365 organization for backup, but through any number of ways a job was created that captured the entire organization. This resulted in the given server pulling almost twice as many licensed users as the license file allows, so yeah, good times.

Now when talking about Veeam licensing in regards to how it is determined that a given user should be allotted a licensed seat it is based off of a) backup data existing on disk (or in objects) and b) actively being a part of backup jobs. Both of these situations need to be cleared up before you can begin to actually remove licenses from users. Unfortunately aside from actually deleting the jobs (which does not have an option to delete the data under it) very little of this process can be done in the UI, it has to be done via Powershell. That said, here's the basic process for purging all data related to a given organization. If you need to be more fine tuned that that let me know and I'll write that up as well.

**This tutorial assumes that you are not sharing named repositories between tenant organizations. If you are doing that PLEASE CONSIDER THIS A GOOD TIME TO RETHINK THAT DECISION. Let me just say from experience it's bad man, it's bad. If you need to do this with a shared repository I would recommend you give the fine folks at Veeam support a call and have them assist you.**

1. Remove the jobs associated to a given organization. This should be simple enough as selecting the organization in VBO, then selecting all jobs within, right click delete.
2. Next we need to ensure that all data associated with the given organization is being purged. Luckily [Niels Englen](https://twitter.com/nielsengelen) has a handy script up on VeeamHub called [VBO-ClearRepo.ps1](https://github.com/VeeamHub/powershell/blob/master/VBO-ClearRepo/VBO-ClearRepo.ps1) that will take a given repo name and purge all data from it. You should be able to take this and just feed it all the repositories that are relevant over and over again and it will purge the data.
3. Finally we need to go through and verify that all the licenses have been removed for a given organization. If the organization is of any size this is most likely not been cleaned out and will necessitate you manually doing so. Luckily it can be done in a relatively easy manner with this:

```powershell
Specify the organization to set scope
$org = Get-VBOOrganization -Name "myawesomeorg.onmicrosoft.com"

#Get a count of how many mailboxes are involved before
Get-VBOLicensedUser -organization $org | measure

#Purge all users for our given organization
Get-VBOLicensedUser -organization $org | Remove-VBOLicensedUser
```
In my experiences this last cmdlet can take quite a while to run; for larger organizations I'm seeing a run rate of 10 licenses per minute but your mileage may vary. There is most likely a faster way to do it but would probably involve hacking on the Config DB something that should never be tried alone but that's up to your scenario.