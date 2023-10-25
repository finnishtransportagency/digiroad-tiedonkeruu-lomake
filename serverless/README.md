# Backend

## Running locally

| Since this is a serverless backend, running it locally can be a bit challenging. It is recommended to comment out any calls to the `emailService.sendEmail`-function and test things related to sending e-mails only in the cloud development environment. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### commands

1. Install dependencies by running
   `npm install`
2. Provide environment variables in `.env`-file
   ```
   FRONTEND_URL=<your-frontend-url>
   RECAPTCHA_SECRET=<reCaptcha-secret-key>
   STAGE_NAME="development"
   REGION=""
   SECURITY_GROUP_ID=""
   SUBNET_ID_1=""
   SUBNET_ID_2=""
   AWS_ACCOUNT_ID=""
   AWS_CLOUDFORMATION_ROLE=""
   SMTP_CREDENTIALS_NAME=""
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
