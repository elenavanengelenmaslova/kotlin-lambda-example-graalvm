#!/usr/bin/env node
import 'source-map-support/register';
import {App, Aspects, Aws, Stack, Tags} from 'aws-cdk-lib';
import {InfrastructureStack} from '../lib/infrastructure-stack';
//import PermissionsBoundaryAspect from "../lib/permission-boundary-aspect";

const app = new App();

const account_id = process.env.DEPLOY_TARGET_ACCOUNT;
const environmentSettings = { account: account_id, region: 'eu-west-1' };

const stackName = 'Kotlin-Lambda-GraalVM-example';
const stack = new InfrastructureStack(app, stackName, {
    stackName: stackName,
    env: environmentSettings,
    description: 'Graal VM experiment',
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