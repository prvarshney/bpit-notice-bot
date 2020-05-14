const scrapper = require('./lib/scrapper');
const downloadNoticeFiles = require('./lib/noticeBoard');
const fs = require('fs');
const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function index() {
    try {
        await scrapper.scrapeNoticeBoards();
        await downloadNoticeFiles.downloadHarvestedFiles();
    }
    catch (error) {
        console.log(error);
    }

}

index();
reader.question();