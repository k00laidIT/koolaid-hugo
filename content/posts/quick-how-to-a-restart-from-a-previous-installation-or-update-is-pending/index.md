+++
title = "Quick How To: A restart from a previous installation or update is pending."
date = "2015-10-19T10:33:39Z"
draft = false
tags = [ "how to", "Printing Sucks", "tech horror", "Windows",]
categories = [ "Systems",]
featureimage = "featured.jpg"
+++


Just a quickie from an issue I ran into today trying to upgrade vCenter 5.5 to Update 3, or at least the SSO component of it. Immediately after running the installer I was presented with an MSI error "A restart from a previous installation or update is pending. Please restart your system before you run vCenter Single Sign-On installer." Trying to be a good little SysAdmin I dutifully rebooted, repeatedly, each having no effect on the issue. I've seen different versions of this error in the past so I had an idea of where to go but it seems to require googling each time. This is caused by there being data present in the "PendingFileRenameOperations" value of the HKEY\_LOCAL\_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager key. Simply checking this key and clearing out any data within will remove the flag and allow the installation to proceed. In this case I had an HP print driver doing what they do best and gumming up the works. I'd love to say this is the first time I've been done in by a print driver but you all would know I'm lying. :)