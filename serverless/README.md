# Backend

## Running locally

| Since this is a serverless backend, running it locally can be a bit challenging. `IS_OFFLINE` environment variable is used to prevent calls to other AWS services when running the service locally. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### Prerequisites

- [Node.js v18 & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed
- [serverless framework v3](https://www.npmjs.com/package/serverless) installed globally
- Site registered in the reCAPTCHA v3 Admin Console: https://www.google.com/recaptcha/admin

### Commands

1. Install dependencies by running
   `npm install`
2. Provide the following environment variables in `.env`-file and remember to replace values between `<` and `>` with your own values
   ```sh
   IS_OFFLINE=true
   FRONTEND_URL=<your-frontend-url>
   offline.RECAPTCHA_SECRET=<reCaptcha-secret-key>
   offline.SECURITY_GROUP_ID="sg-offlineid12345678"
   offline.SUBNET_ID_1="subnet-offlineid12345678"
   offline.SUBNET_ID_2="subnet-offlineid12345678"
   offline.VIRUS_SCAN_LAMBDA=""
   offline.VIRUS_SCAN_ROLE=""
   REGION=""
   AWS_ACCOUNT_ID=""
   AWS_CLOUDFORMATION_ROLE=""
   SMTP_CREDENTIALS_NAME=""
   SMTP_SENDER=""
   ```
3. Start API in development mode by running
   `npm run offline`

- **After using UI to post a report you can simulate s3 invocation of the emailLambda in another terminal**

  ```sh
  npm run emailLambda -- '{"Records": [{"s3": {"object": {"key": "<your-report-id>_report.json"}}}]}'
  ```

  Replace `<your-report-id>` with the id printed in the terminal that is running the API.

  Example print: `Report sent to virus scan: c38b8994-dcc9-48eb-b533-60823cc96dcb`

---
