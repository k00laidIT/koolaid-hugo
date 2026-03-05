+++
title = "Setting up PGBouncer for Veeam Backup for Microsoft365 v8"
date = "2025-08-18T08:07:01Z"
draft = false
tags = [ "how to", "linux", "pgbouncer", "postgres", "veeam",]
categories = [ "M365", "Service Provider", "Veeam",]
featureimage = "featured.png"
+++


Veeam has begun [advising VB365 administrators in large scale environments](https://bp.veeam.com/vb365/guide/buildconfig/postgresql.html#veeam-backup-for-microsoft-365-postgresql-database-server) to use a project called [PGBouncer ](https://www.pgbouncer.org/)with the required [PosgreSQL](https://www.postgresql.org/) server. PGBouncer is essentially a proxy that sits in front of your PSQL server and will allow connection attempts to be managed to keep load on the database server at a manageable level by pooling incoming connections and operating a buffer.

### So why is this needed?

VB365 v8 drastically changes many things about it’s infrastructure, especially as it relates to object storage backed repositories. In the past VB365 operated on a 1:many relationship between a proxy and a series of repositories. Each object storage repository had a jetDB based metadata cache that was stored locally on the proxy it was attached to. For many reasons this was inefficient and actually detrimental when providing the service at scale as is done by service providers and large enterprises.

With VB365 v8 the concept of proxy pools is born, where the repositories are now loosely coupled with a given proxy pool, a virtual construct where many proxies can be combined into a pool to split up the work. To support this Veeam needed to rightly throw those JetDB metadata caches in the great dumpster fire in the sky and replace them with databases in a centralized PostgreSQL database.

Like all great intentions in life there are tradeoffs and in the case of VB365 v8 there is a now realized concern where a given environment with hundreds of repositories and tens of proxies, all needing to phone home and update records related to their tasks can be pretty hard on a PSQL server, even when moved to a standalone server and scaled up to dizzying heights. In some cases the Best Practices guide advises [16 vCPU / 64 GB RAM and beyond](https://bp.veeam.com/vb365/guide/design/sizing/postgresql.html).

It is worth noting that since I created this documentation for myself Veeam has since come out with their own variant in the form of [Veeam KB4728](https://www.veeam.com/kb4728) with some notable difference but I’ll still stand by my methodology.

## Step-by-Step Setup Guide

Assume PostgresSQL 15 is already setup on Ubuntu 24.04 LTS and PSQL is running on UDP port 5432.

1. Connect to Postgres and gather information

```shell
  # connect locally
  sudo -u postgres psql
  # get the max connections setting value
  SHOW max_connections;
  # get the SCRAM or MD5 credential value for your interesting users
  SELECT usename,passwd FROM pg_shadow;
  # quit PSQL
  \q
```
2. Install pgbouncer

```shell
sudo apt install pgbouncer</textarea>
```
3. Edit /etc/pgbouncer/pgbouncer.ini to match below

```shell
[databases]
* = host=127.0.0.1 port=5433
;; config DB should be the same as in Config.xml file located in %Programdata%\Veeam\ Backup365 directory
VeeamBackup365 = host=127.0.0.1 port=5433 dbname=VeeamBackup365 pool_size=200

[pgbouncer]
logfile = /var/log/postgresql/pgbouncer.log
pidfile = /var/log/postgresql/pgbouncer.pid
listen_addr = *
listen_port = 6432
unix_socket_dir = /var/run/postgresql
server_tls_sslmode = allow
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist
admin_users = postgres
pool_mode = session
server_reset_query = DISCARD ALL
;; Veeam QA recommendations as of 2025/07/10:
;; max client connections 20,000
max_client_conn = 20000
;; max user connections 800
max_user_connections = 800
;; default pool size 20 - this can be increased later if there will be many errors in VB365 logs 
;;  pgsqlException: Theconnection pool has been exhausted
default_pool_size = 20
;; server idle timeout 60
server_idle_timeout 60
;; server connection timeout 120
server_connect_timeout = 120

;; for less logging
log_connections = 0
log_disconnections = 0
stats_period = 180</textarea>
```
4. Update /etc/pgbouncer/userlist with the output of the SELECT usename,passwd FROM pg\_shadow; lookup in "USERNAME" "PASSWORD" format  
    Example:  
    `"sampleuserwithbadpassword" "SCRAM-SHA-256$4096:CZJPSHyfOj5u0T1sy0CCUw==$VH8DOHJUWTQvPpxSB6Z8gtGTfxaU1UVQF1Wxn/o8rek=:wPiEsVBi5+ihS7fdrn5MEXyiLoKiYCMbti3KtluFWr4="`
5. Add a firewall rule allowing connectivity to the new port

```shell
sudo ufw allow 6432/tcp
```
6. Validation  
    Check that the service is listening

```shell
sudo netstat -tulnp | grep pgbouncer
```
Test the connection with the local PSQL client
```
psql -h 127.0.0.1 -p 6432 -U postgres
```
7. Stop VB365 Services on the controller, update config.xml and proxy.xml, restart services

```
shell# Start Services after 

get-service | where {$_.name -like "Veeam.Archiver*"} | Stop-Service

# Update files through search and replace
$configPath = "C:\ProgramData\Veeam\Backup365\config.xml"
$proxyPath = "C:\ProgramData\Veeam\Backup365\Proxy.xml"
(Get-Content -Path $configPath) -replace "port=5433", "port=6432" | Set-Content -Path $configPath
(Get-Content -Path $proxyPath) -replace "port=5433", "port=6432" | Set-Content -Path $proxyPath

# Start Services after 
get-service | where {$_.name -like "Veeam.Archiver*"} | Start-Service
```
8. Update Proxy.ini/Proxy.xml on any Linux/Windows proxies in the environment  
&gt; proxy.xml on Windows servers

```shell
# Start Services after 
get-service | where {$_.name -like "Veeam.Archiver*"} | Stop-Service
# Update files through search and replace    
$proxyPath = "C:\ProgramData\Veeam\Backup365\Proxy.xml"    
(Get-Content -Path $proxyPath) -replace "port=5433", "port=6432" | Set-Content -Path $proxyPath
# Start Services after 
get-service | where {$_.name -like "Veeam.Archiver*"} | Start-Service
```
proxy.ini on Linux servers
```shell
sudo systemctl stop Veeam.Archiver.Proxy
sudo sed -i.bak 's/port=5433/port=6432/g' /etc/veeam/backup365/proxy.ini
sudo systemctl start Veeam.Archiver.Proxy</textarea>
```
## External Resources

- PGBouncer Config <https://www.pgbouncer.org/config.html>
- VB365 Best Practices Guide<https://bp.veeam.com/vb365/guide/buildconfig/postgresql.html#veeam-backup-for-microsoft-365-postgresql-database-server>
- VCSP SaaS Best Practices Guide <https://bp.veeam.com/sp/SaaS/>
- Veeam KB 4728: <https://www.veeam.com/kb4728>

## Conclusion

While discussion of PGBouncer as it relates to VB365 v8 is new understand that even a year after the release of VB365 v8 we are just now hitting the tipping point where larger deployments are considering this release for protecting the terabytes to petabytes of data they are responsible for. This is due to the much needed but large number of new infrastructure variables this release brings. As those deployments are happening Veeam it working with those customers/providers to iterate quickly on realized performance impacts. Considering the well stated goals by the product team of going to a much quicker, less impactful release cycle get used to there being a constant state of needing to manage these iterations to ensure performant service delivery.