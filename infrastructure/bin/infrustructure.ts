#!/usr/bin/env node
import 'source-map-support/register';
import {App, Stack, Tags} from 'aws-cdk-lib';
import {InfrastructureX86Stack} from '../lib/infrastructure-x86-stack';
import {InfrastructureARM64Stack} from "../lib/infrastructure-arm64-stack";
//import PermissionsBoundaryAspect from "../lib/permission-boundary-aspect";

const app = new App();

const account_id = process.env.DEPLOY_TARGET_ACCOUNT;
const region = process.env.DEPLOY_TARGET_REGION
const environmentSettings = {account: account_id, region: region};

const stackName = 'Kotlin-Lambda-GraalVM-example';
const stack = new InfrastructureX86Stack(app, stackName, {
  stackName: stackName,
  env: environmentSettings,
  description: 'Graal VM example',
});

const stackNameARM64 = 'Kotlin-Lambda-GraalVM-ARM64-example';
const stackARM64 = new InfrastructureARM64Stack(app, stackName, {
  stackName: stackNameARM64,
  env: environmentSettings,
  description: 'Graal VM ARM64 example',
});

// const permissionBoundary = new PermissionsBoundaryAspect(
//   `arn:aws:iam::${Aws.ACCOUNT_ID}:policy/xxx-base-permissions-boundary`
// );
for (const node of app.node.children) {
  if (node instanceof Stack) {
    Tags.of(node).add('Application ID', node.stackName);
    //Aspects.of(node).add(permissionBoundary);
  }
}