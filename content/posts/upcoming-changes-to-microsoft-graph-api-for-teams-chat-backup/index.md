+++
title = "Upcoming Changes to Microsoft Graph API For Teams Chat Backup"
date = "2022-06-21T15:51:49Z"
draft = false
tags = [ "API", "microsoft", "Office365", "VB365", "veeam",]
categories = [ "Veeam",]
featureimage = "featured.jpg"
+++


Microsoft has recently created [documentation](https://docs.microsoft.com/en-us/microsoftteams/export-teams-content) about changes coming to the Microsoft Graph API relating to Teams chat. In short the current method of backing up Teams chat will be decommissioned and it will be replaced by what is called the Teams Export API. This API will have fees associated with its use and those fees will be assessed directly by Microsoft against the M365 account in a burst method.

In response to that Veeam has [released guidance](https://www.veeam.com/kb4322) as to how this will be handled with their Veeam Backup for Microsoft365 product on which our Secure Backup for Microsoft365 product is based. This will take effect on the Veeam side from version 6a forward. It is anticipated that 6a will be released July/August 2022 time frame. It is unknown at this time when iland will be installing this to our VB365 environments.

While I’m writing this post with Veeam Backup for Microsoft365 in mind because they’ve released KB 4322, it’s important to note that this isn’t just a problem for Veeam, any vendor doing chat level backup for M365 is going to be running into this.

## Costs

Microsoft has outlined a number of models in their document for how costs will be incurred for consuming this API. Due to Microsoft’s not considering data protection a Security &amp; Compliance use case Veeam and any other M365 backup vendor will need to use the “Model B” as [outlined here](https://docs.microsoft.com/en-us/graph/teams-licenses?ad=in-text-link#modelb-requirements). This model provides access to backup channel based chat messages across the platform. Veeam does not at this time support backup of 1:1 or 1:many direct messages so this use case is out of scope.

When you get down to it what any Microsoft 365 customer are going to care about is cost. Once your organization begins being processed by the new API you charges will be paid through your organization’s Microsoft account on a per message rate directly to Microsoft. It is known that the cost per message will be $0.00075 per message and it is anticipated at this time that messages being sent to a channel will be considered “Group” data and as such will only incur cost on a per message basis. If at some point in the future Veeam supports protecting direct 1:1 and 1:many chats then these will be charged as per message x # of users who receive it.

## So, When?!?

Tentatively I’m hearing that this should take full effect and the cutoff of the old method will begin on October 1, 2022 just like Basic Authentication depreciation. As for when costs will begin being incurred for the “Model B” API hits starting on July 5, 2022. At some point between those 2 VB365 6a will be released.

It is worth noting that regardless of if you have opted in or not Veeam will not be able to enable the Teams Chat option for you upon upgrade of 6a because it requires new permissions. They will notify you upon install if it detects you were backing up Teams Chat before so that you can investigate what you need to do.

<figure class="wp-block-image">

{{< figure src="6304c34a-7d98-4834-8aea-6e72c9dad116-83331-000006c4d6a35153_file.jpg" alt="" >}}

</figure>## Microsoft 365 Customer Responsibility

With this new model Customers will be [required to “opt-in”](https://docs.microsoft.com/en-us/graph/teams-protected-apis) as described in Veeam KB 4322 by requesting access to the Graph Export API. It is anticipated that from the beginning of requesting access to the API and then Microsoft granting it may take take up to 2 weeks.

Further once this process has been completed customers will need to access their organization in VB365 and re-authenticate to the organization to enable Teams Chat support and grant the new permissions necessary. As Microsoft is also beginning to depreciate the Basic Authentication method in the same time frame you may have to do this anyway.

<figure class='wp-block-image'>

{{< figure src="featured.jpg" alt="" >}}

</figure>Finally as mentioned above once and if a customer chooses to backup Teams chat the customer will need to access their jobs and select to backup Chats on a per job, per channel basis. Any existing jobs prior to the upgrade will have this new, granular Chats option available per channel but disabled, having the effect of turning off Teams Chat backup. This option was not available before as Chat was just a portion of the overall service. This is actually a positive in that they will have more granular ability to choose when and where to enable chat backup to minimize costs.

<figure class='wp-block-image'>

{{< figure src="9fcc7dc1-67fa-40f3-a4b1-32a71c72bb82-83331-000006c298657005_file.jpg" alt="" >}}

</figure>## Conclusion

In the end this stinks horribly and Microsoft has made some changes that I’m sure are going to have their customers in a bind and thinking about options. Beginning with not considering data protection to be a Security and Compliance need (thus excluding partners from considering the Model A option) and carrying through the “I’ve got to go fill out an Office Forms doc and in a couple of weeks somebody will grant me access” workflow all of this screams “I don’t really care about you.” For those of us in a Service Provider or large enterprise space this hasn’t exactly been a long runway of potentially large scale impact on the cost of our services.