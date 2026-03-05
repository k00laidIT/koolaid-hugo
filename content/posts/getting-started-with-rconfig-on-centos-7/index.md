+++
title = "Getting Started with rConfig on CentOS 7"
date = "2015-11-04T11:16:56Z"
draft = false
tags = [ "config mgmt", "how to", "rConfig", "vDM30in30", "virtualization",]
categories = [ "Networking", "Security", "Systems",]
featureimage = "featured.jpg"
+++


I've been a long time user of [RANCID](http://www.shrubbery.net/rancid/) for change management on network devices but frankly it's always left me feeling a little bit of a pain to use and not particularly modern. I recently decided it was time for my OpenNMS/RANCID server to be rebuilt, moving [OpenNMS](http://www.opennms.org) up to a [CentOS 7](http://www.centos.org) installation and in doing so thought it was time to start looking around for an network device configuration management alternative. As is many times the way in the SMB space, this isn't a task that actual budgetary dollars are going to go towards so off to Open Source land I went! [rConfig](http://www.rconfig.com/) immediately caught my eye, looking to me like RANCID's hipper, younger brother what with its built in web GUI (through which you can actually add your devices), scheduled tasks that don't require you to manually edit cron, etc. The fact that rConfig specifically targets CentOS as its underlaying OS was just a whole other layer of awesomesauce on top of everything else. While rConfig's website has a couple of really nice guides once you create a site login and use it, much to my dismay I found that they hadn't been updated for CentOS 7 and while working through them I found that there are actually some pretty significant differences that effect the setup of rConfig. Some difference of minor (no more iptables, it's firewalld) but it seems httpd has had a bit of an overhaul. Luckily I was not walking the virgin trail and through some trial, error and most importantly google I've now got my system up and running. In this post I'm going to walk through the process of setting up rConfig on a CentOS minimal install with network connectivity with hopes that 1) it may help you, the two reader's I've got, and 2) when I inevitably have to do this again I'll have documentation at hand. Before we get into it I will say there are few artistic licenses I've taken with rConfig's basic setup.

1. I'll be skipping over the network configuration portion of the basic setup guide. CentOS7 has done a great job of having a single configuration screen at install where you setup your networking among other things.
2. The system is designed to run on MySQL but for a variety of reasons I prefer [MariaDB](https://mariadb.com/). The portions of the creator's config guide that deal with these components are different from what you see here but will work just fine if you do them they way described.
3. I'm virtualized kind of guy so I'll be installing the newly supported open-vm-tools as part of the config guide. Of course, if you aren't installing on ESXi you won't be needing these.
4. Finally before proceeding please be sure to go ahead and run a yum update to make sure everything's up to date and you really do have connectivity.
 
 **Disabling Stuff** Even with the minimal installation there are things you need to stop to make things work nice, namely the security measures. If you are installing this in the will this would be a serious no no, but for a smaller shop behind a well configured firewall it should be ok. <span class="lang:sh decode:true crayon-inline ">vi /etc/sysconfig/selinux</span> Once in the file you need to change the "<span class="lang:sh decode:true crayon-inline ">SELINUX=enforcing</span> " line to "<span class="lang:sh decode:true crayon-inline ">SELINUX=disabled</span> ". To do that hit "i" and then use vi like notepad with the arrow keys. When done hit Esc to exit insert mode and "<span class="lang:sh decode:true crayon-inline ">:wq</span> " to save and exit. ```
systemctl disable firewalld.service
systemctl stop  firewalld.service
```
 **Installing the Prerequisites** Since we did the minimal install there are lots of things we need to install. If you are root on the box you should be able to just cut and paste the following into the cli and everything gets installed. As mentioned in the original Basic Config Guide, you will probably want to cut and past each line to make sure everything gets installed smoothly. ```
yum install -y wget mlocate attr open-vm-tools
yum -y install httpd openssl-devel openssl mod_ssl vsftpd
yum -y groupinstall 'Development Tools'
yum -y install telnet bind-utils
yum -y install vixie-cron crontabs
yum -y install mariadb-client mariadb-server  mod_authn_dbd mariadb-devel
```
 **Autostart Services** Now that we've installed all that stuff it does us no good if it isn't running. CentOS 6 used the command chkconfig on|off to control service autostart. In CentOS 7 all service manipulation is now done under the systemctl command. Don't worry too much, if you use chkconfig or service start both at this point will still alias to the correct commands. ```
systemctl enable ntpd.service
systemctl start ntpd.service
systemctl enable httpd.service
systemctl start httpd.service
systemctl enable mysqld.service
systemctl start mysqld.service
systemctl enable vsftpd.service
systemctl start vsftpd.service
systemctl enable crond.service
systemctl start crond.service
```
 **Finalize Disable of SELinux** One of the hard parts for me was getting the step 5/6 in the build guide to work correctly. If you don't do it the install won't complete, but it also doesn't work right out of the box. To fix this the first line in prerequisites installs the attr package which contains the setfattr executable. Once that's installed the following checks to see if the '.' is still in the root directories ACLs and removes it from the /home directory. By all means if you know of a better way to accomplish this (I thought of putting the install in the /opt directory) please let me know in the comments or on twitter. ```
cd /
ll | grep home
**output**  drwxr-xr-x.   2 root root  4096 Sep 23  2011 home
find /home -print0 | xargs -0 -n 1 sudo setfattr -h -x security.selinux
```
 **MySQL Secure Installation on MariaDB** MariaDB accepts any commands you would normally use with MySQL. the mysql\_secure\_installation script is a great way to go from baseline to well secured quickly and is installed by default. The script is designed to - Set root password
- Remove anonymous users
- Disallow root logon remotely
- Remove test database and access to it
- Finally reload the privilege tables
 
 I tend to take all of the defaults with the exception of I allow root login remotely for easier management. Again, this would be a very bad idea for databases with external access. ```
#Verify that MariaDB is running
systemctl status mariadb.service
**output** mariadb.service - MariaDB database server
**output** Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled)
**output** Active: active (running) since
mysql_secure_installation
```
 Then follow the prompts from there. As a follow up you may want to allow remote access to the database server for management tools such as Navicat or Heidi SQL. To do so enter the following where X.X.X.X is the IP address you will be administering from. Alternatively you can use root@'%' to allow access from anywhere. <div class="consoleBlock"> ```
mysql -u root -p
***output*** password:
mysql> GRANT ALL ON *.* to root@'X.X.X.X' IDENTIFIED BY 'your-root-password';
mysql> FLUSH PRIVILEGES;
```
 **Configure VSFTPd FTP Software** ```
 # Install VSFtpd and configure it
 mv /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.original
 echo "#Custom rConfig VSFTPD conf file" > /etc/vsftpd/vsftpd.conf;
 echo "anonymous_enable=NO" >> /etc/vsftpd/vsftpd.conf;
 echo "listen=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "local_enable=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "write_enable=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "local_umask=022" >> /etc/vsftpd/vsftpd.conf;
 echo "dirmessage_enable=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "xferlog_enable=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "connect_from_port_20=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "xferlog_std_format=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "pam_service_name=vsftpd" >> /etc/vsftpd/vsftpd.conf;
 echo "userlist_enable=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "tcp_wrappers=YES" >> /etc/vsftpd/vsftpd.conf;
 echo "idle_session_timeout=600" >> /etc/vsftpd/vsftpd.conf;
 echo "data_connection_timeout=120" >> /etc/vsftpd/vsftpd.conf;
 echo "ftpd_banner=Welcome to the FTP Service" >> /etc/vsftpd/vsftpd.conf;
echo "ls_recurse_enable=YES" >> /etc/vsftpd/vsftpd.conf;

systemctl enable vsftpd.service
systemctl start vsftp.service
```
 Now that we've got the basics of setting up the OS and the underlying applications out of the way let's get to the business of setting up rConfig for the first time. First we need to edit the sudoers file to allow the apache account access to various applications. Begin editing the sudoers file with the <span class="lang:sh decode:true crayon-inline ">visudo</span> command, arrow your way to the bottom of the file and enter the following: ```
apache  ALL = (ALL) NOPASSWD: /usr/bin/crontab, /usr/bin/zip, /bin/chmod, /bin/chown, /usr/bin/whoami
Defaults:apache !requiretty
```
 **rConfig Installation** First you are going to need to download the rConfig zip file from their website. Unfortunately the website doesn't seem to work with wget so you will need to download it to a computer with a GUI and then upload it via SFTP to your rConfig server. (ugh) Once the file is uploaded to your /home directory back at your server CLI do the following commands ```
cd /home
unzip rconfig-3.0.3.zip    #3.0.3 is the latest version at time of writing, this may differ for you.
chown -R apache /home/rconfig
```
 Next we need to copy the the httpd.conf file over to /etc/httpd/conf directory. This is where I had the most issues of all in that the conf file included is for httpd in CentOS 6 and there are some module differences between 6 and 7. Attached here is a modified version that I was able to get working successfully after a bunch of failures. The file found here ([httpd.txt](httpd.txt)) will need to replace the existing httpd.conf before the webapp will successfully start. If the file is copied to the /home/rconfig directory the shell commands would be ```
mv /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.original

cp /home/rconfig/httpd.txt /etc/httpd/conf/httpd.conf

systemctl start httpd.service
```
 As long as the httpd service starts backup up correctly you should now be good to go with the web portion of the installation which is pretty point and click. Again for the sake of brevity just follow along at the [rconfig installation guide](http://www.rconfig.com/rconfig-support/guides/35-rconfig-installation-guide) starting with section rConfig web installation and follow along to the end. We'll get into setting up devices in a later post, but it is a pretty simple process if you are used to working with networking command lines. </div>