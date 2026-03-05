+++
title = "PostgreSQL 16 on Ubuntu 24.04 LTS for VB365 v8"
date = "2024-12-09T14:34:15Z"
draft = false
tags = [ "how to", "linux", "postgres", "ubuntu", "VB365", "veeam",]
categories = [ "M365", "Veeam",]
featureimage = "featured.png"
+++


In case you haven't noticed I've been putting out a little bit of content lately regarding Veeam Backup for Microsoft365 v8. So far we've covered how to [deploy NATS.io](/deploying-nats-io-for-vb365-with-podman/) in a scale out manner, how to deploy [Linux proxies](/prepare-ubuntu-22-04-for-veeam-backup-for-m365-v8-proxy-use/) on Ubuntu 22.04 and now I'm going to do an update to [a post from earlier in the year](/postgresql-on-ubuntu-2022-4-installation-configuration-for-veeam-purposes/) regarding deploying PostgreSQL to round out our scalable VB365 deployment.

In my previous post regarding PSQL I walked through the deployment for VBR on Ubuntu 22.04 LTS. Updates to the native PostgreSQL repository in 24.04 LTS as well as the VB365 installer has made this far simpler so I thought it was worth a revisit. While Veeam has been standardizing on PSQL 15.1 utilizing the latest version is supported so I would recommend doing that.

**1.Install and enable the APT repository**

```bash
sudo apt install -y postgresql-common -y

### Enable PostgreSQL APT repository
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
 
```1. 
**2.Install, Enable and Start PostgreSQL**

```bash
### install the server package
sudo apt install -y postgresql

### enable and start the postgresql service
sudo systemctl enable postgresql
sudo systemctl start postgresql
```
**3.Setup the default user password**

```bash
### set default user password
sudo -u postgres psql
postgres=#  ALTER USER postgres WITH ENCRYPTED PASSWORD 'strong_password';
postgres=#  CREATE USER veeamsvc ENCRYPTED PASSWORD 'strong_password'; #creates a veeam specific user
postgres=#  \q #quits psql console
```
**4.Modify configuration files for remote access**

```bash
#Allow server to listen to anyone
sudo echo "listen_addresses = '*'" > /etc/postgresql/16/main/postgresql.conf

#IPv4 local connections
sudo echo "host all all 0.0.0.0/0 scram-sha-25 " > /etc/postgresql/16/main/pg_hba.conf

#Restart service to make changes take effect
sudo systemctl restart postgresql

#Modify firewall policy to allow UDP port 5433 (changed in v16)
ufw allow 5433/udp
```
**5.Install Veeam Backup for Microsoft365 v8.** After clicking the "Customize Settings" link use the information you've created above to connect to your PostgreSQL server.

{{< figure src="featured.png" alt="" >}}

  
6**.Set Server Limits via Powershell.** Once VB365 is installed one big improvement is how you can inject the database tuning via VB365 Powershell. From the VB365 controller you've just rolled out you can simply run the cmdlet, specifying Linux as the OS, CPU count and RAM and it will do the magic for you. In the past and for VBR purposes you've historically had to create an export and then run the PSQL file. As an example for a system with 8 vCPU and 16 GB of RAM you'd do the following:

```powershell
Set-VBOPSQLDatabaseServerLimits -CPUCount 8 -RamGb 16 -OSType Linux
```
Afterwards you just need to restart PSQL on your server for those changes to take effect and you are good to go.

## Conclusion

In the end this is a much simpler process than it was even 9 months ago but one that can save you a great deal of cost while enhancing your scalability. Veeam is officially supporting Postgres regardless of how it's deployed as long as it's version 15.1 or later but sticking with the latest LTS release of Ubuntu in my mind gives you a great mix of security, supportability and performance.