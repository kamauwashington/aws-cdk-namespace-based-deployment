import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';



// aws resources
import * as SQS from 'aws-cdk-lib/aws-sqs';
import * as SNS from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as CDK from 'aws-cdk-lib';


export class AwsCdkNamespaceDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SQS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

		// create the SQS Queue
		const messageQueue = new SQS.Queue(this, `${id} Message Queue`, {
			queueName: id,
		});

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SNS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

		// create the SNS Topic
		const topic = new SNS.Topic(this, `${id} SNS Topic`, {
			topicName: id,
			displayName: id,
		});

		// subscribe to the SNS Topic
		topic.addSubscription(new SqsSubscription(messageQueue));


		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ S3 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

		// create S3 Bucket
		const s3Bucket = new S3.Bucket(this, `${id} S3 Bucket`, {
			removalPolicy: CDK.RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
			versioned: false,
      publicReadAccess: false,
    });

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LAMBDA ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

		// 👇 create lambda function
		const snsSqsLambda = new NodejsFunction(this, id, {
			environment: {
				BUCKET_NAME: s3Bucket.bucketName, // this will allow for the lambda to use the SDK to write to S3
      },
      functionName : `${id}-SQStoS3Writer`,
			memorySize: 128,
			timeout: cdk.Duration.seconds(3),
			runtime: lambda.Runtime.NODEJS_16_X,
			handler: 'main',
			entry: path.join(__dirname, `/../src/lambdas/from-sns-sqs.ts`),
		});

		// 👇 add sqs queue as event source for lambda
		snsSqsLambda.addEventSource(
			new SqsEventSource(messageQueue, {
				batchSize: 1, // set at 1 message, however the lambda should be written in a manner to accept one or more messages
			})
		);
    
    s3Bucket.grantReadWrite(snsSqsLambda);
	}
  
}
