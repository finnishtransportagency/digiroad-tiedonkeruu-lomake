import { Report } from '../schema'
import { Translations } from '../translations'

const renderEmailContents = (report: Report, translations: Translations) => {
  // STYLES FOR THE EMAIL
  const head = `
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: 'Exo 2', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }

        div {
          max-width: 700px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #333333;
        }

        table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 10px;
          border-bottom: 1px solid #dddddd;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }

        b {
          color: #0064af;
        }
      </style>
    </head>`

  // ACTUAL CONTENT OF THE EMAIL
  const body = `
    <body>
      <div>
        <h1>${translations.title}</h1>
        <table>
          <tr>
            <th><b>${translations.reporter}</b></th>
            <td>${report.reporter}</td>
          </tr>
          <tr>
            <th><b>${translations.email}</b></th>
            <td>${report.email}</td>
          </tr>
          <tr>
            <th><b>${translations.project}</b></th>
            <td>${report.project}</td>
          </tr>
          <tr>
            <th><b>${translations.municipality}</b></th>
            <td>${report.municipality}</td>
          </tr>
          <tr>
            <th><b>${translations.opening_date}</b></th>
            <td>${report.opening_date.toLocaleDateString(report.lang)}</td>
          </tr>
        </table>
      </div>
    </body>`

  const html = `
    <!DOCTYPE html>
    <html lang="${report.lang}">
      ${head}
      ${body}
    </html>`

  // TEXT VERSION OF THE EMAIL
  const text = `${translations.title}
    ${translations.reporter}: ${report.reporter}
    ${translations.email}: ${report.email}
    ${translations.project}: ${report.project}
    ${translations.municipality}: ${report.municipality}
    ${translations.opening_date}: ${report.opening_date.toLocaleDateString(report.lang)}`

  return { html, text }
}

export default { renderEmailContents }
