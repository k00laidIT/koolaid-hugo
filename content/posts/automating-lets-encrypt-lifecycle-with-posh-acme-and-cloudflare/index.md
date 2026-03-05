+++
title = "Automating Let&#8217;s Encrypt Lifecycle with Posh-Acme and Cloudflare"
date = "2024-11-15T13:04:00Z"
draft = false
tags = [ "certificates", "cloudflare", "let's encrypt", "poshacme", "powershell",]
categories = [ "Automation", "Security", "Service Provider",]
featureimage = "featured.png"
+++


I find I often want to create real certificates for either internal or testing use cases. While I could either use self-signed certificates (eww) or spin up my own certificate management system (ain't nobody got time for that) the fine folks at Let's Encrypt and the [Posh-ACME](https://poshac.me/docs/latest/) Powershell module/ [ACME](https://datatracker.ietf.org/doc/html/rfc8555) client have created a mechanism where through [integrated DNS plugin providers](https://poshac.me/docs/v4/Plugins/) Let's Encrypt certificates can be generated when they don't track back to a publicly facing DNS record. In this post we'll walk through how to create the certificates and semi-automatically manage the lifecycle of the certificate.

### Creating a DNS Record

We need to start by creating a DNS record in cloudflare that aligns to the host name we want to create a certificate for because that's how [Let's Encrypts DNS validation](https://letsencrypt.org/docs/challenge-types/) works. [Cloudflare](https://cloudflare.com) by it's very nature is different from other providers in that it provides the option to proxy queries through their global service, allowing for security and other services to be applied in the process. It's worth noting that some use cases may not work well with this capability so to keep it simple you can turn it off or on based on your need.

1. To create the record in Cloudflare click on your desired managed domain name under your Account Home page and navigate to DNS &gt; Records.
2. Under the DNS management section click Add record and add your record type as needed. If you need more information than this I'll refer you to this [excellent primer](https://wizardzines.com/comics/dns-records/) by [Julia Evans](https://bsky.app/profile/b0rk.jvns.ca).
3. Save your newly added record

{{< figure src="image-1.png" alt="Cloudflare DNS record editor showing an A record for dal32-vbo8 with proxy status set to Proxied" >}}

### Create Cloudflare API Token

Next we need to create an API token in Cloudflare for your uses. While you can use the Global API token for your account this is far from a best practice, you should instead create an API token for each use case.

1. Login to Cloudflare as an account administrator
2. Navigate to Manage Account &gt; Account API Tokens
3. Click Create Token
4. Click "Use template" by Edit zone DNS
5. Leave defaults for all except in Zone resources set to desired state. Easiest is Include + All zones from an account + Account name
6. Click Continue to summary and then create token
7. Capture your created token and save securely. You'll use this later.

{{< figure src="image.png" alt="Cloudflare Account API Tokens page showing an Edit zone DNS API token summary scoped to all zones with DNS:Edit permissions" >}}

### Install the Posh-ACME module

Next it's time we switch over to powershell to have some fun. All tasks we do from here on out **must be done** in an administrative powershell session so be sure to launch it as Administrator. Let's start by installing the module itself.

```powershell
# If first time installing a module on the instance you have to trust the PSGallery repository
Set-PSrepository -name PSGallery -InstallationPolicy Trusted

# Install the module without prompts
Install-module posh-acme -confirm:$false
```

### Create a new certificate

Now that your module has been installed we can get at actually creating a certificate. This can totally be put into a function with parameters but as I find i only have to do it once per machine I just haven't.

```powershell
# you need to supply a email later the first time you create a certificate for a domain, i just always do it with a variable
$CFemail = "me@me.com"

# supply the hostname that matches the record you created at cloudflare
$hostname = "dal32-vbo8.domain.com"

# supply your API token created above as a secure string within the $pArgs hash table. This will have the effect of prompting you to type or paste your token into the screen.
$pArgs = @{
    CFToken = (Read-Host 'API Token' -AsSecureString)
}

#this string will create the certificate and install it automatically into the Windows certificates store
New-PACertificate $hostname -Plugin Cloudflare -PluginArgs $pArgs -Install -AcceptTOS -Contact $CFemail -Force
```

### Automate renewals

Let's Encrypt certificates are only valid for 3 months at a time so you'll need to renew them regularly (just like any other certificate). PoshACME does make this simple through use of the Submit-Renewal cmdlet. For a standard use where there is only one or a handful of certificates created on a given VM you can simply use the following:

```powershell
Submit-Renewal -AllOrders
```

Further as always a renewal doesn't just extend the date on the existing certificate, it creates a new one. PoshACME doesn't have an automated clean up mechanism but this can be easily handled through a little bit of scripting.

```powershell
#Get all expired certificates
$expiredCerts = Get-ChildItem -Path Cert:\LocalMachine -Recurse | Where-Object {$_.NotAfter -lt (Get-Date) -and $_.Issuer -like "*O=Let's Encrypt*"}

#Remove expired certificates
foreach ($cert in $expiredCerts) {
    Remove-Item -Path $cert.PSPath -Force
}
```

Finally all of this can be put into a Scheduled Windows task to run every 80 days to automate renewal. The task does need to run under the user name used to run create the certificate since the configuration is stored in the local user profile. Do keep in mind that this doesn't cover off the installation of the certificate to whatever application (IIS, Veeam Cloud Connect, etc.) you are using to consume the certificate so you may want to build that into your scheduled task as well.