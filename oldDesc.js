const baseURL = "https://www.heroforge.com";
const puppeteer = require('puppeteer');
const helper = require('./helper')
const Randomize = require('./randomiser');
let browser, page;
let description = {}
let hairDoos = {}
let beardDoos = []
let races = {}
let currentlyDoing = `yet to start`

async function openBrowser() {

    try {
        currentlyDoing = 'loading page'
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 })
        await page.goto(`${baseURL}`)

        currentlyDoing = 'skipping warning'
        //skip heroforge 2.0 warning
        await page.waitForSelector('#root > div.background-0-1-162 > div > div.footer-0-1-161.footer-d4-0-1-168 > a', { timeout: 60000 })
        await page.click("#root > div.background-0-1-162 > div > div.footer-0-1-161.footer-d4-0-1-168 > a")

        currentlyDoing = 'getting races'
        //get species / race
        let html = await page.evaluate(() => {
            return document.querySelector('#view > div').innerHTML
        })
        races = getRaceGenderSelections(html)

        currentlyDoing = 'getting hair lists'
        //get Hair List
        await page.click('#menuA > li.container-0-1-78.container-d6-0-1-87')
        await page.waitForSelector('#menuB > li.container-0-1-78.container-d54-0-1-184')
        await page.click('#menuB > li.container-0-1-78.container-d54-0-1-184')


        html = await page.evaluate(() => {
            return document.querySelector("#view > div").innerHTML
        })
        hairDoos = getHairDoos(html)

        currentlyDoing = 'geting beard lists'
        //get beards

        await page.click(`#menuB > li.container-0-1-78.container-d58-0-1-188`)
        html = await page.evaluate(() => {
            return document.querySelector(`#view > div`).innerHTML
        })
        beardDoos = getBeards(html)
        // await browser.close();

        return true
    }
    catch (error) {
        console.log(error)
        // await browser.close();
        console.log(`last doing ${currentlyDoing}`)
        console.log("Browser closed")
    }
};


module.exports = {
    getHero: async (race, gender) => {
        //return description and image
        if (!page) { await openBrowser() }
        return getHero(race, gender)
    }
}

async function getHero(race, gender) {
    try {
        currentlyDoing = 'begginnign hero selection and going to speices'
        //click species
        await page.click('#menuA > li.container-0-1-78.container-d2-0-1-83');

        currentlyDoing = 'select a species'
        //click species/races
        await page.waitForSelector('#view > div > div:nth-child(1) > div.thumbRow-0-1-150 > span:nth-child(1) > img', { timeout: 60000 })
        await page.click(races[race][gender])

        currentlyDoing = 'selecting hair'
        //click hair
        await page.click('#menuA > li.container-0-1-78.container-d6-0-1-87')
        await page.click('#menuB > li.container-0-1-78.container-d170-0-1-254')
        let selectedHair = Randomize.evenSplit(hairDoos[gender])
        await page.click(selectedHair.selector)
        description.hair = selectedHair.name

        currentlyDoing = 'getting bears'
        //handle beards if male
        if (gender === 'male') {
            if (Randomize.evenSplit([true, false])) {

                await page.click(`#menuB > li.container-0-1-78.container-d58-0-1-188`)

                let selectedBeard = {}
                if (race == 'dwarf') {
                    selectedBeard = beardDoos[Randomize.evenSplit([11, 12, 13, 16, 17, 18])]
                } else { selectedBeard = Randomize.evenSplit(beardDoos) }
                description.beard = selectedBeard.name
                await page.waitForSelector(beardDoos[0].selector)
                await page.click(selectedBeard.selector)
            } else {
                description.beard = 'clean shaven'
            }
        }
        currentlyDoing = 'selecting a pallete'
        //pick main colour palette
        await page.click('#menuA > li.container-0-1-78.container-d34-0-1-115');
        await page.waitForSelector('#view > div > div.container-0-1-211 > div.content-0-1-214 > div > span:nth-child(6)')
        await page.click(`#view > div > div.container-0-1-211 > div.content-0-1-214 > div > span:nth-child(${Math.floor(Math.random() * 5 + 1)})`)


        await page.waitForSelector('#menuB > li.container-0-1-78.container-d282-0-1-299')
        await page.click('#menuB > li.container-0-1-78.container-d282-0-1-299')
        await page.waitForSelector('#view > div > div.container-0-1-211 > div.content-0-1-214 > div > span:nth-child(1)')
        await page.click(`#view > div > div.container-0-1-211 > div.content-0-1-214 > div > span:nth-child(${Math.floor(Math.random() * 23 + 1)})`)
        //clothes colours

        if (race == 'tabaxi') {
            //do cat things
        }
        else if (race == 'dragonborn') {
            //handle dragon things
        }
        else if (race == 'genasi') {
            //do elemental things
        }
        else if (race == 'tortle') {
            //do tortle things
        } else if (race == 'orc') {
            //do orc things
        } else if (race == 'firbolg') {
            //do firbolg things
        } else if (race == 'kenku') {
            //do kenku things
        } else {
            //do humanoid things

        }


        //click booth button and screenshot
        await page.click('#menuA > li.container-0-1-78.container-d38-0-1-119')
        page.screenshot({
            path: './tmp/character.png',
            clip: {
                x: 84,
                y: 40,
                width: 416,
                height: 560
            }
        }).then(()=>{return res})
        let res = {
            description: description,
            imageURL: ''
        }
        return res
    } catch (err) { console.log(err); console.log(`last doing ${currentlyDoing}`) }
};





