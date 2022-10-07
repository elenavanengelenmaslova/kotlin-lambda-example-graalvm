#!/usr/bin/env node
import 'source-map-support/register';
import {App, Stack, Tags} from 'aws-cdk-lib';
import {InfrastructureX86Stack} from '../lib/infrastructure-x86-stack';
import {InfrastructureARM64Stack} from "../lib/infrastructure-arm64-stack";
import {InfrastructureTableStack} from "../lib/infrastructure-table-stack";

const app = new App();

const account_id = process.env.DEPLOY_TARGET_ACCOUNT;
const region = process.env.DEPLOY_TARGET_REGION
const environmentSettings = {account: account_id, region: region};

const stackNameTable = 'Kotlin-Lambda-GraalVM-table';
const stackTable = new InfrastructureTableStack(app, stackNameTable, {
  stackName: stackNameTable,
  env: environmentSettings,
  description: 'Dynamo Table used for GraalVM example',
});

const stackNameX86 = 'Kotlin-Lambda-GraalVM-example';
const stackX86 = new InfrastructureX86Stack(app, stackNameX86, {
  stackName: stackNameX86,
  env: environmentSettings,
  description: 'GraalVM x86 example',
});

const stackNameARM64 = 'Kotlin-Lambda-GraalVM-ARM64-example';
const stackARM64 = new InfrastructureARM64Stack(app, stackNameARM64, {
  stackName: stackNameARM64,
  env: environmentSettings,
  description: 'GraalVM ARM64 example',
});

for (const node of app.node.children) {
  if (node instanceof Stack) {
    Tags.of(node).add('Application ID', node.stackName);
    //Aspects.of(node).add(permissionBoundary);
  }
}