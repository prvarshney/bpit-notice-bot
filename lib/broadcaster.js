const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

puppeteer.launch({ headless:false }).then(async browser => {
    try {
        const page = await browser.newPage();
        // await page.emulate(iPhone);
        await page.goto('https://www.google.com');
        // other actions...
    }
    catch(error) {
        console.log(error);
    }
  
});