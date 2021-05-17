
require('dotenv').config();

const express = require('express');
const screenshotmachine = require('screenshotmachine');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cors = require('cors');

const app = express();

app.use(cors());

const port = 3002

app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})

app.get('/api', (req, res) => {
    res.send('connected');
})

app.get('/api/screenshot', async (req, res) => {
    try {

        if (!req.query.url) {
            res.send(`please provide a website url as query to screenshot: https://website-screenshot-sigma.vercel.app/api/screenshot?url={website_url}`)
        }

        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')

        const customerKey = process.env.API_KEY;

        secretPhrase = '';
        options = {
            //mandatory parameter
            url: req.query.url,
            dimension: '1366xfull',
            device: 'desktop',
            format: 'png',
            cacheLimit: '0',
            delay: '200',
            zoom: '100'
        }

        const apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

        const output = path.join(os.tmpdir(), 'output.png');

        screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function () {
            console.log('Screenshot saved as ' + output);

            const base64 = fs.readFileSync(path.join(os.tmpdir(), 'output.png'), 'base64')

            res.send(base64);
        }));

    } catch (error) {
        res.status(400).send(error.stderr)
    }

})

module.exports = app;