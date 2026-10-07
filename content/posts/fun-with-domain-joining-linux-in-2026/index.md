+++
title = "Fun With Domain Joining Linux in 2026"
date = "2026-10-07T00:00:00-05:00"
draft = false
tags = ["linux", "how to", "active directory", "sssd", "ubuntu", "rocky linux"]
categories = ["Systems"]
featureimage = "featured.png"
+++

Who doesn't like having a single plane of user and computer management? I for one do and since the beginning of time, well at least for a very long time, Active Directory has been that tool that most reach for when that's the desired outcome. As a Microsoft technology designed around Windows Servers and Workstations it's always worked very well in that area; install windows, join domain and then everything "just works." On the other hand my memory of how this went was something like this:

{{< youtube 8LsxmQV8AXk >}}

Samba had to get installed, dependencies had to be reckoned, shenanigans had to be had and sometimes it even worked afterwards! In any case it was never easy and wasn't exactly a streamlined workflow.

Today though I've been looking at what the current state is for this, specifically with the latest versions of [Ubuntu](https://canonical.com/blog/canonical-releases-ubuntu-26-04-lts-resolute-raccoon) and [Rocky](https://rockylinux.org/download) Linux and I have to say it's a wildly different situation these days. This new flexibility comes from [SSSD](https://sssd.io/index.html), or System Security Services Daemon. This background service is present in virtually all major distros and is both open source and vendor neutral. While it supports other platforms such as vanilla LDAP and other IdPs we're just going to look at the Active Directory integration.

Let's take a look at what this looks like in reality. Much like all good things that we've learned from [Special Agent Oso](https://www.disneyplus.com/browse/entity-a98f93f9-9553-48aa-ae30-9d944ac20f36) it can be done in 3(ish) simple steps. We will have the following standard goals for our domain join behavior:

- Join domain
- AD users who login have home directories created
- Computer Accounts go into a particular Organizational Unit
- Computers will dynamically register their computer names in Microsoft DNS

## SSSD on Ubuntu 26.04

Nicely documented in the [Ubuntu Docs](https://ubuntu.com/server/docs/how-to/sssd/with-active-directory/) but here's my take (now with home directories!) One thing I'll add is the Kerberos integration requires every instance of the domain/realm name to be done in all caps or else it will error.

1. Install dependencies and verify networking

   ```bash
   sudo apt install sssd-ad sssd-tools realmd adcli -y

   # Discover realm to test connectivity to AD infrastructure
   sudo realm discover KOOLAID.SITE -v
   ```

2. Join your domain

   ```bash
   # Join domain.local and place computer in an OU
   sudo realm join -U administrator@DOMAIN.LOCAL DOMAIN.LOCAL --computer-ou "OU=linuxServers,OU=labOU,DC=domain,DC=local" --verbose
   ```

3. Modify sssd.conf for Dynamic DNS support

   Write the following under your [domain/domain.local] section of /etc/sssd/sssd.conf.  then restart SSSD with `sudo systemctl restart sssd`

   ```ini
   dyndns_update = true
   dyndns_refresh_interval = 600
   dyndns_update_ptr = true
   dyndns_ttl = 3600
   ```

4. Enable PAM support for creating home directories

   ```bash
   sudo pam-auth-update --enable mkhomedir
   ```

## SSSD on Rocky 10.2 (similar for other RHEL variants)

Once again, there are [good docs available](https://docs.rockylinux.org/10/guides/security/authentication/active_directory_authentication/) on this but here are my steps:

1. Install dependencies and verify networking

   ```bash
   sudo dnf install realmd oddjob oddjob-mkhomedir sssd adcli krb5-workstation
   sudo systemctl enable oddjobd.service --now
   sudo systemctl start oddjobd

   # Discover realm to test connectivity to AD infrastructure
   sudo realm discover KOOLAID.SITE -v
   ```

2. Join your domain

   ```bash
   # Join domain.local and place computer in an OU
   sudo realm join -U administrator@DOMAIN.LOCAL DOMAIN.LOCAL --computer-ou "OU=linuxServers,OU=labOU,DC=domain,DC=local" --verbose
   ```

3. Modify sssd.conf for Dynamic DNS support

   Write the following under your [domain/domain.local] section of /etc/sssd/sssd.conf.  then restart SSSD with `sudo systemctl restart sssd`

   ```ini
   dyndns_update = true
   dyndns_refresh_interval = 600
   dyndns_update_ptr = true
   dyndns_ttl = 3600
   ```

## Conclusion

And that's it! Now we've got more enterprise-y with our Linux server management. This can also be [done via Ansible](https://oneuptime.com/blog/post/2026-02-21-how-to-use-ansible-to-set-up-centralized-authentication-ldap/view) if you want to do the thing more consistently or across multiple machines. In any case I'm happy to see this process get much simpler.
