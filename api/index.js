
require('dotenv').config();

const express = require('express');
const screenshotmachine = require('screenshotmachine');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

const port = 3002

app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send('connected');
})

app.get('/api', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
      
        const customerKey = process.env.API_KEY;

        secretPhrase = ''; //leave secret phrase empty, if not needed
        options = {
        //mandatory parameter
        url : 'https://battleship-tau.vercel.app/',
        // all next parameters are optional, see our website screenshot API guide for more details
        dimension : '1366xfull', // or "1366xfull" for full length screenshot
        device : 'desktop',
        format: 'png',
        cacheLimit: '0',
        delay: '200',
        zoom: '100'
        }

        const apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

        //put link to your html code
        console.log('<img src="' + apiUrl + '">');

        const output = path.join(os.tmpdir(), 'output.png');

        console.log(output)

        screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function() {
        console.log('Screenshot saved as ' + output);
        
        const screenshot = path.join(__dirname, '../output.png');

        res.send('a');
    }));

    } catch(error) {
        res.status(400).send(error.stderr)
    }

})

module.exports = app;