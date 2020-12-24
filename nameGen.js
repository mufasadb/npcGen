const baseURL = "https://www.fantasynamegenerators.com";
const puppeteer = require('puppeteer');
const helper = require('./helper')

let page, browser;

const raceURLs = {
    dwarf: 'dwarf_names',
    dragonborn: 'dragonkin-names',
    dragon: 'dragon_names',
    halfElf: 'half-elf-names',
    halfling: 'hobbit_names',
    gnome: 'gnome-names',
    british: 'british-english-names',
    slovak: 'slovak-names',
    french: 'french_names',
    scottish: 'modern-scottish-names',
    asian: 'edo-japanese-names',
    aussie: 'australian-names',
    kiwi: 'maori-names',
    halfOrc: 'half-orc-names',
    orc: 'orc_names',
    tabaxi: 'dnd-tabaxi-names',
    teifling: 'dnd-tiefling-names',
    spanish: "spanish-names",
    goliath: "dnd-goliath-names",
    firbolg: "dnd-firbolg-names",
    elf: "elf_names",
    tortle: "dnd-tortle-names"
}

const singleGenderRaces = ['tortle', 'dragonborn']

function nameSourceSelector(race, location) {
    let set = 'british'
    if (race === 'human') {
        if (location == 'tear') { set = 'slovak' }
        if (location == 'terrabon') { set = 'french' }
        if (location == 'cairhien') { set = 'scottish' }
        if (location == 'borderlands') { set = 'asian' }
        if (location == 'chilera') { set = 'aussie' }
        if (location == 'krethiz') { set = 'kiwi' }
        if (location == 'shinar') { set = 'spanish' }
        return set
    }
    else { return race }
}
const nameCollection = {

}

async function getNames(set, gender) {
    console.log(`looking for a ${gender} ${set} name`)
    if (!nameCollection[set]) { nameCollection[set] = {}; }
    if (!nameCollection[set][gender]) { nameCollection[set][gender] = [] }
    let returnable = ""
    let isFemale = false
    if (gender === 'female' && !singleGenderRaces.includes(set)) { isFemale = true }

    if (!nameCollection[set][gender][0]) {
        nameCollection[set][gender] = await fetchNewNames(raceURLs[set], isFemale)
    }
    if (set === "gnome") {
        returnable = `${nameCollection[set][gender][0]} ${nameCollection[set][gender][1]} ${nameCollection[set][gender][2]} ${nameCollection[set][gender][3]}`
        nameCollection[set][gender] = helper.multiShiftArray(nameCollection[set][gender], 5)
    } else {
        returnable = nameCollection[set][gender][0]
        nameCollection[set][gender].shift()
    }
    return returnable
}

async function pupLauncher() {
    try {

        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

    } catch (error) {
        console.log(error)
        console.log("Browser closed")
    }
}

async function fetchNewNames(urlAddition, isFemale) {
    try {
        if (!page) {
            await pupLauncher()
        }

        try { await page.goto(`${baseURL}/${urlAddition}.php`) } catch (e) { throw e }
        await page.waitForSelector('#result')

        if (isFemale) {
            await page.click("#nameGen > input[type=button]:nth-child(3)")
        }
        await page.waitForSelector('#result')
        const eval = await page.evaluate(() => {
            return document.querySelector('#result').innerText
        })
        let pal = eval.trim()
        const array = pal.split("\n")
        return (array)

    } catch (err) { console.log(`failed to get names from ${urlAddition}`); throw (err) }

};


function preScrapeNames() {
    Object.keys(raceURLs).map(async function (key, index) {
        nameCollection[key] = {}
        nameCollection[key].male = await fetchNewNames(raceURLs[key], false).catch(e => { console.log(`failed to get names for ${key}`); throw (e) })
        nameCollection[key].female = await fetchNewNames(raceURLs[key], true).catch(e => { console.log(`failed to get names for ${key}`); throw (e) })
    })
    console.log('done here')
}

module.exports = {
    nameByRaceGender: (race, gender, location) => {
        const set = nameSourceSelector(race, location)
        try { return getNames(set, gender) } catch (e) { throw e; }
    }
}