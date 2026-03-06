+++
title = "Fixing the SSL Certificate with Project Honolulu"
date = "2018-03-09T10:26:19Z"
draft = false
tags = [ "certificates", "how to", "microsoft", "powershell", "Project Honolulu", "security",]
categories = [ "Security", "Systems",]
featureimage = "featured.png"
+++


So if you haven't heard of it yet Microsoft is doing some pretty cool stuff in terms of Local Server management in what they are calling [Project Honolulu](https://blogs.technet.microsoft.com/servermanagement/2018/03/01/1802-update-to-project-honolulu-technical-preview-is-now-available/). The latest version, 1802, was released March 1, 2018, so it is as good a time as any to get off the ground with it if you haven't yet. If you've worked with Server Manager in versions newer than Windows Server 2008 R2 then the web interface should be comfortable enough that you can feel your way around so this post won't be yet another "cool look at Project Honolulu!" but rather it will help you with a hiccup in getting it up and running well. I was frankly a bit amazed that this is evidently a web service from Microsoft not built upon IIS. As such your only GUI based opportunity to get the certificate right is during installation, and that is based on the thumbprint at that, so still not exactly user-friendly. In this post, I'm going to talk about how to find that thumbprint in a manner that copies well (as opposed to opening the certificate) and then replacing the certificate on an already up and running Honolulu installation. Giving props where they do this post was heavily inspired by [How to Change the Thumbprint of a Certificate in Microsoft Project Honolulu](https://charbelnemnom.com/2017/10/how-to-change-the-thumbprint-of-a-certificate-in-microsoft-project-honolulu-servermgmt-servermgmt/) by [Charbel Nemnom](https://twitter.com/CHARBELNEMNOM). **Step 0: Obtain a certificate:** A good place to start would be to obtain or import a certificate to the server where you've installed Project Honolulu. If you want to do a public one, fine, but more likely you'll have a certificate authority available to you internally. I'm not going to walk you through this again, my friend [Luca Dell'Oca](https://twitter.com/dellock6) has a [good write up on it here](https://www.veeam.com/blog/generate-and-install-ssl-certificates-on-microsoft-windows.html). Just do steps 1-3. \[caption id="attachment\_724" align="alignright" width="150"\][

{{< figure src="honolulu_cert_appid.png" alt="" >}}

](honolulu_cert_appid.png) Make note of the Application ID here, you'll use it later\[/caption\] **Step 1: Shut it down and gather info:** Next we need to shut down the Honolulu service. As most of what we'll be doing here today is going to be in Powershell let's just do this by CLI as well.

```
Get-Service *Gateway | Stop-Service
```
 Now let's take a look at what's currently in place. You can do this with the following command, the output should look like the figure to the right. The relevant info we want to take note of here is 1) The port that we've got Honolulu listening on and 2) The Application ID attached to the certificate. I'm just going to reuse the one there but as Charbel points out this is generic and you can just generate a new one to use by[ using a generator](https://guidgenerator.com/online-guid-generator.aspx). ```
netsh http show sslcert
```
 \[caption id='attachment\_726' align='alignright' width='150'\][

{{< figure src="honolulu_cert_posh.png" alt="" >}}

](honolulu_cert_posh.png) Pick a cert, not any cert\[/caption\] Finally, in our quest to gather info let's find the thumbprint of our newly loaded certificate. You can do this by using the Get-ChildItem command like this ```
Get-ChildItem -path cert:\LocalMachine\my
```
 As you can see in the second screenshot that will give you a list of the certificates with thumbprints installed on your server. You'll need the thumbprint of the certificate you imported earlier. **Step 2: Make it happen:** Ok now that we've got all our information let's get this thing swapped. All of this seems to need to be done from the legacy command prompt. First, we want to delete the certificate binding in place now and the ACL. For the example shown above where I'm using port 443 it would look like this: ```
cmd
netsh http delete sslcert ipport=0.0.0.0:443
netsh http delete urlacl url=https://+:443/
```
 Now we need to put it back into place and start things back up. Using the port number, certificate thumbprint, and appid from our example the command to re-add the SSL certificate would look like this. You, of course, would need to sub in your own information. Next, we need to put the URL ACL back in place. Finally, we just need to start the service back up from PowerShell. ```
netsh http add sslcert ipport=0.0.0.0:443 certhash=C9BB91F7D8755BD217444046A7E68CEF56E15717 appid={1fb046ab-09b5-4029-9ec5-6e17002d495f}
netsh http add urlacl url=https://+:443/ user="NT Authority\Network Service"
Get-Service *Gateway | Start-Service
```
 **Conclusion** At this point, you should be getting a shiny green padlock when you go the site and no more nags about a bad certificate. I hope as this thing progresses out of Tech Preview and into production quality this component gets easier but at least there's a way.