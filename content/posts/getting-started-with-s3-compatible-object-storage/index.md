+++
title = "Getting Started With S3 Compatible Object Storage"
date = "2022-02-02T11:21:59Z"
draft = false
tags = [ "ceph", "how to", "iland", "object storage", "veeam",]
categories = [ "Systems", "Uncategorized", "Veeam",]
featureimage = "featured.png"
+++


Recently a good portion of my day job has been focused on learning and providing support for s3 compatible object storage? What is s3 compatible you say? So while Amazon's AWS may have created the [s3 platform](https://aws.amazon.com/s3/) at its root today is an open framework of API calls and commands known as s3. While AWS s3 and its many iterations are the 5000 pound gorilla in the room many other organizations have created either competing cloud services or storage systems that can let you leverage the technology in your own environments.

So why am I focusing on this you may ask? Today we are seeing more and more enterprise/cloud technologies have reliance on object storage. Any time you even think of mentioning Kubernetes you are going to be consuming object. In the Disaster Recovery landscape we've had the capability for a few years now to provide our archive or secondary copies of data to object "buckets" as it is both traditionally cheaper than other cloud based file systems and provided a much larger feature set. With their upcoming v12 release Veeam is going to be providing the first iteration of their Backup &amp; Replication product that can write directly to object storage with no need to have the first repository be a Windows or Linux file system.

