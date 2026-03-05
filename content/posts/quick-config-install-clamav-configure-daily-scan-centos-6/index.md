+++
title = "Quick Config: Install ClamAV &#038; configure a daily scan on CentOS 6"
date = "2015-03-03T11:52:04Z"
draft = false
tags = [ "how to", "linux", "security",]
categories = [ "Security", "Systems",]
featureimage = "featured.png"
+++


I'm pretty well versed in the ways of Anti-Virus in Windows but I've wanted to get an AV engine installed on my Linux boxes for a while now. In looking around I've found a tried and true option in [ClamAV](http://www.clamav.net/index.html) and after a few stops and starts was able to get something usable. I'd still like to figure out how to have it send me a report by e-mail if it finds something but that's for another day; I don't have enough Linux in my environment to necessitate me putting the time in for that. So with that here's how to quickly get started. Step 0: If not already there, install the EPEL repository

```
sudo yum install epel-release -y
```
 Step 1: Install ClamAV ```
sudo yum install clamav clamd -y
```
 Step 2: Perform the 1st update of ClamAV definitions (this will happen daily by default afterwards) ```
sudo /usr/bin/freshclam
```
 Step 3: Enable and Start Services ```
sudo chkconfig clamd on
sudo service clamd start
```
 Step 4: Configure Daily Cron Job I chose to have it scan the whole system and only report infected files, you may want to do differently ```
sudo vi /etc/cron.daily/daily_clamscan
```
 Enter the following: ```
#!/bin/bash
SCAN_DIR="/"
LOG_FILE="/var/log/clamav/daily_clamscan.log"
/usr/bin/clamscan -i -r $SCAN_DIR >> $LOG_FILE
```
 Note the -i option tells it to only return infected files, the -r tells it to recursively search. You may want to add the --remove option as well to remove files that are seen as infected. Step 6: Make Cron Job Executable ```
sudo chmod +x /etc/cron.daily/daily_clamscan
```
 You can then kick of a manual scan if you'd like using ```
sudo /etc/cron.daily/daily_clamscan
```
 That's it! pretty simple and all of your output will be logged daily to the /var/log/clamav/daily\_clamscan.log file for review.