+++
title = "Two Simple Ways To Immutability With Synology"
date = "2024-10-24T13:42:36Z"
draft = false
tags = [ "how to", "storage", "synology",]
categories = [ "Storage",]
featureimage = "featured.png"
+++


In today's data protection world the ability to write data with periodic immutability is the golden ring that everybody reaches for. This is because we are long past the days where the biggest threat to our data as it lives in production is physical disaster, today's disaster is ransomware, malware, deletion or any other form of data security. If you are unfamiliar with the term immutability in the sense of data storage means that once data is written that through some means it is virtually impossible to change or remove it until a defined period of time elapses.

There are many paths to get to this immutability standard. Most often you hear about it in the concept of object lock for object storage platforms but there are ways to achieve immutability with more traditional storage methodologies as well. In this post I'll explore 3 ways you can easily make your data on Synology storage arrays immutable both locally and when you move it to the cloud.

## Immutable Share

The first and most common method you may consider for standard NAS file share usage such as a folder where you store your pictures and such to is to set a share with Write Once, Read Many (WORM) protection which is an earlier form of immutability. It is worth noting that this feature is only compatible with volumes formatted with BTRFS so be sure to check that. Let's walk through this quickly.

First start creating or editing a shared folder as normal. While I have the recycle bin enabled here be aware that it will not be compatible with WORM and will be disabled later.

{{< figure src="image-19.png" alt="" >}}

In the next screen we can enable Synology's [WriteOnce](https://kb.synology.com/en-in/WP/WriteOnce_White_Paper/1) feature, their implementation of WORM.

{{< figure src="image-20.png" alt="" >}}

As mentioned as soon as you enable WriteOnce it will prompt you to disable the Recycle Bin. Click Yes to continue.

{{< figure src="image-21.png" alt="" >}}

Now we get into the interesting bits. On the WriteOnce implementation screen that will look familiar to anybody used to working with object lock. First off WriteOnce defaults to Enterprise mode, which is nice but any named administrator account can override the immutability. This is equivalent in object world of [Governance Mode](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) and while it may sound fine is not optimal in a product set where most devices are only ever set up with a single, administrative user.

Next we want to enable AutoLock. While you can play with the Timer I would recommend you set it to immediately and then lower the retention from the default of 3 years to something manageable. In my experience 90 days is a sufficient period to get through many security use cases.

Finally in regards to Lock state if you are primarily working with documents it may be optimal to leave the default of append-only, allowing files to grow but never deleted or shrunk. I am going to use Immutable here though.

{{< figure src="image-3.png" alt="" >}}

While there are other settings past this you can keep the defaults here. I would advise if you use Enterprise mode that you create a non-administrative user (or more than one!) and enable MFA on your admin user to protect that data.

## Immutable Snapshots

The next way to make use of immutability with Synology arrays is by enabling immutable snapshots. While it's oddly buried in the Snapshot Replication app on the array, Synology supports making local snapshots of both Shared Folders and LUNs immutable for a given period.

So what does this mean? Where in the above the files you write to the shared folder are themselves immutable, sometimes leading to mixed results as users gets involved, with immutable snapshots you can take a regularly scheduled snap of the storage container and make that thing itself immutable. This means the folder can change and work as a user might expect but on a daily or maybe even hourly basis you are protecting that data from widespread deletion.

While the settings are the same for enabling this on a LUN (what you would use with NFS or iSCSI) let's what through what that looks like for a shared folder.

If not present you may need to start with installing the 'Snapshot Replication' application from the Synology Package Center. I won't walk through that but know it exists.

Once you launch the Snapshot Replication app navigate to the Snapshots menu item. From here you can see a set of lists of shared folders and LUNs and their protection status. To enable immutable local snapshots click on a storage container and then choose settings.

{{< figure src="image-30.png" alt="" >}}

In your settings you'll need to enable a schedule and the define as desired. Below is an example of running a simple daily snapshot that is protected for 7 days. While with immutable shared folders we could set long term immutability know that with snapshots you hit the maximum at 30 days and [Synology's recommendation](https://kb.synology.com/en-us/DSM/tutorial/what_is_an_immutable_snapshot#x_anchor_id9699dcd945) is 7-14 days.

{{< figure src="image-31.png" alt="" >}}

Next if you click the retention tab along the top you will want to enable a retention policy, otherwise it will continue to accrue until you delete or run out of space. This is truly a choose what is best for you in terms of choosing between number to keep or keep for so many days, but if you are doing more than 1 a day be mindful of the math if you choose the first option.

{{< figure src="image-32.png" alt="" >}}

{{< figure src="image-34.png" alt="" >}}

## Conclusion

As you can see achieving immutability within a Synology array is both possible and easy to implement. If you work with these storage devices I encourage you to look at what they are doing these days in this regard and leverage these capabilities to make your data better protected.