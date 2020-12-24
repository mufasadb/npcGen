const baseURL = "http://dmheroes.com";
const puppeteer = require("puppeteer");
const helper = require("./helper");
const s3 = require("./s3Handler");
const Random = require("./randomiser");
const dbQuery = require("./db/queries");
const pinterestDescriptions = require("./pinterest");

//setting world ID for now
const worldID = 32;

let browser, page;

const queries = require("./db/queries");

const imagePath = "./tmp/character.png";

const raceSelectors = {
  human: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(2) > div`,
  tiefling: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(3) > div`,
  dwarf: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(4) > div`,
  elf: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(5) > div`,
  halfling: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(6) > div`,
  gnome: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(7) > div`,
  halfOrc: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(8) > div`,
  orc: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(8) > div`,
  halfElf: `body > div > div > app-root > app-race-selector > div:nth-child(2) > a:nth-child(9) > div`,
};

function getWordedDescription(race, gender, job) {
  const description =
    "Wearing a dark brown leather apron and light blue cloathes";
  return description;
}

async function pupLauncher() {
  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    try {
      await page.goto(`${baseURL}`);
    } catch (e) {
      throw e;
    }
  } catch (error) {
    console.log(error);
    console.log("Browser closed");
  }
}
async function clickButton(querySelection) {
  try {
    await page.waitForSelector(querySelection);
  } catch (e) {
    console.log(`trying to get query selection ${querySelection} `);
    throw e;
  }
  try {
    await page.click(querySelection);
  } catch (e) {
    throw e;
  }
}

async function getDescriptionOriginal(npc) {
  //if we havn't opened a browser - open a browser
  if (!page) {
    await pupLauncher();
  }
  npc.description = getWordedDescription(npc.race, npc.gender, npc.job);
  if (npc.gender === "male") {
    clickButton(
      `body > div > div > app-root > app-race-selector > div:nth-child(3) > a:nth-child(2) > div`
    );
  } else {
    clickButton(
      `body > div > div > app-root > app-race-selector > div:nth-child(3) > a:nth-child(3) > div`
    );
  }
  clickButton(
    raceSelectors[npc.race] ? raceSelectors[npc.race] : raceSelectors.human
  );
  setTimeout(() => {
    page
      .screenshot({
        path: imagePath,
        clip: {
          x: 10,
          y: 295,
          width: 255,
          height: 300,
        },
      })
      .then(() => {
        try {
          s3.uploadAndUpdateNPC(npc, imagePath);
        } catch (e) {
          throw e;
        }
      });
  }, 2500);
}

async function getDescriptionPinterest(npc) {
  npc.description = getWordedDescription(npc.race, npc.gender, npc.job);
  console.log(npc.race);
  console.log(npc.gender);
  const images = await dbQuery.getNotInUseImages(npc.race, worldID);
  if (images.length < 2) {
    await pinterestDescriptions.getMoreImages(npc.race, npc.gender);
    images = await dbQuery.getNotInUseImages(npc.race, worldID);
    let selected = Random.evenSplit(images);
    npc.imageURL = selected.URL;
    const imageChar = { npcId: npc.id, imageId: selected.id, worldId: worldID };
    dbQuery.createGeneric("imageCharacter", imageChar);
    dbQuery.updateGeneric("npc", npc);
  } else {
    if (images.length < 5) {
      pinterestDescriptions.getMoreImages(npc.race, npc.gender);
    }
    let selected = Random.evenSplit(images);
    npc.imageURL = selected.URL;
    const imageChar = { npcId: npc.id, imageId: selected.id, worldId: worldID };
    dbQuery.createGeneric("imageCharacter", imageChar);
    queries.updateGeneric("npc", npc.id, npc).catch((e) => {
      throw e;
    });
  }
}

module.exports = {
  getDescriptionOriginal: async function (npc) {
    getDescriptionOriginal(npc);
  },
  getDescriptionPinterest: async function (npc) {
    getDescriptionPinterest(npc);
  },
};
