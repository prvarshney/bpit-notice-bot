const puppeteer = require('puppeteer');
const chalk = require('chalk');
const credentials = require('../credentials.json');
const harvestedNotices = require('../harvestedNotices.json');

const browser = puppeteer.launch({
    headless: false,
    slowMo: 20,
    defaultViewport: null,
    args: [
        "--start-maximized",
        "--disable-notifications"
    ]
})

async function loginFacebook(userid, password) {
    try {
        let page = await (await browser).newPage();
        await page.goto("https://www.facebook.com", { waitUntil: "networkidle0" });
        await page.waitForSelector("#email");
        await page.type("#email", userid);
        await page.type("#pass", password);
        await page.click("#loginbutton", { waitUntil: "networkidle0" });
        await page.waitFor(2000);

        for (let idx = 0; idx < harvestedNotices.length; idx++) {
            if (harvestedNotices[idx]["notice-file"] != null) {
                await page.goto("https://www.facebook.com/?ref=tn_tnmn", { waitUntil: "networkidle0" });
                await page.type("#js_5", "");
                await page.type("#js_5", harvestedNotices[idx]["notice-title"] + "\n\n#bpit #rohini #engineering");
                let uploadPhotoHandle = await page.$('input[aria-label="Add Photo or Video"][type="file"]');
                await uploadPhotoHandle.uploadFile('./lib/pic.png', { waitUntil:"networkidle0" });
                await page.waitFor(2000);
                await page.click('button[type="submit"][value="1"]._1mf7', { waitUntil:"networkidle0" });
            }
        }
    }
    catch(error) {
        console.log(error);
    }
    
}

loginFacebook(credentials["facebook-id"], process.env.NOTICE_BOT_FB_PASSWORD || credentials["facebook-password"]);