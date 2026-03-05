+++
title = "Updating Microsoft 365 Permissions for Veeam Backup for Office 365 v5"
date = "2021-05-20T15:15:50Z"
draft = false
tags = [ "how to", "vbo", "veeam",]
categories = [ "Veeam",]
featureimage = "featured.jpg"
+++


Dealing with Microsoft API permissions has long been one of the hard parts of working extensively with [Veeam Backup for Office 365](https://helpcenter.veeam.com/docs/vbo365/guide/vbo_introduction.html?ver=50). They tend to change fairly often and with little notice, leaving [Veeam](https://www.veeam.com) and other backup service providers for [Microsoft365](https://www.microsoft.com/en-us/microsoft-365) in the enviable spot of needing to chase these permissions with their applications.

Veeam recently released version 5 of their M365 backup product and while the requirements are mostly the same permissions wise as they were in version 4 I’ve found there are a couple that potentially v4 was able to work without having in place due to other legacy setups that now don’t work in v5. My specific issue results in any Exchange Online jobs returning with the following error:

> <span style="font-weight: bold; font-style: italic;">Processing mailbox XXXX failed with error: The remote server returned an error: (401) Unauthorized.</span>

Fixing this requires adding the “full\_access\_as\_app” permission but getting to that point is a bit more complicated for those not familiar with azure AD apps. This post will show you how to get to your existing Veeam Backup for Office 365 Azure app registration and verify that all of the necessary permissions have been added.

1. <span style="font-family: Calibri; font-size: 11.0pt; font-weight: normal; font-style: normal; color: black;">Connect to </span>[<span style="font-family: Calibri; font-size: 11.0pt;">https://portal.azure.com</span>](https://portal.azure.com)<span style="font-family: Calibri; font-size: 11.0pt; font-weight: normal; font-style: normal; color: black;"> and login with your global administrator permissions</span>
2. <span style="font-family: Calibri; font-size: 11.0pt; color: black;">Navigate to Azure Active Directory and then app registrations</span>
3. <span style="font-family: Calibri; font-size: 11.0pt; color: black;">Click on your current app registration used for Veeam Backup for O365</span>
4. <span style="font-family: Calibri; font-size: 11.0pt; color: black;">Select API permissions. Once there the desired state for Veeam Backup for Office 365 currently is </span>
    - - <span style="font-family: Calibri; font-size: 11.0pt;">Microsoft Graph </span>
            - <span style="font-family: Calibri; font-size: 11.0pt;">Directory.Read.All</span>
            - <span style="font-family: Calibri; font-size: 11.0pt;">Group.Read.All</span>
            - <span style="font-family: Calibri; font-size: 11.0pt;">Sites.ReadWrite.All</span>
            - <span style="font-weight: bold; font-family: Calibri; font-size: 11.0pt;">TeamSettings.ReadWrite.All</span>
        - <span style="font-family: Calibri; font-size: 11.0pt;">Office 365 Exchange Online </span>
            - <span style="font-weight: bold; font-family: Calibri; font-size: 11.0pt;">full\_access\_as\_app</span>
        - <span style="font-family: Calibri; font-size: 11.0pt;">Sharepoint </span>
            - <span style="font-family: Calibri; font-size: 11.0pt;">Sites.FullControll.All</span>
            - <span style="font-family: Calibri; font-size: 11.0pt;">User.Read.All</span>
5. <span style="font-family: Calibri; font-size: 11.0pt; color: black;">If you have performed the v5 upgrade and your backups are currently failing the bolded permissions above may likely be missing and you will need to add them. When done adding your API permissions window should look like this [

{{< figure src="o365v5perms-1-300x137.jpg" alt="" >}}

](featured.jpg) </span>
6. <span style="font-family: Calibri; font-size: 11.0pt; font-weight: normal; font-style: normal; color: black;">To add permissions you will need to </span>
    1. <span style="font-family: Calibri; font-size: 11.0pt;">click the “+ Add a permission” button</span>
    2. <span style="font-family: Calibri; font-size: 11.0pt;">click the tile for the necessary API group (Graph, Office 365 Exchange Online) \* </span><span style="font-family: Calibri; font-size: 11.0pt;">For the Office 365 Exchange Online direct access has been deprecated by Microsoft. In that case you will need to choose the “API my organization uses and search for “Office 365 Exchange” to find it. This looks like [

{{< figure src="o365myAPIs-1-300x170.jpg" alt="" >}}

](o365myAPIs-1.jpg) </span>
    3. <span style="font-family: Calibri; font-size: 11.0pt;">Choose “Application permissions”</span>
    4. <span style="font-family: Calibri; font-size: 11.0pt;">Check the box for the permission you are requesting and click “Add permissions” [

{{< figure src="o365addPerms-1-300x207.jpg" alt="" >}}

](o365addPerms-1.jpg) </span>
7. <span style="font-family: Calibri; font-size: 11.0pt; font-weight: normal; font-style: normal; color: black;">After adding permissions you will need to click the “Grand admin consent for &lt;your organization&gt;” button to complete adding the permissions for your organization.</span>
 
It is worth noting that for future reference the documentation for Veeam required permissions for Veeam Backup for Office 365 modern authentication with legacy protocols allowed is located at [https://helpcenter.veeam.com/docs/vbo365/guide/ad\_app\_permissions\_legacy.html?ver=50](https://helpcenter.veeam.com/docs/vbo365/guide/ad_app_permissions_legacy.html?ver=50). As these permissions are changed by Microsoft from time to time it is worth notating this link.