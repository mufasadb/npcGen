const baseURL = "http://dmheroes.com";
const puppeteer = require('puppeteer');
const helper = require('./helper')

let browser, page;

const queries = require('./db/queries')


const raceSelectors = {
    human: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(2) > div`,
    tiefling: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(3) > div`,
    dwarf: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(4) > div`,
    goliath: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(4) > div`,
    elf: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(5) > div`,
    halfling: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(6) > div`,
    gnome: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(7) > div`,
    halfOrc: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(8) > div`,
    orc: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(8) > div`,
    halfElf: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(8) > div`
}

async function getDescription(race, gender, job) {
    const description = 'beautiful hair';
    const imageURL = 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcodexnomina.com%2Fwp-content%2Fuploads%2F2020%2F07%2Fmale-tabaxi-scout-e1595007657821.jpg&imgrefurl=https%3A%2F%2Fcodexnomina.com%2Ftabaxi-names%2F&tbnid=zOWnd-GMIUaqWM&vet=12ahUKEwjtoJaXlNfsAhUbCbcAHd1WCQ0QMygAegUIARChAQ..i&docid=DBI2-k18qlzcyM&w=1600&h=1134&q=tabaxi%20generator&ved=2ahUKEwjtoJaXlNfsAhUbCbcAHd1WCQ0QMygAegUIARChAQ';
    return { description: description, imageURL: imageURL }
}


async function pupLauncher() {
    try {

        browser = await puppeteer.launch({ headless: true});
        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        try { await page.goto(`${baseURL}`) } catch (e) { throw e }

    } catch (error) {
        console.log(error)
        console.log("Browser closed")
    }
}
async function clickButton(querySelection) {
    try { await page.waitForSelector(querySelection) } catch (e) { throw e }
    try { await page.click(querySelection) } catch (e) { throw e }
}

async function getDescription(race, isFemale) {
    //if we havn't opened a browser - open a browser
    if (!page) {
        await pupLauncher()
    }

    if (!isFemale) { clickButton(`body > div > div > app-root > app-race-selector > div:nth-child(3) > a:nth-child(2) > div`) }
    else { clickButton(`body > div > div > app-root > app-race-selector > div:nth-child(3) > a:nth-child(3) > div`) };
    clickButton(raceSelectors[race])
    setTimeout(() => {
        page.screenshot({
            path: './tmp/character.png',
            clip: {
                x: 10,
                y: 295,
                width: 255,
                height: 300
            }
        })
    }, 2500)
}



getDescription('dwarf', true)

module.exports = {
    getDescription: async function (obj) {
        getDescription(obj.race, obj.gender, obj.job).then((content) => {
            const newObj = obj
            newObj.description = content.description
            newObj.imageURL = content.imageURL
            console.log(newObj)
            queries.updateGeneric('npc', obj.id, newObj).catch(err => { throw e })
        })
    }
}