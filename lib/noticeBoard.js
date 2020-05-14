let harvestedNotices = require('../harvestedNotices.json');
const fs = require('fs');
const request = require('request');
const path = require('path');
const uniqid = require('uniqid');
const chalk = require('chalk');
const sleep = require('sleep');

function downloadHarvestedFiles() {
    console.log( chalk.greenBright.bold("[  INFO  ] ") + "Downloading of notice board files, started");
    let ActiveRequestsCounter = 0;
    sleep.sleep(2);

    return new Promise(function (resolve, reject) {
        for (let idx = 0; idx < harvestedNotices.length; idx++) {
            if (harvestedNotices[idx]["notice-file"] == null) {
                console.log( chalk.greenBright.bold("\t ==> ") + "Requesting File: " + chalk.underline(harvestedNotices[idx]["notice-title"]));
                ActiveRequestsCounter += 1;
                let ActiveRequest = request
                    .get(harvestedNotices[idx]["notice-link"])
                    .on('response', function (response) {
                        ActiveRequestsCounter -= 1;
                        if (response.statusCode != 200)
                            console.log( chalk.redBright.bold("\t ==> ") + "Error in downloading File: " + chalk(harvestedNotices[idx]["notice-title"]));
                        else {
                            let filename = `${uniqid()}.${harvestedNotices[idx]["notice-link"].split('.').pop()}`;
                            let outputfile = fs.createWriteStream(path.join('documents', filename));
                            harvestedNotices[idx]["notice-file"] = filename;
                            console.log( chalk.greenBright.bold("\t ==> ") + "Writing notice: " + chalk.underline(harvestedNotices[idx]["notice-title"]));
                            ActiveRequest.pipe(outputfile);
                        }
                        if (ActiveRequestsCounter == 0) {
                            fs.writeFileSync(path.join("./", "harvestedNotices.json"), JSON.stringify(harvestedNotices));
                            console.log( chalk.greenBright.bold("[  INFO  ] ") + "Downloading of notice board files, completed");
                            resolve();
                        }
                    });
            }
            else {
                console.log( chalk.redBright.bold("\t ==> ") + "File: " + chalk(harvestedNotices[idx]["notice-title"] + " already exists in DB"));
            }
        }
    })
}

module.exports.downloadHarvestedFiles = downloadHarvestedFiles;