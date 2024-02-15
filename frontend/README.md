# Frontend

## Running locally

### Prerequisites

- [Node.js v18 & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed
- Site registered in the reCAPTCHA v3 Admin Console: https://www.google.com/recaptcha/admin

### Commands

1. Install dependecies by running
   `npm install`
2. Provide the following environment variables in `.env`-file and remember to replace values between `<` and `>` with your own values
   ```sh
   REACT_APP_API_URL=<your-backend-url>
   REACT_APP_RECAPTCHA_SITE_KEY=<reCaptcha-site-key>
   ```
3. [Start backend](../serverless/README.md)
4. Start frontend in development mode by running
   `npm start`

---
