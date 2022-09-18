import {
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_logs as logs,
  BundlingOutput,
  DockerImage,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Architecture} from "aws-cdk-lib/aws-lambda";

export class InfrastructureARM64Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const tableName = 'Products-GraalVM-ARM64-Example';
    const productsTable = new dynamodb.Table(this, id, {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
      pointInTimeRecovery: false,
      tableName: tableName,
    });
    const graalVMNativeLambdaArm64 = new lambda.Function(this, 'graalVMNativeLambdaExampleArm64', {
      description: 'Kotlin Lambda GraalVM Example Arm64',
      runtime: lambda.Runtime.PROVIDED_AL2,
      code: lambda.Code.fromAsset('../software/',
        {
          bundling: {
            image: DockerImage.fromRegistry("marksailes/arm64-al2-graalvm:17-22.2.0"),
            volumes: [{
              hostPath: process.env.HOME + "/.m2/",
              containerPath: "/root/.m2/"
            }],
            user: "root",
            outputType: BundlingOutput.ARCHIVED,
            command: ["-c",
              "cd products-arm64 " +
              "&& mvn clean install -P native-image "
              + "&& cp /asset-input/products-arm64/target/function.zip /asset-output/"]
          }
        }),
      architecture: Architecture.ARM_64,
      handler: 'nl.vintik.sample.KotlinLambda::handleRequest',
      timeout: Duration.seconds(120),
      memorySize: 2048,
      environment: {},
      logRetention: logs.RetentionDays.ONE_DAY
    });

    productsTable.grantReadData(graalVMNativeLambdaArm64);
  }
}