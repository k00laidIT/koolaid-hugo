+++
title = "Creating Staff Notification Mail Contacts in Exchange"
date = "2017-10-27T14:23:05Z"
draft = false
tags = [ "Exchange", "powershell", "scripting",]
categories = [ "Systems",]
featureimage = "featured.jpg"
+++


Just a quick post with a script I've just written. Living in WV we from time to time have to let staff know that the offices will be closed for various reasons, from heavy snow to [chemical companies dumping large quantities of chemicals into the area's water supply](https://en.wikipedia.org/wiki/2014_Elk_River_chemical_spill). For this reason, we maintain a basic emergency staff notification process that requires an authorized person to send an e-mail to a certain address and that will carpet bomb staff who chose to opt-in to receive text messages and e-mails to their personal (as opposed to business) e-mail addresses. This is all powered by using creating hidden mail contacts on our Exchange server for the personal address as well as the e-mail address that corresponds to the users' mobile provider. These addresses are all then dynamically added to a distribution list that is restricted by who can send to it. To be honest the system is mostly automatic with the exception of needing to makes sure new contacts get put in and old contacts get taken out. Taking them out by GUI is pretty simple, just right click delete but it seems to be lots of steps to add them in. So in the script below I've automated the process of interrogating the Admin entering them and then using that information to automatically create the contacts and then hide them from the Global Address List.

```
#New-DRContact.ps1
#Allows for the creation of Exchange 2010-2016 Mail Contacts for both a mobile phone and a personal e-mail address
#If you wish these addresses to be listed in the GAL comment the Set-MailContact lines

$OU = Read-Host -Prompt "OU to put the contact in (format domain/staff/contacts)"
$FirstName = Read-Host -Prompt "What is the user's first name"
$LastName = Read-Host -Prompt "What is the user's last name"
$Mobile = Read-Host -Prompt "What is the mobile number e-mail address (Common Domains- txt.att.net, vtext.com, pcs.ntelos.net, sprintpcs.com)"
$Personal = Read-Host -Prompt "What is the user's personal e-mail address"

if ($Mobile) {
    $MobileCName = $FirstName + " " + $LastName + " Mobile"
    $MCAlias =$FirstName.ToLower().Substring(0,1) + $LastName.ToLower() + "mobile"
    New-MailContact -Name $MobileCName -Alias $MCAlias -ExternalEmailAddress $Mobile -OrganizationalUnit $OU
    Set-MailContact $MCAlias -HiddenFromAddressListsEnabled $true    
}

if ($Personal) {
    $PersonalCName = $FirstName + " " + $LastName + " Personal"
    $PCAlias =$FirstName.ToLower().Substring(0,1) + $LastName.ToLower() + "personal"
    New-MailContact -Name $PersonalCName -Alias $PCAlias -ExternalEmailAddress $Personal -OrganizationalUnit $OU
    Set-MailContact $PCAlias -HiddenFromAddressListsEnabled $true
```
 Now in order to make this work you need to either have an Exchange Shell window open or be remotely connected. As I am getting to where I have a nice, neat PowerShell profile on my laptop I like to stay in it so I remote in. I've automated that process in this Open-Exchange.ps1 script. ```
#Open-Exchange
#Prompts for servername and credentials and then gives you a remote Exchange Shell connection

$Server = Read-Host -Prompt "What's the server name"
$UserCredential = Get-Credential
$Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://$Server/PowerShell/ -Authentication Kerberos -Credential $UserCredential
Import-PSSession $Session
```
 Now if you'd like to save yourself the need to cut and paste these locally you can find these scripts and few others I've been writing on my [GitHub repo](https://github.com/k00laidIT/Learning-PS).