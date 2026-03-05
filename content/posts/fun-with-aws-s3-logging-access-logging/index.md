+++
title = "Fun with AWS S3 Logging: Access Logging"
date = "2025-08-28T07:19:06Z"
draft = false
tags = [ "access-logging", "AWS", "object storage", "s3", "wazuh",]
categories = [ "AWS", "Security",]
featureimage = "featured.png"
+++


In case you've missed it I've been doing lots of fun things with object storage and specifically AWS S3 for the past couple of years. While using S3 for backup and data protection needs is essentially a super power it also brings its own challenges and complications due to its general Internet connectivity, concept of classful storage types, performance, and data locality.

When I talk to people who are really using object storage at scale (think hundreds of terabytes to petabytes to get in the door) there are often concerns around ensuring that their buckets are only being accessed by the servers that they control, regardless of the application. This leads to a need to capture information access logging and be able to use it to notify when anomalies occur. In this post we'll explore how to setup S3 access logging for your buckets and briefly cover how to integrate that information into SIEM infrastructure such as Wazuh to monitor buckets within an account.

## Access Logging

Like most things in AWS there numerous ways to setup logging of access to S3 buckets but they all go through the concept of [S3 Access Logging](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html). Access Logging is enabled in 3 simple steps:

1. Create a bucket for writing logs to, preferably in a separate account
2. Create a bucket policy on that bucket that allows the account(s) with your buckets to be able to write logging information to sub-path
3. Enable access logging on each individual bucket.

Because we are largely dealing with policy the AWS Console based version of this is not completely straight forward.

First let's do the simple part and create a bucket. For testing purposes I will go ahead and create the bucket in the same account but will do so with versioning and object-lock enabled.

{{< figure src="image-40.png" alt="" >}}

This WILL be creating data in AWS S3 that you will have to pay for so some housekeeping is in order, so next from your logging bucket's Management window let's create a Lifecycle policy. In this policy we need to enable

- Expire current versions of objects
- Permanently delete non-current versions of objects, and
- Delete expired object delete markers and incomplete multipart uploads

Set the time of these items to something that is meaningful to you and your organization's retention policy.

{{< figure src="image-42.png" alt="" >}}

We don't want attackers to be able to delete any of these logs, so as a next step from your logging bucket's Properties window you need to edit object lock, enable Compliance mode (ensuring nobody can delete the bucket) and set it to a meaningful time that is less than your lifecycle policy.

{{< figure src="image-41.png" alt="" >}}

Now let's create a sub-folder, or prefix, to write our access-logs into. We'll also use this in the next step of creating our bucket policy.

{{< figure src="image-43.png" alt="" >}}

Now as the last step of setting up our logging bucket we need to create a bucket policy on our bucket to allow the AWS logging service access to write to our bucket. To do so go to your logging bucket's Permissions tab and choose edit for bucket policy. As you may have noticed above the name of my bucket is "us-east-2-logging-demo." In this policy you'll notice where those are part of the ARN for the bucket, essentially saying "AWS logging explicitly has write access to this bucket.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3Logging",
      "Effect": "Allow",
      "Principal": { "Service": "logging.s3.amazonaws.com" },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::us-east-2-logging-demo/*"
    }
  ]
}
```
Once your policy is saved let's enable logging on a bucket.

From EACH bucket you will need to go to Properties and "Enable Server Access Logging". Then you select your bucket and optionally add your created sub-folder. I personally like to use sub-folders in case I want to do more logging into this centralized bucket later.

{{< figure src="image-46.png" alt="" >}}

## Automation

That all seems like a lot, right? It does to me, especially if you have a bunch of buckets. For this reason I've automated this (and another topic to be covered this week in a script at <https://github.com/k00laidIT/AWS/tree/main/S3Logging> called s3-invandlogging.ps1. This Powershell script I like to think is fairly well documented and with a minimal number of inputs will do all of the above for any buckets found in a given account. You will need the [AWS Powershell Module](https://aws.amazon.com/powershell/) installed but that's not the worst thing anyway. This can also be done with AWS CLI and bash scripting but Powershell is my jam so I went that route.

## Integrating Access Logs into Wazuh

Security Information and Event Management, or SIEM, is effectively syslog on steroids, allowing for both log and information ingest as well as integration into many threat hunting, compliance and other security related tools and systems. There are many SIEM systems that you probably well know such as Splunk, ElasticStack or Azure Sentinel, but for SMB, lab or even well staffed enterprises you may want to look at Wazuh, an open source SIEM/XDR system that is easily deployable for testing or small environments as an OVA it's easy to get out of the gate with it. Even though it's "easy" like many OSS projects it's highly extensible and able to significantly scale.

{{< figure src="featured.png" alt="" >}}

One of these ways are their ability to parse AWS Access Logs and show access events from the logs. This is great for monitoring your workloads like backups as those should largely only be from a small handful of IP addresses to allow for easy filtering, anything outside of that is "interesting" and should alert. More information on how to configure Wazuh to monitor the access logs of your AWS services can be found in [their documentation](https://documentation.wazuh.com/current/cloud-security/amazon/services/index.html).

## Conclusion

When we deal with critical data that is stored in the cloud and only separated from the public Internet by credentials, it is important to monitor access to that data to ensure that prying eyes aren't accessing it. With AWS S3, this is done by enabling access logging, which can then be integrated into a number of systems to analyze and automatically alert when unintended access occurs. I hope this primer helps you; if you find issues with it, please reach out and let's learn together!