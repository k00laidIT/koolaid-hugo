+++
title = "Deploying NATS.io for VB365 with Podman"
date = "2024-12-03T08:31:06Z"
draft = false
tags = [ "container", "how to", "nats", "podman", "v8", "VB365", "Veeam Vanguard",]
categories = [ "Automation", "Veeam",]
featureimage = "featured.png"
+++


With the release of [Veeam's Backup for Microsoft365 version 8](https://www.veeam.com/products/saas/backup-microsoft-office-365/latest-release.html) Veeam has begun the move to a more distributed and cloud native approach to supporting the product. The end result is the capability known as proxy pools, where you can create a pool of worker VMs, or proxies, that jobs can have many object storage backed repositories assigned to it and then jobs can load balance across the entire pool for processing. This is different from the previous architecture in that the relationship was both job&gt;repository and repository&gt;proxy, greatly effecting the scale out nature. To make this end result happen Veeam has looked to open source solutions such as [nats.io](https://nats.io/) and [PostgreSQL](https://www.postgresql.org/) to make it happen. By default this all is installed on the VBO server itself.

For SMBs with a few hundred users the standard click, click next approach is still completely valid, but for those of us supporting larger enterprises or service providers with thousands of users and sites this installation does not hold up. To support these use cases it makes far more sense to split both Postgres and NATS to their own Linux-based instances or VMs. While Postgres is well known and widely documented how to use, it's used by a number of enterprise infrastructure products such as VMware vCenter Applliance, Cloud Director and even Veeam's own Backup and Replication server, NATS is relatively new to the scene and has great many ways to deploy and manage it.

At this time the recommendation from Veeam is to deploy a single, well-sized NATS server as opposed to a cluster as the clustering is observed to slow it's queue processing down significantly. Beyond that, some general guidance around environmental variables when in a shared installation, and general sizing information there isn't necessarily a best practice to how to deploy it. In terms of requirements for NATS Veeam requires that Jetstream be enabled and prefers that the client\_advertise parameter be defined as the host name for the server.

One way to consider deploying the nats service on it's own is by using [podman](https://podman.io/) within a VM or instance. Podman is nice because while it works quite like docker it allows for process isolation and allow for containers to be run like general Linux services and managed as such. Through a bit of trial and error and with great assistance from my friend and all around guru [Welby McRoberts](https://www.whmcr.com) we've arrived at the following process for getting podman-powered nats for VB365 off the ground and working.

### **Install and Setup**

```bash
# For optimal usage requires Ubuntu 24.04 LTS
sudo apt install podman
sudo mkdir /opt/containers/nats/config
sudo mkdir /etc/containers/systemd
sudo vim /etc/containers/systemd/nats.container # see below for file data
sudo vim /opt/containers/nats/vbo-nats.conf # see below for file data
sudo systemctl daemon-reload
sudo systemctl start nats
```
### **Files**

#### /etc/containers/systemd/**nats.container:**

```ini
[Unit]
Description=nats
After=network-online.target

[Container]
Image=docker.io/library/nats
HostName=nats1
Label=io.containers.autoupdate=registry
Volume=/opt/containers/nats/config/:/etc/nats/
PublishPort=8222:8222
PublishPort=4222:4222
<strong>#note: edit the below to the hostname of your nats server</strong>
Environment=CLIENT_ADVERTISE=nats1.mydomain.com:4222
Exec=-c /etc/nats/vbo-nats.conf

[Service]
Restart=always

[Install]
WantedBy=multi-user.target default.target
```
#### /opt/containers/nats/**vbo-nats.conf:**

```ini
# For VB365 we need NATS.IO for task queueing. The service must have jetstream enabled

# General settings
host: 0.0.0.0
port: 4222
http_port: 8222
server_name: nats1
client_advertise: $CLIENT_ADVERTISE

# jetstream settings
jetstream: enabled
jetstream {
  store_dir = /etc/nats/nats-server
  # Use a domain suitable for your environment
  domain    = vnats
}

# account settings
accounts {
    # List of accounts and user within accounts
    # User may have an authorization and authentication section
    #
    $SYS {
     users = [
       { user: admin,
         pass: "myadminpass"
       }
     ]
    }
    vb365 {
     jetstream: enabled
     users = [
       { user: vnats,
         pass: "myvbopass"
       }
     ]
   }
}
```
### Management 

**Verification**

```bash
sudo systemctl status nats

sudo podman run --rm -it docker.io/natsio/nats-box nats pub -s "nats://nats1.mydomain.com:4222" hello --user vnats --password 'vbopass'

sudo podman run --rm -it docker.io/natsio/nats-box nats server info -s "nats://nats1.mydomain.com:4222" --user admin --password 'adminpass'
```
**Restarting the NATS service**

```bash
sudo systemctl restart nats
```
**Update management**

**Auto update**

1. Add Label=io.containers.autoupdate=registry to the \[Container\] portion of the nats.container file
2. Enable the auto update timer for podman via
3. sudo systemctl enable podman-auto-update.timer

**Manual update**

Run

```bash
sudo podman pull $(podman ps --format "{{.Image}}" -f name=systemd-nats | head -n 1) && systemctl restart nats
```
## Conclusion

And that's it. You now have a nats service up and running on a dedicated Ubuntu 24.04 host with automatic updating enabled and configured to support Veeam Backup for Microsoft365 v8. There are some other nice tools to investigate as I am doing now such as the native nats client and nats-top but I'll leave those to you or for another time. Until then, happy queueing?