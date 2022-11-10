package nl.vintik.sample.infra

import software.amazon.awscdk.*
import software.amazon.awscdk.services.dynamodb.Table
import software.amazon.awscdk.services.lambda.Code
import software.amazon.awscdk.services.lambda.Function
import software.amazon.awscdk.services.lambda.Runtime
import software.amazon.awscdk.services.logs.RetentionDays
import software.amazon.awscdk.services.s3.assets.AssetOptions
import software.constructs.Construct

class InfrastructureX86Stack(scope: Construct, id: String, props: StackProps) : Stack(scope, id, props) {
    init {
        val productsTable = Table.fromTableArn(this, "dynamoTable", Fn.importValue("Products-GraalVM-ExampleTableArn"))

        val functionOnePackagingInstructions: List<String> = listOf(
            "-c",
            "cd products " +
                    "&& mvn clean install -P native-image "
                    + "&& cp /asset-input/products/target/function.zip /asset-output/"
        )

        val builderOptions: BundlingOptions = BundlingOptions.builder()
            .command(functionOnePackagingInstructions)
            .image(DockerImage.fromRegistry("marksailes/al2-graalvm:17-22.3.0"))
            .volumes(
                listOf(
                    DockerVolume.builder()
                        .hostPath(System.getProperty("user.home") + "/.m2/")
                        .containerPath("/root/.m2/")
                        .build()
                )
            )
            .user("root")
            .outputType(BundlingOutput.ARCHIVED)
            .build()

        val function = Function.Builder.create(this, "graalVMNativeLambdaExample")
            .description("Kotlin Lambda GraalVM Example")
            .handler("nl.vintik.sample.KotlinLambda::handleRequest")
            .runtime(Runtime.PROVIDED_AL2)
            .code(
                Code.fromAsset(
                    "../software/", AssetOptions.builder()
                        .bundling(builderOptions)
                        .build()
                )
            )
            .logRetention(RetentionDays.ONE_WEEK)
            .memorySize(512)
            .timeout(Duration.seconds(120))
            .build()
        productsTable.grantReadData(function)
    }
}