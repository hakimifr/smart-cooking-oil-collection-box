# Smart Cooking Oil Collection Box, points claim page

This is the web page that the QR code on the Smart Cooking Oil Collection Box opens. It is a student prototype for a university course on the Sustainable Development Goals, covering the improper disposal of used cooking oil.

The page is fake on purpose. There is no backend. The deposit details come from the QR link, the SMS code is generated in the browser, and balances are saved in `localStorage`. It is a plain static site (HTML, CSS and JavaScript, no build step), so it can be published to GitHub Pages as it is.

## How the QR link works

The box screen shows a QR code that holds a URL like this:

```
https://<user>.github.io/<repo>/?box=SCB-SI-03&ml=1250&pur=ok&fill=62&tk=8F3K2Q&ts=1767225600
```

| Param | Meaning |
|---|---|
| `box` | Box ID, looked up in the fictional list in `assets/js/data.js` |
| `ml` | Volume deposited, in millilitres |
| `pur` | `ok` if the oil passed the purity check, `water` if water was detected |
| `fill` | Fill level of the box in percent (green 0-49, yellow 50-90, red 91-100) |
| `tk` | Deposit token, so the same deposit cannot be claimed twice |
| `ts` | Optional Unix time in seconds. If present, the link expires after 15 minutes |

Points are `floor(ml / 10)`, so 1 L gives 100 points. Every 1000 points is worth RM 5 off at the (fictional) partner shops.

## Page states

| State | When |
|---|---|
| Info | The page is opened with no parameters |
| Invalid | A parameter is missing, malformed or the box ID is unknown |
| Expired | `ts` is more than 15 minutes old |
| Claimed | The `tk` is already in `scocb.claimed` |
| Rejected | `pur=water` |
| Summary, OTP, Success | A valid deposit, then phone number, then the 6-digit code |

Checks run in that order. The SMS code is shown in a fake notification at the top of the screen, and only that code is accepted.

## Demo scenarios

Open `demo.html` (it is not linked from the main page). It draws a QR code for each scenario from the current site address:

1. Valid deposit, 0.5 L
2. Valid deposit, 1.25 L
3. Box nearly full (fill 95, red chip)
4. Rejected, water detected
5. Expired link
6. Info page

Controls on that page:

- **Regenerate** creates fresh `tk` and `ts` values. Each valid QR code can only be claimed once, so regenerate after a claim.
- **Include ts** can be switched off for QR codes you want to print and stick on the prototype, because a link with `ts` stops working after 15 minutes.
- **Reset demo data** removes the `scocb.*` keys from `localStorage` (language, balances and claimed tokens). Only those keys are touched, because GitHub Pages shares `localStorage` between all of a user's project sites.
- **Print labels** gives a clean two-column sheet with a dashed label under each QR code.
- The address field can be edited, for example to your laptop's LAN IP when testing from a real phone before publishing.

## Run it locally

```
python3 -m http.server
```

Open `http://localhost:8000/demo.html` and use a mobile viewport (about 390x844 in Chrome DevTools).

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to Settings, Pages, and choose the `main` branch and the `/ (root)` folder.
3. Wait for the site to build, then open `https://<user>.github.io/<repo>/demo.html` and scan a QR code with a real phone.

The `.nojekyll` file tells GitHub Pages to serve the files as they are.

## Languages

English is the default. Bahasa Melayu is used when `navigator.language` is `ms` or `ms-*`. The EN | BM toggle in the header overrides this and is remembered in `localStorage`. All text on the claim page is in `assets/js/i18n.js`. The demo page is a developer tool and is English only.

## Data in localStorage

| Key | Value |
|---|---|
| `scocb.lang` | `"en"` or `"ms"` |
| `scocb.accounts` | `{ "<phone>": { points, history: [{ tk, box, ml, pts, at }] } }` |
| `scocb.claimed` | Array of used tokens |

## Files

```
index.html
demo.html
assets/css/style.css
assets/js/i18n.js        EN + BM strings
assets/js/data.js        fictional boxes, partner shops, fact keys
assets/js/app.js         param parsing, state machine, storage
assets/js/qrcode.min.js  vendored qrcode-generator, demo page only
assets/img/logo.svg
.nojekyll
```

## Credits

QR codes are drawn with [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase (MIT licence), copied into `assets/js/qrcode.min.js`. "QR Code" is a registered trademark of DENSO WAVE INCORPORATED.

All box IDs, partner shops and the SMS code are fictional.
