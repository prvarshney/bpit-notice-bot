const request = require("request");
const chalk = require("chalk");
const cheerio = require("cheerio");
const config = require("../config.json");
const fs = require("fs");
const harvestedNotices = require("../harvestedNotices.json");

function scrapeNoticeBoards() {
    let ActiveRequestsCount = 0;
    return new Promise(function(resolve,reject) {
        ActiveRequestsCount += 1;
        request("http://bpitindia.com/important-notices.html", function (error, response, body) {

            ActiveRequestsCount -= 1;
            if (!error && response.statusCode == 200) {
                // EXECUTES WHEN THERE'S NO ERROR ON RESPONSE STATUS CODE == 200
                const $ = cheerio.load(body);
                const noticeBoard = $("ul.categories-list-item").eq(0);     // SEARCHING FOR NOTICE BOARD ON WEBSITE
                const notices = $(noticeBoard).find("li");     // SEARCHING FOR ITEMS ON NOTICE BOARD

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
                        noticeObject["notice-title"] = $(notices[idx]).text();
                        noticeObject["notice-link"] = config["bpit-college-host"] + $(notices[idx]).find('a').attr('href');

                        // TIMESTAMPING ON SCRAPED DETAILS
                        let date = new Date();
                        noticeObject["scrappingDateTime"] = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
                        harvestedNotices.push(noticeObject);
                    }
                }
            }
            if (ActiveRequestsCount == 0) {
                fs.writeFileSync("./harvestedNotices.json", JSON.stringify(harvestedNotices));
                resolve();
            }

        });
    })
}

module.exports.scrapeNoticeBoards = scrapeNoticeBoards;