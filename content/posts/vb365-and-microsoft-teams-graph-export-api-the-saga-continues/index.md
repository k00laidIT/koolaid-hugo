+++
title = "VB365 and Microsoft Teams Graph Export API: The Saga Continues"
date = "2023-04-04T13:19:49Z"
draft = false
tags = [ "how to", "M365", "VB365", "veeam",]
categories = [ "M365", "Veeam",]
featureimage = "featured.png"
+++


I feel like I could write, produce, direct and star in a saga based in a galaxy far, far away with the amount of time I have spent talking about the combination of Microsoft365, backup applications that support it such as [Veeam Backup for Microsoft365](https://www.veeam.com/backup-microsoft-office-365.html), and the recent [Microsoft Teams Graph Export API](https://learn.microsoft.com/en-us/microsoftteams/export-teams-content). Yet here I am again because Microsoft has decided to change course with how this capability will be handled without telling anyone.

Recently I started to hear of support cases where users were doing the needful by filling out Microsoft’s form and then after the prescribed 5-7 business days attempting to enable support for Teams Chat backup available in VB365 versions 6a and 7 only to be presented with the error “*To call this API the app must be associated with an Azure subscription, see* [*https://aka.ms/teams-api-payment-requirements*](https://aka.ms/teams-api-payment-requirements) *for details.*”

{{< figure src="image.png" alt="" >}}

For those who have been dealing with the Teams Graph Export metered API it’s a telltale sign that for whatever reason the Azure subscription ID associated with the organization modern application used to do backups was not available. Upon looking at [the form](https://aka.ms/teamsgraph/requestaccess) I noticed that it no longer requires a subscription ID meaning that, once again, Microsoft has changed the process and not told anyone, leaving backup vendors as well as their partners scrambling to make sure our customers are properly suited. This has been well covered at this point by Ian Sanderson in his blog “[Protecting Microsoft Teams Channel Chat Data: Are You Prepared?](https://1111systems.com/blog/preparing-your-organisation-for-microsoft-teams-chat-backup-with-1111-and-veeam-backup-for-microsoft-365/)”

Upon trying to enable this protection for myself and as a matter of testing I’ve found that while the instructions are correct when using [Azure Cloudshell](https://learn.microsoft.com/en-us/azure/cloud-shell/overview) it doesn’t work if you’ve just installed the Azure CLI on a windows system. This is due to a bug mentioned [deep in the recesses of github](https://github.com/Azure/azure-cli/issues/11981#issuecomment-844657384) that essentially says that cloud shell is bash based so you have to use different escape sequences to make it work. Further the Microsoft guide leaves out the step of creating a resource group to bind your appId and Subscription ID together. For all of those reasons I felt it necessary to create a follow up to Ian’s post to show you how to enable all this via Azure CLI on a Windows Server.

## How-To Time!

0\. If you haven’t already install Azure CLI from [the download](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli) or via Chocolatey “<samp>`choco install -y azure-cli`</samp>”

1\. Login or have the account owner login to their Azure account with “`<samp>az login –use-device-code</samp>”`. That will have the effect of creating a code for you to login to Microsoft with much like when you register an organization with Veeam Backup for Microsoft365. Once processed it will output a list of your active subscriptions. The `id` field there should be your subscription ID you will need later.

2\. Next you will need to register the Microsoft.GraphServices namespace as shown in the Microsoft document. This is general using “<samp>`az provider register --namespace Microsoft.GraphServices`</samp>”

3\. Next you need to [create a resource group](https://learn.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest) to be the relationship will live within. This is done, assuming you want to create your resources in the Eastern US region of Azure, by using “<samp>`az group create -l eastus -n myResourceGroup`</samp>” If you need another region you can pull a list of those available with '`az account list-locations`'

4\. Finally, we now must link the application ID (which you should have from the confirmation email from Microsoft) and the subscription ID from your login above and create a resource. This is where the formatting matters so simply select the all-caps text below to replace  
<samp>`az resource create --resource-group koolaidInfoBilling --name myResourceGroup --resource-type Microsoft.GraphServices/accounts --properties '{\`'appId\`': \`'INSERTAPPIDHERE\`'}' --location Global --subscription “INSERTSUBSCRIPTIONIDHERE”`</samp>

That should return a block of JSON that looks like this:

`{<br></br>'extendedLocation': null,<br></br>'id': '/subscriptions/3047753f-7bb6-47ff-802b-55358facde54/resourceGroups/myResourceGroup/providers/Microsoft.GraphServices/accounts/myGraphAppBilling',<br></br>'identity': null,<br></br>'kind': null,<br></br>'location': 'Global',<br></br>'managedBy': null,<br></br>'name': 'myGraphAppBilling',<br></br>'plan': null,<br></br>'properties': {<br></br>'appId': 'MYAPPLICATIONID',<br></br>'billingPlanId': 'MYNEWBILLINGPLANID',<br></br>'provisioningState': 'Succeeded'<br></br>},<br></br>'resourceGroup': 'myResourceGroup',<br></br>'sku': null,<br></br>'systemData': {<br></br>'createdAt': '2023-03-27T17:16:29.8280947Z',<br></br>'createdByType': 'User',<br></br>'lastModifiedAt': '2023-03-27T17:16:29.8280947Z',<br></br>'lastModifiedByType': 'User'<br></br>},<br></br>'tags': null,<br></br>'type': 'microsoft.graphservices/accounts'<br></br>}`

{{< figure src="image-3.png" alt="" >}}

Once that provisioningState shows as succeeded you should be able to go run your Teams Chat enabled VB365 job again and find some success, at least until Microsoft decides to mess with it again. I will add personally that they are truly doing a disservice to their ecosystem; their partners don't really seem to have a good idea of when/if changes are going to happen and those of us downstream, both Service Providers and Customers, are put into a perpetual state of trying to catch up to poorly considered implementations.