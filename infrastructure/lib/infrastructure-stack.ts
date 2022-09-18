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

export class InfrastructureStack extends Stack {
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
    const graalVMNativeLambda = new lambda.Function(this, 'graalVMNativeLambdaExample', {
      description: 'Kotlin Lambda GraalVM Example',
      runtime: lambda.Runtime.PROVIDED_AL2,
      code: lambda.Code.fromAsset('../software/',
        {
          bundling: {
            image: DockerImage.fromRegistry("marksailes/al2-graalvm:17-22.2.0"),
            volumes: [{
              hostPath: process.env.HOME + "/.m2/",
              containerPath: "/root/.m2/"
            }],
            user: "root",
            outputType: BundlingOutput.ARCHIVED,
            command: ["-c",
              "cd products " +
              "&& mvn clean install -P native-image "
              + "&& cp /asset-input/products/target/function.zip /asset-output/"]
          }
        }),
      handler: 'nl.vintik.sample.KotlinLambda::handleRequest',
      timeout: Duration.seconds(120),
      memorySize: 2048,
      environment: {},
      logRetention: logs.RetentionDays.ONE_DAY
    });

    productsTable.grantReadData(graalVMNativeLambda);
  }
}
