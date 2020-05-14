const scrapper = require('./lib/scrapper');
const downloadNoticeFiles = require('./lib/noticeBoard');
const fs = require('fs');

async function index() {
    try {
        await scrapper.scrapeNoticeBoards();
        await downloadNoticeFiles.downloadHarvestedFiles();
    }
    catch(error) {
        console.log(error);
    }
    
}

index();