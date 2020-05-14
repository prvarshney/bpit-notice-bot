const scrapper = require('./lib/scrapper');
const downloadNoticeFiles = require('./lib/noticeBoard');
const broadcaster = require('./lib/broadcaster');
const fs = require('fs');
const readline = require('readline');
const credentials = require('./credentials.json');
const sleep = require('sleep');

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function index() {
    try {
        await scrapper.scrapeNoticeBoards();
        sleep.sleep(3);
        await downloadNoticeFiles.downloadHarvestedFiles();
        sleep.sleep(3);
        await broadcaster.postOnFacebook(credentials["facebook-id"], process.env.NOTICE_BOT_FB_PASSWORD || credentials["facebook-password"]);
    }
    catch (error) {
        console.log(error);
    }

}

index();
reader.question();