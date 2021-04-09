
require('dotenv').config();

const screenshotmachine = require('screenshotmachine');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
      
        const customerKey = process.env.API_KEY;

        secretPhrase = ''; 
        options = {
 
        url : req.body,

        dimension : '1366xfull',
        device : 'desktop',
        format: 'png',
        cacheLimit: '0',
        delay: '200',
        zoom: '100'
        }

        const apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

        const output = path.join(os.tmpdir(), 'output.png');

        console.log(output)

        screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function() {
        console.log('Screenshot saved as ' + output);
        
        const screenshot = path.join(os.tmpdir(), 'output.png');

        res.sendFile(screenshot);
    }));

    } catch(error) {
        res.status(400).send(error.stderr)
    }
}