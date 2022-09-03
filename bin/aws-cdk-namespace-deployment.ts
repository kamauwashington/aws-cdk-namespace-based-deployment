#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkNamespaceDeploymentStack } from '../lib/aws-cdk-namespace-deployment-stack';
import { RESOURCE_BASE_NAME } from '../src/constants/resource-base-name.const';
import APPLICATION_NAME from '../src/constants/application-name.const';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~ CDK GENERATED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// create the Stack
const app = new cdk.App();
new AwsCdkNamespaceDeploymentStack(app, `${RESOURCE_BASE_NAME}`, {});
cdk.Tags.of(app).add('NAMESPACE', RESOURCE_BASE_NAME);
cdk.Tags.of(app).add('APPLICATION_NAME', APPLICATION_NAME);