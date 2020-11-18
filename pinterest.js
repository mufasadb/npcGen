const puppeteer = require('puppeteer');
let browser, page;
let baseURL = 'https://pinterest.com.au'


async function openBrowser() {

    try {

        currentlyDoing = 'loading page'
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 })
        await page.goto(`${baseURL}`)


    } catch (e) { throw e }

}




async function getImages() {
    page ? null : await openBrowser();
    await page.goto('https://www.pinterest.com.au/richarddeussen/portraits-dragonkin/');
    await page.waitForSelector('#__PWS_ROOT__ > div.zI7.iyn.Hsu > div > div > div.zI7.iyn.Hsu > main > section')

    await autoScroll(page);

    let data = await page.evaluate(() => {
        return document.querySelector('#__PWS_ROOT__ > div.zI7.iyn.Hsu > div > div > div.zI7.iyn.Hsu > main > section').innerHTML
    })
    let lastPoint = 0
    const array = []

    for (let i = 0; i < 500; i++) {
        let start = data.indexOf('src="', lastPoint)
        if (start == -1) { break; }
        let end = data.indexOf('"', start + 5)
        array.push(data.substring(start + 5, end))
        lastPoint = end
    }
    console.log(array)

}

function doThinkg() {
    getImages()
}
doThinkg()

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}