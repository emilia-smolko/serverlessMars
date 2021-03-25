# serverlessMars is easy first start to build serverless application on AWS
Here you can find all sources or configuration data used in presentation on AWSomeweekday2 (23.03.2021). You can find recording on AWS Polska YouTube https://www.youtube.com/watch?v=SG-O-4Z3wTk
Project starts from static page publication on AWS S3 and then extends it with REST API reading and writing to DynamoDB and sending notifications after creation of new mars rovers.

## Configuration
Page mars.html contains address to call published API, you neet to replace <your-api-address> with full path to your deployed API.
Following configurations contains configuration data whitelisted:
<your-api-origin> - API host;
<your-bucket> - AWS S3 bucket name you have created on your AWS account;
<your-ip> - public ip of you computer, as visible from internet to allow access to the bucket.

## S3 
To enable limited access to <your-bucket> You may specify policy. Here is example from AWSomeweekday2 presentation:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DesktopRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<your-bucket>/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "<your-ip>"
                }
            }
        }
}
```
Configuration for bucket to allow pages served from it to access services from other origins:
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "https://<your-api-origin>/"
        ],
        "ExposeHeaders": [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

Happy training!
 
## License
[MIT](https://github.com/emilia-smolko/serverlessMars/blob/main/LICENSE)
