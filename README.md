# kotlin-lambda-graalvm-example
Kotlin Lambda GraalVM Example contains two CDK stacks of Kotlin Lambda on GraalVM. One on x86 and one on ARM64. Additionally there is a stack for DynamoDB table. Examples were used in the comparison BLOG of AWS Lambda Kotlin/Native(GraalVM) ARM64 vs. x86: https://medium.com/aws-tip/this-week-in-kotlin-on-aws-lambda-to-arm64-or-not-to-arm64-e970f97baef3

To bundle the ARM64 lambda in CDK a GitHub self-hosted runner was used on Linux ARM64, see https://blogs.oracle.com/cloud-infrastructure/post/announcing-github-actions-arm-runners-for-the-arm-compute-platform-on-oracle-cloud-infrastructure . Instructions are also available at the end of this readme.

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

Deploy table:
```
cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-table --exclusively
```
Deploy the x86 app:
```
cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-example --exclusively
```

Deploy the ARM64 example replace the above line with (needs ARM64 machine):
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

Note: ARM64 variant needs self-hosted GitHub runner on ARM64. You can either set one up, see https://blogs.oracle.com/cloud-infrastructure/post/announcing-github-actions-arm-runners-for-the-arm-compute-platform-on-oracle-cloud-infrastructure, or you can comment out / remove ARM64 variant from github actions.

To set up a self-hosted ARM64 runner go to https://cloud.oracle.com/resourcemanager/stacks/create?zipUrl=https://github.com/oracle-quickstart/oci-github-actions-runner/releases/download/orm-deploy/orm.zip and follow instructions on screen, you'll need an OCI account. For github runner token you can go to Actions-Runners on the left hand side menu of your GitHub repository and copy token from configure script.
