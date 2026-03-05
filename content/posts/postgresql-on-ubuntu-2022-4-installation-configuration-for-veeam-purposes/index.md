+++
title = "PostgreSQL on Ubuntu 2022.4 Installation &#038; Configuration for Veeam Purposes"
date = "2024-03-14T15:57:12Z"
draft = false
tags = [ "how to", "linux", "postgres", "veeam",]
categories = [ "Systems", "Veeam",]
featureimage = "featured.png"
+++


For no reasons whatsoever I find myself working quite a bit with the recent integrations of Veeam products with PostgreSQL, letting it function as the underlying database server for 1 (or more) Veeam products. Postgres as well as the Linux aspect are interesting for highly scaled environments both because it's powerful but also, frankly, because it's cheap.

In this post I'll quickly walk through my golden set of instructions for deploying, configuring and optimizing a PostgreSQL 16 server (latest version) for use with Veeam Backup &amp; Replication.

1. **Configure encrypted connections over TLS via instructions at https://www.postgresql.org/docs/current/ssl-tcp.html**
2. **Import PostgreSQL repo and install from apt**  
    `# Create the file repository configuration:`  
    `sudo sh -c 'echo "deb` https://apt.postgresql.org/pub/repos/apt `$(lsb_release -cs) \ `  
    `-pgdg main" > /etc/apt/sources.list.d/pgdg.list'`  
    `# Import the repository signing key:`  
    `wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`  
    `# Update the package lists and install the latest version of PostgreSQL:`  
    `sudo apt update && apt install postgresql`  
    `# If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':`
3. **Set a password for the default postgres account**  
    `sudo -u postgres psql`  
    `ALTER USER postgres PASSWORD 'myPassword';`  
    `ALTER ROLE #this should be valid response`  
    `\q #exit postgres`
4. **Allow remote connections**  
    `#edit the service conf file. number aligns to installed version`  
    `sudo vim /etc/postgresql/16/main/postgresql.conf`  
    `#look for #listen_addresses = 'localhost' line. uncomment and set it equal to '*'`  
    `listen_addresses = '*'`  
    `#edit the hba conf file. number aligns to installed version`  
    `sudo vim /etc/postgresql/16/main/pg_hba.conf`  
    `# Find the "IPv4 local connections" section and modify following line to 0.0.0.0/0. Alternatively this can be set to just the VB365 Server IP.`  
    `# IPv4 local connections:`  
    `host all all 0.0.0.0/0 scram-sha-25`  
    `# restart postgresql service`  
    `systemctl restart postgresql`  
    `#modify firewall policy to allow UDP port 5432`  
    `ufw allow 5432/udp`
5. **Test installation by using pgadmin4 from VBR or VB365 server to connect to server using created credentials and fqdn:5432**
6. Install Veeam Backup &amp; Replication using the PostgreSQL as the existing database Instance.
7. Use [Set-VBRPSQLDatabaseServerLimits](https://helpcenter.veeam.com/docs/backup/powershell/set-vbrpsqldatabaseserverlimits.html?ver=120) to optimize the Postgres configuration for the size of the DB VM.  
    `# For a 8 vCPU, 16 GB RAM Linux server your cmd string should look like<br></br>Set-VBOPSQLDatabaseServerLimits -OSType Linux -CPUCount 8 -RamGb 16 \`  
    `-DumpToFile "C:\temp\PSqlLimitConfig.sql"`
8. Execute your created script on the DB server  
    sudo -u postgres -f "/tmp/PSqlLimitConfig.sql"

That's it! To me it's not horribly hard to do to not find myself paying for an extra Windows Server and Microsoft SQL license. Enjoy!