To specifically focus on the VBR v12 use case many customers are going to choose to start dipping their toes into the idea of on-prem s3 compatible object storage. This can be as full featured as a [Cloudian](https://cloudian.com/) physical appliance or as open and flexible as a [minIO](https://min.io/) or [ceph](https://docs.ceph.com/en/pacific/) based architecture. The point being that as Veeam and other enterprise tech's needs for object storage matures your systems will be growing out of the decisions you make today so it's a good time to start learning about the technology and how to do the basics of management from an agnostic point of view.

So please excuse the long windedness of post as I dive into the whys and the hows of s3 compatible object storage.

## Why Object Then?

Before we go further it's worth taking a minute to talk about the reasons why these technologies are looking to object storage over the traditional block (NTFS, ReFS, XFS, etc) options. Probably first and foremost it is designed to be a scale-out architecture. With block storage while you can do things like creating RAID arrays to allow you to join multiple disks you aren't really going to make a RAID across multiple servers. So for the use case of backup rather than be limited by the idea of a single server or have to use external constructs such as Veeam's SOBR to allow those to be stitched together, you can target an object storage gateway that then write to a much more scalable, much more tunable, infrastructure of storage servers underneath.

Beyond the scale-out you have a vast feature set. Things that we use every day such as file versioning, security ACLs, least privilege design and the concept of immutability are extremely important in designing a secure storage system in today's world and most object storage systems are going to be able to provide these capabilities. Beyond this we can look at capabilities such as multi-region synchronization as a way to ensure that our data is secure and highly available.

## Connecting to S3 or S3 Compatible Storage

So regardless of whatever client you are using you are going to need 4 basic pieces of information to connect to the service at all.

- Endpoint: This will be a internet style https or http URL that defines the address to the gateway that your client will connect to.
- Region: This defines the datacenter location within the service provider's system that you will be storing data in. For example the default for AWS s3 is us-east-1 but can be any number of other locations based on your geography needs and the provider.
- Access Key: this is one half of the credential set you will need to consume your service and is mostly akin to a username or if you are used to consuming Office 365 like the AppID
- Secret Key: this is the other half and is essentially the generated password for the access key.

Regardless of the service you will be consuming all of those parts. With things that have native AWS integration you may not be prompted necessarily for the endpoint but be assured it's being used.

To get started at connecting to a service and creating basic, no frills buckets you can look at some basic GUI clients such as [CyberDuck](https://cyberduck.io/) for Windows or MacOS or [WinSCP](https://winscp.net/eng/index.php) for Windows. Decent primers for using these can be found [here](https://mediatemple.net/community/products/aws/360010862892/using-cyberduck-for-amazon-s3) and [here](https://winscp.net/eng/docs/guide_backblaze).

## Installing and Configuring AWS CLI Client

If you've ever used AWS S3 to create a bucket before you are probably used to go to the console website and pointy, clicky create bucket, set attributes, upload files, etc. As we talk more and more about s3 compatible storage that UI may or may not be there and if it is there it may be wildly different than what you use at AWS because it's a different interpretation of the protocol's uses. What is consistent, and in some cases or situation may be your only option, is consuming s3 via CLI or the API.

Probably the easiest and most common client for consuming s3 via CLI is the AWS cli. This can easily be installed via the package manager of your choice, but for quick and easy access:

Windows via Chocolatey

```bash
choco install -y awscli
```
MacOS via Brew

```bash
brew install awscli
```
Once you have it installed you are going to need to interact with 2 local files in your .aws directory on your user profile, config and credentials. You can get these created by using the `<strong>aws configure</strong>` command. Further aws cli supports the concept of profiles so you can create multiple connections and accounts. To get started with this you would simply use `<strong>aws configure --profile obj-test</strong> `where obj-test is whatever name you want to use. This will then walk through prompting you for 3 of those 4 pieces of information, access key, secret key and default region. Just as an FYI this command impacts 2 files within your user profile, regardless of OS, ~/.aws/config and ~/.aws/credentials. These are worth reviewing after you configure to become familiar with the format and security implications.

{{< figure src="aws-configure.jpg" alt="" >}}

## Getting Started with CLI

Now that we've got our CLI installed and authentication configured let's take a look a few basic commands that will help you get started. As a reference here are the living command references you will be using

- s3 endpoint reference [s3 — AWS CLI Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/index.html)
- s3api endpoint reference: [s3api — AWS CLI Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/index.html)

A good first step will be creating a basic bucket. You can do this leveraging the s3api create-bucket command:

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api create-bucket --bucket test-bucket-1
```
{{< figure src="image.png" alt="" >}}

Awesome! We've got our first bucket in our repository. That's cool but I want my bucket to be able to leverage this object lock capability Jim keeps going on about. To do that you use the same command but add the --object-lock-enabled-for-bucket parameter.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api create-bucket --bucket test-bucket-2-locked --object-lock-enabled-for-bucket
```
Cool, let's go and check our work with the s3api get-object-lock-configuration command:

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api get-object-lock-configuration --bucket test-bucket-2-locked
```
{{< figure src="image-1.png" alt="" >}}

So yeah, good to go there. Next let's dive into that s3api list-buckets command seen in the previous screenshot. Listing buckets is a good example for understanding that when you access s3 or s3 compatible storage you are really talking about 2 things; s3 protocol and the s3api. For listing buckets you can use either:

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api list-buckets
```or
```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3 ls
```
{{< figure src="featured.png" alt="" >}}

While these are similar it's worth noting the return will not be the same. The ls command will return data much like what it would in a standard Linux shell while s3api list-buckets will return JSON formatted data by default.

## Enough About Buckets, Give Me Data

So buckets are great but the are nothing without data inside them. Let's get to work writing objects.

Again writing data, especially if you are familar with the \*nix methods to s3 can be very similar. I can use s3 cp or mv to copy or mv data to my s3://test-bucket-2-locked/ bucket or any other I've created or between them.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3 cp ./IMG_4881.jpg s3://test-bucket-2-locked/
```
{{< figure src="image-4.png" alt="" >}}

If I'm not doing this by hand but rather building into automation I can also write data via the s3api.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api put-object --bucket test-bucket-2-locked --body ./aws-configure.jpg --key folder1/aws-config.jpg
```
{{< figure src="image-3.png" alt="" >}}

Now that we've written a couple files let's look at what we have. As you can see above once again you can do the same actions via both methods, it's just the s3api way will consistently give you more information and more capability. Here's what the api output would look like.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api list-objects --bucket test-bucket-2-locked
```
Take note of a few things here. While the s3 ls command gives more traditional file system output s3api refers to the objects with their entire 'path' as the key. Essentially in object storage for our benefit it still has the concept of file and folder structure but it views each unique object as a single flat thing on the file system without a true tree. Key is also important because as we start to consider more advanced object storage capabilities such as object lock, encryption, etc. the key is often what you need to supply to complete the commands.

{{< figure src="image-5.png" alt="" >}}

## A Few Notes About Object Lock/Immutability

To round out this post let's take a look at where we started as the why, immutability. Sure we've enabled object lock on a bucket before but what that really just does is enable versioning, it's not enforcing anything. Before we get crazy with creating immutable objects its important to understand there are 2 modes of object lock:

- **Governance Mode** - In Governance Mode users can write data and not be able to truly delete it as expected but there are roles and permissions that can be set (and are inherited by root) that will allow that to be overridden and allow data to be removed.
- **Compliance Mode** - This is the more firm option where even the root account cannot remove data/versions and the retention period is hard set. Further once a retention date is set on a given object you cannot shorten it in any way, only extend it further.

Object Lock is actually done in one of two ways (or a mix of both); creating a policy and applying it to a bucket so that anything written to that bucket will assume that retention or by actually applying a retention period to an object itself either while writing the object or after the fact.

Let's start with applying a basic policy to a bucket. In this situations for my test-bucket-2-locked bucket I'm going to enable compliance mode and then set retention to 21 days. A full breakdown of the formatting of the object-lock-configuration parameter and the options it provides can be found in the [AWS documentation](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/put-object-retention.html).

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api put-object-lock-configuration --bucket test-bucket-2-locked --object-lock-configuration '{ 'ObjectLockEnabled': 'Enabled', 'Rule': { 'DefaultRetention': { 'Mode': 'COMPLIANCE', 'Days': 21 }}}'
```
Cool, now to check that compliance we can simply use s3api get-object-lock-configuration instead against the bucket to check what we've done. I'll note that for either the 'put' above or the 'get' below that there is no s3 endpoint equivalent, these are some of the more advanced features I've been going on about.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api get-object-lock-configuration --bucket test-bucket-2-locked
```
{{< figure src="image-7.png" alt="" >}}

Ok, so we've applied a baseline policy of compliance and retention of 21 days to our bucket and confirmed that it's set. Now let's look at the objects within. You can view a particular object's retention with the s3api get-object-retention command. As we are dealing with advanced features at the object level you will need to capture the key for an object to test. If you'll remember we found those using the s3api list-objects command.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api get-object-retention --bucket test-bucket-2-locked --key 'folder1/aws-config.jpg'
```
{{< figure src="image-8.png" alt="" >}}

So as you can see we have both mode and retention date set on the individual object. What if we wanted this particular object to have a different retention period than the bucket itself? Let's now use the s3api put-object-retention option to work and try to set that down to 14 days instead. While we use a general purpose number of days when creating the policy when we set object level retention it's done by modifying the actual date stamp so we'll simply pick a day 14 days from today.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api put-object-retention --bucket test-bucket-2-locked --key 'folder1/aws-config.jpg' --retention '{ 'Mode': 'GOVERNANCE', 'RetainUntilDate': '2022-02-16T00:00:00' }'
```
{{< figure src="image-6.png" alt="" >}}

Doh! Remember what we said about compliance mode? That you could make the retention shorter than what was previously set? We are running into that here and can see that it in fact works! Instead let's try this again and set it to 22 days.

```bash
aws --profile jimtest --endpoint-url=https://us-central-1a.object.ilandcloud.com s3api put-object-retention --bucket test-bucket-2-locked --key 'folder1/aws-config.jpg' --retention '{ 'Mode': 'GOVERNANCE', 'RetainUntilDate': '2022-02-24T00:00:00' }'
```
{{< figure src="image-9.png" alt="" >}}

As you can see now not only did we not get an error but when you check your retention it is now showing for defined timestamp so it definitely worked.

This feels like a good time to note that object locking is not the same as deletion protection. If I create an object lock enabled bucket and upload some objects to it, setting the object retention flag with the right info along the way, I am still going to be able to use a basic delete command to delete that file. In fact if I use CyberDuck or WinSCP to connect to my test bucket I can right click on any object there and successfully choose delete. What is happening under the covers is that a new version of that object is spawned, one with the delete marker applied to it. For standard clients that will appear that the data is gone but in reality it's still there, it just needs to be restored to the previous version. In practice most of the UIs you are going to use to consume s3 compatible storage such as Veeam or developed consoles will recognize what is going on under the covers and essentially "block" you from executing the delete, but feel secure that as long as you have object lock enabled and the data is written with a retention date the data has not actually gone away and can be recovered.

All of this is a somewhat long winded answer to the question "How S3 Object Lock works" which Amazon has thoughtfully well answered in t[his post](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html). I recommend you give it a read.

## Conclusion

In the end you are most likely NOT going to need to know via the command line how to do all the above steps. More likely you will be using some form of a UI, be it Veeam Backup and Replication, AWS console or that of your service provider, but it is very good to know how to do these things especially if you are considering on-premises Object Storage as we move into this next evolution of IT and BCDR. Learning and testing the above is a relatively low cost consideration as most object services are literally pennies per GB, possibly with the egress data charges depending on your provider (hey AWS...), but it's money well spent to get a better understanding.