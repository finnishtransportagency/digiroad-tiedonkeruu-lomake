import { Translations } from '../../translations'
import { Report } from '../../types'

const renderEmailContents = (report: Report, translations: Translations) => {
	// STYLES FOR THE EMAIL
	const head = `
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        #email-content {
          max-width: 45em;
          margin: 1em auto;
          background-color: #eeeeee;
          padding: 1em;
          border-radius: 0.3em;
        }
        h1 {
          color: #333333;
        }
        table {
          width: 100%;
          margin-top: 1em;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 0.75em;
          border-bottom: 1px solid #c9c9c9;
          text-align: left;
        }
        td {
          background-color: #fefefe;
        }
        th {
          background-color: #f5f5f5;
        }
        b {
          color: #0064af;
        }
      </style>
    </head>`

	// ACTUAL CONTENT OF THE EMAIL
	const body = `
    <body>
      <div id="email-content">
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
          ${
						report.description
							? `
          <tr>
            <th><b>${translations.description}</b></th>
            <td>${report.description}</td>
          </tr>`
							: ''
					}
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
	const text =
		`${translations.title}\n` +
		`${translations.reporter}: ${report.reporter}\n` +
		`${translations.email}: ${report.email}\n` +
		`${translations.project}: ${report.project}\n` +
		`${translations.municipality}: ${report.municipality}\n` +
		`${translations.opening_date}: ${report.opening_date.toLocaleDateString(report.lang)}`

	return { html, text }
}

export default { renderEmailContents }