function getRaceGenderSelections(string) {

    let raceCount = 1
    let genderCount = 1
    const array = string.split('hf_config_hiRez_')
    array.shift()

    const res = {}
    for (i of array) {
        let race = i.substring(0, i.indexOf('_thumb'))

        let selector = `#view > div > div:nth-child(${raceCount}) > div.thumbRow-0-1-150 > span:nth-child(${genderCount})`
        let gender = ''
        if (genderCount == 2) {
            gender = 'female'
            race = race.substring(0, race.length - 6)
        } else {
            gender = 'male',
                race = race.substring(0, race.length - 4)
        }
        if (race == 'halfDemon') { race = 'teifling' }
        if (race == 'halfDragon') { race = 'dragonborn' }
        if (race == 'wolf') { race = 'firbolg' }
        if (race == 'cat') { race = 'tabaxi' }
        if (race == 'turtle') { race = 'tortle' }
        if (race == 'ravefolk') { race = 'kenku' }
        if (race == 'elemental') { race = 'genasi' }
        if (race == 'fairytaleGoblin') { race = 'goblin' }
        if (!res[race]) { res[race] = {} }
        res[race][gender] = selector
        if (genderCount == 1) {
            genderCount++
        } else { genderCount = 1; raceCount++ }
    }
    console.log(res)
    return res
}


function getHairDoos(string) {
    const hairStyles = { female: [], male: [] }
    const array = string.split('hf_hair_hiRez_')
    array.shift()


    //at the point of selection, Heroforge has 72 Hairdos, the last 3 are all mohaws of varying lengths. 
    //the hairstyles were picked based on if they didnt look redicolous on their genders and fit my theme
    const maleCuts = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 36, 46, 49, 50, 55, 59, 67, 69]
    const femaleCuts = [2, 15, 16, 17, 23, 24, 25, 26, 32, 33, 34, 35, 36, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 55, 63, 64, 66]

    const res = []
    for (i in array) {
        let hair = array[i].substring(0, array[i].indexOf('_thumb'))
        let selector = `#view > div > span:nth-child(${i})`
        if (hair == 'hair01') { hair = "shortUpright" }
        if (hair == 'hair03') { hair = "grownOut" }
        if (hair == 'hair11') { hair = "longInFront" }
        if (hair == 'hair05') { hair = "mediumLengthHalfBraid" }
        if (hair == 'hair09') { hair = "spikedToAPointAtBack" }
        if (hair == 'hair07') { hair = "miniDreads" }
        if (hair == 'hair04') { hair = "thiccBraide" }
        if (hair == 'hair06') { hair = "highPonyTail" }
        if (maleCuts.includes(parseInt(i))) {
            hairStyles.male.push({ name: hair, selector: selector })
        }
        if (femaleCuts.includes(parseInt(i))) {
            hairStyles.female.push({ name: hair, selector: selector })
        }

    }
    return hairStyles
}

function getBeards(string) {
    const beardStyles = []
    const array = string.split('hf_beard_hiRez_')
    console.log(array.length)
    array.shift()

    for (i in array) {
        let beard = array[i].substring(0, array[i].indexOf('_thumb'))
        let selector = `#view > div > span:nth-child(${i})`
        if (beard == 'beard04') { beard = "fancyStash" }
        if (beard == 'beard01') { beard = "goateeAndStash" }
        if (beard == 'beard02') { beard = "beard" }
        if (beard == 'beard03') { beard = "bigDwarf" }
        if (beard == 'beard01Open') { beard = "smallChinBeard" }
        if (beard == 'beard02Open') { beard = "mediumChinBeard" }
        beardStyles.push({ name: beard, selector: selector })
    }
    return beardStyles
}