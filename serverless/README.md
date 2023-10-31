# Backend

## Running locally

| Since this is a serverless backend, running it locally can be a bit challenging. It is recommended to check in the code that the `IS_OFFLINE` variable is `false` before any calls to other AWS service. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### Prerequisites

You must have a site registered in the reCAPTCHA v3 Admin Console: https://www.google.com/recaptcha/admin

### Commands

1. Install dependencies by running
   `npm install`
2. Provide the following environment variables in `.env`-file and remember to replace values between `<` and `>` with your own values
   ```
   IS_OFFLINE=true
   FRONTEND_URL=<your-frontend-url>
   offline.RECAPTCHA_SECRET=<reCaptcha-secret-key>
   offline.SECURITY_GROUP_ID=""
   offline.SUBNET_ID_1=""
   offline.SUBNET_ID_2=""
   REGION=""
   AWS_ACCOUNT_ID=""
   AWS_CLOUDFORMATION_ROLE=""
   SMTP_CREDENTIALS_NAME=""
   SMTP_SENDER=""
   ```
3. Start API in development mode by running
   `npm run offline`

---
