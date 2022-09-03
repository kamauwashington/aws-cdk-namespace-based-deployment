import { SQSEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';


export async function main(event: SQSEvent): Promise<void> {
    let bucketName: string;
    if (!process.env.BUCKET_NAME) {
        console.error('BUCKET_NAME is mandatory for the lambda to write to S3');
        return;
    } else {
        bucketName = process.env.BUCKET_NAME;
    }
    const s3 = new S3();
    const responses: Promise<void>[] = [];

    for (const record of event.Records) {
        const params: S3.PutObjectRequest = {
            Body: record.body,
            Bucket: bucketName,
            Key: record.messageId,
        };

        // error trapping can be placed here, though this is a simple example
        const response = await s3.putObject(params).promise();
    }
    return;
}
