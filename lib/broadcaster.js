const puppeteer = require('puppeteer');
const chalk = require('chalk');
const credentials = require('../credentials.json');
const harvestedNotices = require('../harvestedNotices.json');

async function loginFacebook(userid, password) {
    const browser = puppeteer.launch({
        headless: false,
        slowMo: 20,
        defaultViewport: null,
        args: [
            "--start-maximized",
            "--disable-notifications"
        ]
    })
    try {
        console.log( chalk.greenBright.bold("[  INFO  ] ") + "Launching instance of chromium web-browser");
        let page = await (await browser).newPage();
        console.log( chalk.greenBright.bold("\t ==> ") + "Requesting URL: " + chalk.underline("https://www.facebook.com"));
        await page.goto("https://www.facebook.com", { waitUntil: "networkidle0" });
        await page.waitForSelector("#email");
        console.log( chalk.greenBright.bold("\t ==> ") + "Entering UserID: " + chalk.underline(userid));
        await page.type("#email", userid);
        console.log( chalk.greenBright.bold("\t ==> ") + "Entering password: " + chalk.underline("**********"));
        await page.type("#pass", password);
        await page.click("#loginbutton", { waitUntil: "networkidle0" });
        await page.waitFor(2000);

        console.log( chalk.greenBright.bold("\t ==> ") + "Loggedin successfully");
        for (let idx = 0; idx < harvestedNotices.length; idx++) {
            if (harvestedNotices[idx]["notice-file"] != null) {
                console.log( chalk.greenBright.bold("\t ==> ") + "Creating notice post");
                await page.goto("https://www.facebook.com/?ref=tn_tnmn", { waitUntil: "networkidle0" });
                // let postCaption = harvestedNotices[idx]["notice-title"] + "\n\n#bpit #rohini #engineering";
                let postCaption = "Schedule of Internal Viva-Voce for B.Tech VIII Semester, May 2020"

                await page.waitForSelector('textarea[title="Write something here..."]', { visible:true } );
                await page.evaluate(function() {
                    document.querySelector('textarea[title="Write something here..."]').value = "";
                })
                await page.type('textarea[title="Write something here..."]', postCaption);
                let uploadPhotoHandle = await page.$('input[aria-label="Add Photo or Video"][type="file"]');
                await uploadPhotoHandle.uploadFile('./lib/pic.png');
                await page.waitFor(3000);
                await page.click('button[type="submit"][value="1"]._1mf7', { waitUntil:"networkidle0" });
                await page.waitFor(5000);
                break;
            }
        }
        console.log( chalk.greenBright.bold("[  INFO  ] ") + "Closing instance of chromium web browser");
        await (await browser).close();
    }
    catch(error) {
        console.log(error);
    }
    
}

module.exports.postOnFacebook = loginFacebook;
// loginFacebook(credentials["facebook-id"], process.env.NOTICE_BOT_FB_PASSWORD || credentials["facebook-password"]);