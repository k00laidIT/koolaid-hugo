+++
title = "Setting Up Endpoint Backup Access to Backup &#038; Replication 8 Update 2 Repositories"
date = "2015-05-01T08:45:44Z"
draft = false
tags = [ "backup", "how to", "veeam", "virtualization",]
categories = [ "Systems", "Veeam", "Virtualization",]
featureimage = "featured.jpg"
+++


A part of the Veeam Backup &amp; Replication 8 Update 2 Release is the ability to allow users to target repositories specified in your Backup Infrastructure as targets for Endpoint Backup. While this is just one of many, many fixes and upgrades (hello vSphere 6!) in Update 2 this one is important for those looking to use Endpoint Backup in the enterprise as it allows for centralized storage and management and equally important is you also get e-mail notifications on these jobs. Once the update is installed you'll have to decide what repository or repositories will be available to Endpoint Backup and provide permissions for users to access them. By default every Backup Repository Denies Endpoint Backup access to everyone. To change this for one or more repositories you'll need to:

1. Access the Backup Repositories section under Backup Infrastructure, then right click a repository and choose "Permissions."
2. Once there you have three options for each repository in regards to Endpoint permissions; Deny to everyone (default), Allow to everyone, and Allow to the following users or groups only. This last option is the most granular and what I use, even if just to select a large group. In the example shown I've provided access to the Domain Admins group.
3. You will also notice that I've chosen to encrypt any backups stored in the repository, a nice feature as well of Veeam Backup &amp; Replication 8.
 
 \[gallery link="file" columns="4" ids="325,330,329,331"\] Also of note is that no user will be able to select a repository until they have access to it. In setting up the Endpoint Backup job when the Veeam server is specified you are given the option to supply credentials there so you may choose to use alternate credentials so that the end users themselves don't actually have to have access to the destination.