import {
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_logs as logs,
  BundlingOutput, CfnOutput,
  DockerImage,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Architecture} from "aws-cdk-lib/aws-lambda";
import * as os from 'os';

export class InfrastructureTableStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const tableName = 'Products-GraalVM-Example';
    const productsTable = new dynamodb.Table(this, id, {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
      pointInTimeRecovery: false,
      tableName: tableName,
    });

    new CfnOutput(this, `${tableName}-table-arn`, {
      value: productsTable.tableArn,
      description: `The arn of the ${tableName} table`,
      exportName: `${tableName}TableArn`,
    });
  }
}
