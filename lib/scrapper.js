const request = require("request");
const chalk = require("chalk");
const cheerio = require("cheerio");
const config = require("../config.json");
const fs = require("fs");
const harvestedNotices = require("../harvestedNotices.json");
const sleep = require('sleep');

function scrapeNoticeBoards() {
    console.log( chalk.greenBright.bold("[  INFO  ] ") + "Scrapping of BPIT Website started");
    let ActiveRequestsCount = 0;
    sleep.sleep(2);

    return new Promise(function(resolve,reject) {
        ActiveRequestsCount += 1;
        console.log( chalk.greenBright.bold("\t ==> ") + "Requesting URL: " + chalk.underline("http://bpitindia.com/important-notices.html"));
        request("http://bpitindia.com/important-notices.html", function (error, response, body) {
            console.log( chalk.greenBright.bold("\t ==> ") + "Response arrives" );
            console.log( chalk.greenBright.bold("\t ==> ") + "Status Code: " + response.statusCode );
            ActiveRequestsCount -= 1;
            if (!error && response.statusCode == 200) {
                // EXECUTES WHEN THERE'S NO ERROR ON RESPONSE STATUS CODE == 200
                console.log( chalk.greenBright.bold("\t ==> ") + "Initialising Cheerio object with reponse body");
                const $ = cheerio.load(body);
                console.log( chalk.greenBright.bold("\t ==> ") + "Searching for notice board on website");
                const noticeBoard = $("ul.categories-list-item").eq(0);     // SEARCHING FOR NOTICE BOARD ON WEBSITE
                console.log( chalk.greenBright.bold("\t ==> ") + "Searching for items on notice board");
                const notices = $(noticeBoard).find("li");     // SEARCHING FOR ITEMS ON NOTICE BOARD

                console.log( chalk.greenBright.bold("\t ==> ") + `Notices available on Website: ${notices.length}`);
                // ITERATING OVERALL THE SCRAPPED NOTICES
                for (let idx = 0; idx < notices.length; idx++) {
                    // CREATING TEMPLATE NOTICE-OBJECT
                    noticeObject = {
                        "notice-title": null,       // IT STORES TITLE DISPLAYED ON THE WEBSITE
                        "notice-link": null,        // IT STORES ORIGINAL WEBSITE LINK OF THE NOTICE
                        "notice-file": null,        // IT STORES LOCAL ADDRESS OF DOWNLOADED NOTICE FILE
                        "isPublishedOnInstagram": false,
                        "scrappingDateTime": null
                    };

                    let noticeWriteFlag = true;
                    // CHECKING WHETHER THIS NOTICE IS PREVIOUSLY SCRAPPED OR NOT
                    harvestedNotices.map(function (notice) {
                        if (notice["notice-title"] == $(notices[idx]).text())
                            noticeWriteFlag = false;
                    })

                    // UPDATING NOTICE-OBJECT WITH LATEST VALUES
                    if (noticeWriteFlag) {
                        console.log( chalk.greenBright.bold("\t ==> ") + `Saving notice titled: ${$(notices[idx]).text()}`);
                        noticeObject["notice-title"] = $(notices[idx]).text();
                        noticeObject["notice-link"] = config["bpit-college-host"] + $(notices[idx]).find('a').attr('href');

                        // TIMESTAMPING ON SCRAPED DETAILS
                        let date = new Date();
                        noticeObject["scrappingDateTime"] = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
                        harvestedNotices.push(noticeObject);
                    } else {
                        console.log( chalk.redBright.bold("\t ==> ") + `Duplicate entry found of notice: ${$(notices[idx]).text()}, skipping that`);
                    }
                }
            }
            if (ActiveRequestsCount == 0) {
                console.log( chalk.greenBright.bold("[ STATUS ] ") + `Scraping of BPIT Website finished, successfully`);
                fs.writeFileSync("./harvestedNotices.json", JSON.stringify(harvestedNotices));
                resolve();
            }

        });
    })
}

module.exports.scrapeNoticeBoards = scrapeNoticeBoards;