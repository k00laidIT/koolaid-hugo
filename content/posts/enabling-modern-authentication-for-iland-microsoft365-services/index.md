+++
title = "Enabling Modern Authentication for iland Microsoft365 Services"
date = "2022-08-10T14:42:18Z"
draft = false
tags = [ "how to", "M365", "VB365", "veeam",]
categories = [ "Veeam",]
featureimage = "featured.png"
+++


Unless you’ve had your head stuck in the sand you probably have heard at this point that Microsoft has been trying numerous times to kill the Basic Authentication method for application integration into M365. While they tried and then delayed quite a few times the latest date of [October 1, 2022 ](https://docs.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online)seems to be sticking so you do need to prepare for this.

As someone who fortunately/unfortunately has to think far too much about data protection of things like M365 this is something that has been a big part of my day to day conversations as I tend to work a good deal with this in regards to Veeam’s Backup for Microsoft365 product.

Let’s start with the good news: Working with what in Veeam vocabulary is “Modern Only” authentication is probably the easiest and most robust way to let Veeam organization configuration interact with your Microsoft365 organization. No more need to manually create and register Azure applications, no need to go through a laundry list of Exchange, Sharepoint and Graph API permissions, all of that is automatically created and managed through the registration process. Further modern application authentication also allows for MFA authentication at registration with any administrator level account in your organization without Veeam ever needing to record or manage those accounts. So all that is great but there are some drawbacks as well.

Unfortunately there are still a few things where Microsoft hasn’t achieved feature parity with the old method of authentication, most notably support for protecting Exchange Public Folders. This and other limitations of the API only method are outlined in Veeam’s handy [KB3146](https://www.veeam.com/kb3146).

In my day job at [iland cloud](https://www.iland.com) we’ve been able to extend support for Modern Authentication to our own console that leverages the Veeam VB365 APIs. It’s relatively easy to and in short you

1. Choose to Update MS Credentials from the Action menu of your M365 Organization in the iland console.
2. Choose Modern Application Authentication Only, select the data types you wish to protect and then provide a name for your application that will be created in Azure Active Directory.
3. Login to [Microsoft’s device authentication portal](https://www.microsoft.com/devicelogin) using your M365 administrator credentials and the provided device code.
4. Confirm that you are authenticating with Azure CLI.
5. Close the device authentication portal window when prompted and hit submit in the iland console.

<div class="wp-block-jetpack-slideshow aligncenter" data-effect="slide"><div class="wp-block-jetpack-slideshow_container swiper-container">- <figure>

{{< figure src="image-1024x224.png" alt="" >}}

<figcaption class="wp-block-jetpack-slideshow_caption gallery-caption">Select Update MS Credentials from the Action menu of your M365 Organization in the iland console</figcaption></figure>
- <figure>

{{< figure src="image-1.png" alt="" >}}

<figcaption class="wp-block-jetpack-slideshow_caption gallery-caption">Select that you want to use Modern Application Only, the data types you wish to protect, then finally supply a name you would like to use for the application you create in Azure Active Directory</figcaption></figure>
- <figure>

{{< figure src="image-2.png" alt="" >}}

<figcaption class="wp-block-jetpack-slideshow_caption gallery-caption">Supply the code that is generated in the iland console screen to microsoft.com/devicelogin.</figcaption></figure>
- <figure>

{{< figure src="image-3.png" alt="" >}}

<figcaption class="wp-block-jetpack-slideshow_caption gallery-caption">Confirm that you are attempting to authenticate via Azure CLI</figcaption></figure>
- <figure>

{{< figure src="image-4.png" alt="" >}}

<figcaption class="wp-block-jetpack-slideshow_caption gallery-caption">Confirm authentication, close this window and then hit submit in the iland console.</figcaption></figure>

<a class="wp-block-jetpack-slideshow_button-prev swiper-button-prev swiper-button-white" role="button"></a><a class="wp-block-jetpack-slideshow_button-next swiper-button-next swiper-button-white" role="button"></a><a aria-label="Pause Slideshow" class="wp-block-jetpack-slideshow_button-pause" role="button"></a><div class="wp-block-jetpack-slideshow_pagination swiper-pagination swiper-pagination-white"></div></div></div>This isn't some magical black box, messing with your organization's security without any ability to see what is happening. If you navigate to [Azure Active Directory](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview) and Enterprise Applications you will find your created application there and you can review and document as needed any permissions and roles added. Understand that future builds/versions of Veeam Backup for M365 may require new permissions (the new [Graph Teams Export API](https://www.koolaid.info/upcoming-changes-to-microsoft-graph-api-for-teams-chat-backup/) coming in 6a immediately comes to mind) so this will not be a completely static list but you will need to authenticate to the application any time changes will need to be made, we have no ability or rights to do this on our own.

{{< figure src="image-5.png" alt="" >}}

And that’s it! Once you authenticate the created application’s token is saved to the underlying VB365 server and your jobs will continue working as they always have. This will also be the methodology for any restores you need to perform to M365 going forward, giving you an additional level of security in that any restores will require not only a user with administrative rights but also have Multi-Factor Authentication enabled as well. Enjoy and happy data protecting!