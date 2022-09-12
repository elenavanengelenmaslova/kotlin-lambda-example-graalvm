# kotlin-lambda-graalvm-example
Kotlin GraalVM experiments

## Deployment
```
mvn clean install --file software/products/pom.xml
cd ${GITHUB_WORKSPACE}/infrastructure
npm install
npm run build
npx cdk deploy -vv --require-approval never Kotlin-Lambda-GraalVM-example
```
