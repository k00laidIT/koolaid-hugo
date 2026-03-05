+++
title = "Updating the Photo Attributes in Active Directory with Powershell"
date = "2016-03-01T16:25:53Z"
draft = false
tags = [ "active directory", "automation", "how to", "learning", "powershell", "Windows",]
categories = [ "Automation", "Systems",]
featureimage = "featured.jpg"
+++


Today I got to have the joys of needed to once again get caught up on importing employee photos into the Active Directory photo attributes, thumbnailPhoto and jpegPhoto. While this isn't exactly the most necessary thing on Earth it does make working in a Windows environment "pretty" as these images are used by things such as Outlook, Lync and Cisco Jabber among other. In the past the only way I've only ever known how to do this is by using the [AD Photo Edit Free](http://www.cjwdev.com/Software/ADPhotoEdit/Info.html) utility, which while nice tends to be a bit buggy and it requires lots of repetitive action as you manually update each user for each attribute. This year I've given myself the goal of 1) finally learning Powershell/PowerCLI to at least the level of mild proficiency and 2) automating as many tasks like this as possible. While I've been dutifully working my way through a playlist of great [PluralSight](http://pluralsight.com) courses on the subject, I've had to live dangerously a few times to accomplish tasks like this along the way. So long story short with some help along the way from Googling things I've managed to put together a script to do the following.

1. Look in a directory passed to the script via the jpgdir parameter for any images with the file name format &lt;username&gt;.jpg
2. Do an Active Directory search in an OU specified in the ou parameter for the username included in the image name. This parameter needs to be the full DN path (ex. LDAP://ou=staff,dc=foo,dc=com)
3. If the user is found then it will make a resized copy of the image file into the "resized" subdirectory to keep the file sizes small
4. Finally the resized image is then set as the both the thumbnailPhoto and jpegPhoto attribute for the user's AD account
 
 So your basic usage would be<span class="lang:ps decode:true  crayon-inline "> .\\Set-ADPhotos.ps1 -jpgdir "C:\\MyPhotos" -OU "LDAP://ou=staff,dc=foo,dc=com"</span> . This should be easily setup as a scheduled task to fully automate the process. In our case I've got the person in charge of creating security badges feeding the folder with pictures when taken for the badges, then this runs at 5 in the morning each day automatically. All that said, here's the actual script code: ```
# Set-ADPhotos.ps1
# Description: For each file in a given directory it searches AD for a matching username. When it finds a match it updates
#     the jpegPhoto and thumbnailPhoto attributes for the account with the jpg file
# Credit for ResizeImage Function goes to Lewis Roberts
# http://www.lewisroberts.com/2015/01/18/powershell-image-resize-function/
#
# USAGE: .\Set-ADPhotos.ps1 -jpgdir "c:\photos" -OU "LDAP://ou=staff,dc=foo,dc=com"

param (
    [string]$jpgdir,
    [string]$OU
)

Import-Module ActiveDirectory

Function ResizeImage() {
    param([String]$ImagePath, [Int]$Quality = 90, [Int]$targetSize, [String]$OutputLocation)

    Add-Type -AssemblyName "System.Drawing"

    $img = [System.Drawing.Image]::FromFile($ImagePath)

    $CanvasWidth = $targetSize
    $CanvasHeight = $targetSize

    #Encoder parameter for image quality
    $ImageEncoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($ImageEncoder, $Quality)

    # get codec
    $Codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where {$_.MimeType -eq 'image/jpeg'}

    #compute the final ratio to use
    $ratioX = $CanvasWidth / $img.Width;
    $ratioY = $CanvasHeight / $img.Height;

    $ratio = $ratioY
    if ($ratioX -le $ratioY) {
        $ratio = $ratioX
    }

    $newWidth = [int] ($img.Width * $ratio)
    $newHeight = [int] ($img.Height * $ratio)

    $bmpResized = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graph = [System.Drawing.Graphics]::FromImage($bmpResized)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $graph.Clear([System.Drawing.Color]::White)
    $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

    #save to file
    $bmpResized.Save($OutputLocation, $Codec, $($encoderParams))
    $bmpResized.Dispose()
    $img.Dispose()
}

foreach ($photo in (Get-ChildItem -Path $jpgdir -File)) {    
    $username = $photo.BaseName
    $resizefile = $jpgdir + "\resized\" + $photo.BaseName + ".jpg"
    
    Try{$sADUser = Get-ADUser $username -ErrorAction Stop}
        Catch {
            Write-Host ("$username not found") -ForegroundColor Red
            Continue
        }
      
    ResizeImage $photo.FullName 90 200 $resizefile

    $image = [Byte[]](Get-Content $resizefile -Encoding byte)
     
    Set-ADUser $username -Replace @{thumbnailPhoto=$image}
    Set-ADUser $username -Replace @{jpegPhoto=$image}
    Write-Host ("$username has been updated") -ForegroundColor Green    
}
```
 Did I mention that I had some help from the Googles? I was able to grab some great help (read Ctrl+C, Ctrl+V) in learning how to piece this together from a couple of sites: The basic idea came from <https://coffeefueled.org/powershell/importing-photos-into-ad-with-powershell/> The Powershell Image Resize function: <http://www.lewisroberts.com/2015/01/18/powershell-image-resize-function/> Finally I've been trying to be all DevOpsy and start using GitHub so a link to the living code can be found here: <https://github.com/k00laidIT/Learning-PS/blob/master/Set-ADPhotos.ps1>