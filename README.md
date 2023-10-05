# E-ASN
## How to run
copy .env.example to  .env
```bash
yarn install
yarn dev
```

## Env
|  env | desc  | required  |
| ------------ | ------------ | ------------ |
| APP_ENVIRONMENT  |  environtmen `development` or `production`  | false  |
| APP_NAME  |  application name | false  |
| API_URL  |  api url endpoint | true  |
| DATABASE_URL  |  db connection string for prisma  | true  |
| SECRET_KEY  | jwt signing key  | true  |
| REFRESH_SECRET_KEY  | jwt signing key  | true  |
