+++
title = "Increase Max Attachment Size in Outlook 2007 SP2 and Above"
date = "2014-05-20T10:05:29Z"
draft = false
tags = [ "office", "outlook", "tech horror",]
categories = [ "Systems",]
featureimage = "featured.jpg"
+++


Let me start by saying I feel very dirty for even writing this. My basic rule in life is if the file is bigger than 2 MB, it isn't to be sent as an attachment to an e-mail. That said, many do not share my opinion on that and here at the office we recently had an occasion where a 200 MB file absolutely had to be e-mailed, it could be sent no other way. A couple of years ago I wrote a post on <span class="scayt-misspell-word" data-scayt-word="4sysops">4sysops</span> about how to change this in Exchange, so I thought that was an easy fix. Instead the user continued to see this: [

{{< figure src="maxattach.jpg" alt="maxattach" >}}

](maxattach.jpg)After some <span class="scayt-misspell-word" data-scayt-word="Googling">Googling</span> I found a forum post saying that not only was a hard limit of 50 MB a feature of Outlook 2010 and above, but that this feature had been added to Outlook 2007 with Service Pack 2. The good news/ bad news is that this feature can be over ridden by registry hack. Below is the code that you can copy into a .reg file and execute to insert the required registry key. Know that this is version specific the "12.0" portion below corresponds to Office 2007, you will need to be changed based on your version of Microsoft Office. For reference 2010 will be 14.0 and 2013 is 15.0.

```
[reghack]Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Office\12.0\Outlook\Preferences]

“MaximumAttachmentSize”=dword:00300000[/reghack]
```