package nl.vintik.sample.infra

import software.amazon.awscdk.App
import software.amazon.awscdk.Environment
import software.amazon.awscdk.StackProps

fun main() {
    val app = App()

    val environment = Environment.builder()
        .account(System.getenv("DEPLOY_TARGET_ACCOUNT"))
        .region(System.getenv("DEPLOY_TARGET_REGION"))
        .build()

    val stackNameTable = "Kotlin-Lambda-GraalVM-table"
    InfrastructureTableStack(
        app, stackNameTable, StackProps.builder()
            .stackName(stackNameTable)
            .env(environment)
            .description("Dynamo Table used for GraalVM example")
            .build()
    )

    val stackNameGraalVM = "Kotlin-Lambda-GraalVM-example"
    InfrastructureX86Stack(
        app, stackNameGraalVM,
        StackProps.builder()
            .stackName(stackNameGraalVM)
            .env(environment)
            .description("GraalVM x86 example")
            .build()
    )

    val stackNameGraalVMArm64 = "Kotlin-Lambda-GraalVM-ARM64-example"
    InfrastructureArm64Stack(
        app, stackNameGraalVMArm64,
        StackProps.builder()
            .stackName(stackNameGraalVMArm64)
            .env(environment)
            .description("JVM Arm64 example")
            .build()
    )
    app.synth()
}
