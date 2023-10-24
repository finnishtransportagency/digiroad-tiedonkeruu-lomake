# Backend

## Running locally

| Since this is a serverless backend, running it locally can be a bit challenging. It is recommended to comment out any calls to the `emailService.sendEmail`-function and test things related to sending e-mails only in the cloud development environment. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### commands

1. Install dependencies by running
   `npm install`
2. Provide environment variables in `.env`-file
   ```
   AWS_DEPLOYMENT_ROLE=""
   REGION=""
   VPC_SECURITY_GROUP_ID=""
   VPC_SUBNET_ID_1=""
   VPC_SUBNET_ID_2=""
   FRONTEND_URL=<your-frontend-url>
   STAGE_NAME="development"
   AWS_ACCOUNT_ID=""
   RECAPTCHA_SECRET=<reCaptcha-secret-key>
   SMTP_CREDENTIALS_NAME=""
   SMTP_ENDPOINT=""
   SMTP_SENDER=""
   ```
3. Start API in development mode by running
   `npm run offline`

#### possible errors

```bash
Cannot resolve serverless.yml: Variables resolution errored with:
  - Cannot resolve variable at "provider.stage": Value not found at "env" source
```

**Solution**: change `provider.stage` in `serverless.yml` manually to `development`

```yml
provider:
  stage: development
```

> Be sure to change it back before trying to do a production release

---
