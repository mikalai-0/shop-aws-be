# shop-aws-be

API /products: https://ku5tm4ldq6.execute-api.eu-west-1.amazonaws.com/dev/products

API /products/{id}: https://ku5tm4ldq6.execute-api.eu-west-1.amazonaws.com/dev/products/1

Swagger Documentation: https://64ke3kfxn5.execute-api.eu-west-1.amazonaws.com/swagger

FE integration: https://d3a1mjrc371ipm.cloudfront.net/

Additional:
- Async/await is used in lambda functions
- ES6 modules are used for Product Service implementation
- Custom Webpack/ESBuild/etc is manually configured for Product Service
- SWAGGER documentation is created for Product Service
- Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module
- Main error scenarios are handled by API ("Product not found" error).