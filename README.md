# kotlin-lambda-graalvm-example
Kotlin Lambda GraalVM Example contains two CDK stacks of Kotlin Kambda on GraalVM. One on x86 ad one on ARM64. 
To bundle the ARM64 lambda in CDK a GitHub self-hosted runner was used on Linux ARM64, see https://blogs.oracle.com/cloud-infrastructure/post/announcing-github-actions-arm-runners-for-the-arm-compute-platform-on-oracle-cloud-infrastructure

## Build & Deployment
```
mvn clean install --file software/products/pom.xml
cd ${GITHUB_WORKSPACE}/infrastructure
npm install
npm run build
npx cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-example
```
for ARM64 example replace last line with (needs ARM64 machine / self-hosted GitHub runner on ARM64):
```
npx cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-ARM64-example
```