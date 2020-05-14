let harvestedNotices = require('../harvestedNotices.json');
const fs = require('fs');
const request = require('request');
const path = require('path');
const uniqid = require('uniqid');

function downloadHarvestedFiles() {
    let ActiveRequestsCounter = 0;
    return new Promise(function (resolve, reject) {
        for (let idx = 0; idx < harvestedNotices.length; idx++) {
            if (harvestedNotices[idx]["notice-file"] == null) {
                ActiveRequestsCounter += 1;
                let ActiveRequest = request
                    .get(harvestedNotices[idx]["notice-link"])
                    .on('response', function (response) {
                        ActiveRequestsCounter -= 1;
                        if (response.statusCode != 200);
                        else {
                            let filename = `${uniqid()}.${harvestedNotices[idx]["notice-link"].split('.').pop()}`;
                            let outputfile = fs.createWriteStream(path.join('documents', filename));
                            harvestedNotices[idx]["notice-file"] = filename;
                            ActiveRequest.pipe(outputfile);
                        }
                        if (ActiveRequestsCounter == 0) {
                            fs.writeFileSync(path.join("./", "harvestedNotices.json"), JSON.stringify(harvestedNotices));
                            resolve();
                        }
                    });
            }
        }
    })
}

module.exports.downloadHarvestedFiles = downloadHarvestedFiles;