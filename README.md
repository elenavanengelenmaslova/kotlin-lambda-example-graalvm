# kotlin-lambda-graalvm-example
Kotlin Lambda GraalVM Example contains two CDK stacks of Kotlin Lambda on GraalVM. One on x86 and one on ARM64. Additionally there is a stack for DynamoDB table.

To bundle the ARM64 lambda in CDK a GitHub self-hosted runner was used on Linux ARM64, see https://blogs.oracle.com/cloud-infrastructure/post/announcing-github-actions-arm-runners-for-the-arm-compute-platform-on-oracle-cloud-infrastructure

## Build & Deployment from local machine
### Build kotlin app
```
mvn clean install --file software/products/pom.xml
```
### Set up CDK deployment

Install CDK (if you have not already):
```
npm install -g aws-cdk
```

If you have not set up CDK in you AWS account yet, please run (replace variables in brackets with actual values):
```
cdk bootstrap aws://[aws_account_id]/[aws_region]
```

Now deploy the app:
```
cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-table --exclusively
cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-example --exclusively
```

for ARM64 example replace the above line with (needs ARM64 machine / self-hosted GitHub runner on ARM64):
```
npx cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-ARM64-example
```

## Build & Deployment to AWS account from GitHub
Set up the following secrets in your GitHub project:
```
AWS_ACCOUNT_ID
AWS_ACCESS_KEY
AWS_SECRET_KEY
```
Update AWS region in `workflow-build-deploy.yml` in `.github` folder of the project
