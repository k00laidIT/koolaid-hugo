+++
title = "Build Your VBR v10 Environment: SQL Server"
date = "2020-02-14T09:14:31Z"
draft = false
tags = [ "how to", "v10", "veeam",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


\[video width="1892" height="924" mp4="VBRv10-Installing-SQL.mp4"\]\[/video\] I was recently honored to be a guest on [Vince Wood](http://twitter.com/mvwood)'s [IT Reality Podcast](https://itr-it-reality.zencast.website/) for episodes [7](https://itr-it-reality.zencast.website/episodes/7) and [8](https://itr-it-reality.zencast.website/episodes/8). In the episodes a couple of the things that came up is that while for small environments Veeam will work right out of the box for most end customers of the software there is a requirement to scale the components out correctly. One of the advantages to Veeam Backup and Replication is that it is hardware and operating system agnostic for many of its components but with choice comes complexity. One of the other things that came up was the fact that for most Veeam Cloud Connect customers, myself included up to 5 months ago when I began working for a Service Provider, the way that side is setup is a mystery. While I won't exactly be giving up the special sauce here I was struck with the thought that a series of posts that show you how correctly set up a Veeam Backup and Replication v10 environment both on premises and for the Cloud Connect environment would be pretty educational. Each of these will have video walk throughs of the actual installations so you can follow along as well if you like. I total we'll be covering the following topics:

- Episode 1: Intro and Common components
- Episode 2: On-Prem Windows Components (VBR, Windows Proxy, Windows Repo)
- Episode 3: On-Prem Linux Components (Proxy, Repo), Create Local Jobs
- Episode 4: Build Service Provider pod
- Episode 5: Create cloud jobs to both Service Provider and Copy Mode to S3
- Episode 6: Veeam Availability Console
- Episode 7: Veeam Backup for Office 365
 
 In this episode we are mostly talking setting up your external SQL server for Veeam use. While the Veeam Backup and Replication installer includes MS SQL Server Express 2016 as part of the simple mode installation, but according to [Veeam best practices](https://www.veeambp.com/backup_server_introduction/backup_server_database) you wouldn't want to use this if you are backing up more than 500 instances, extensively using tape or want to leverage a common SQL products for other parts of the Veeam environment including Enterprise Manager or VeeamONE. 1. Intro to Lab Environment Design
2. Blog Post Steps to Come
3. Mount SQL Server 2016 ISO
4. Run Setup.exe
5. Allow for Updates check before installing
6. Rules Check and open up Windows Firewall for communication, either by disabling entirely or at least creating a port based rule for TCP 1433
7. In Feature Selections choose Database Engine Services only unless you or your SQL administrator have other needs
8. Either name your SQL Instance or leave it with the default MSSQLSERVER
9. Based on need or security practices enable or leave disabled the SQL Server Agent and SQL Server Browser services
10. In Database Engine Configuration 
    1. Set your authentication mode. I prefer to leave it Windows only but there are valid use cases to choose Mixed mode and create SQL only credentials
    2. Add SQL server administrator accounts. Domain Admins for small environments but also want to add the service account you plan to run Veeam services under
    3. Set your Data Directories. For the lab I will leave default but in production you should create 3 additional volumes for your SQL Server, 1 each for databases, logs and backups
11. Hit Install
 
 Once completed you will be ready to proceed to installing your Veeam server itself. One thing that is ommitted from the video but probably a good idea is to go ahead and install MS SQL Server Management Studio. It's a separate download, but often when you need to call Veeam support it is database related and SSMS is the way to manage the databases. You can [directly download from Microsoft](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) but if you happen to have [Chocolatey available](https://chocolatey.org/install) on the server installation is a <span class="lang:ps decode:true crayon-inline ">choco install sql-server-management-studio -y</span> away. With that we'll consider this step done and move on to installing the on-premises Windows components in the next post.