const puppeteer = require("puppeteer");
const dbQuery = require("./db/queries");

let browser, page;
let baseURL = "https://pinterest.com.au";

const genderedRaceURLs = {
  female: {
    human: "https://www.pinterest.com.au/guilhermecd3/npc-human-female/",
    elf: "https://www.pinterest.com.au/guilhermecd3/npc-elf-female/",
    firbolg: "https://www.pinterest.com.au/myselfornot/firbolg-female/",
    goliath: "https://www.pinterest.com.au/eladgilo/female-goliath-cleric/",
    tiefling: "https://www.pinterest.com.au/guilhermecd3/npc-tiefling-female/",
    orc: "https://www.pinterest.com.au/guilhermecd3/npc-orc-female/",
    halfing: "https://www.pinterest.com.au/guilhermecd3/npc-halfling-female/",
    halfOrc: "https://www.pinterest.com.au/darianraill/half-orc-female/",
    halfElf:
      "https://www.pinterest.com.au/andy_r_kill/rpg-female-half-elf-fighter/",
    tabaxi: "https://www.pinterest.com.au/blackcat43/tabaxi-female/",
    gnome:
      "https://www.pinterest.com.au/gamemastersvault/gnome-female-pcnpc-portraits/",
    goblin: "https://www.pinterest.com.au/myselfornot/goblin-female/",
    dwarf:
      "https://www.pinterest.com.au/gamemastersvault/dwarf-female-pcnpc-portraits/",
    genasi: "https://www.pinterest.com.au/darianraill/genasi-female/",
  },
  male: {
    human: "https://www.pinterest.com.au/guilhermecd3/npc-human-male/",
    elf: "https://www.pinterest.com.au/guilhermecd3/npc-elf-male/",
    firbolg: "https://www.pinterest.com.au/myselfornot/firbolg-male/",
    goliath: "https://www.pinterest.com.au/johnraydrew/npc-goliath/",
    tiefling: "https://www.pinterest.com.au/guilhermecd3/npc-tiefling-male/",
    orc: "https://www.pinterest.com.au/guilhermecd3/npc-orc-male/",
    halfing: "https://www.pinterest.com.au/guilhermecd3/npc-halfling-male/",
    halfOrc: "https://www.pinterest.com.au/darianraill/half-orc-male/",
    halfElf: "https://www.pinterest.com.au/lbiould/half-elf-male/",
    tabaxi: "https://www.pinterest.com.au/myselfornot/tabaxi-male/",
    gnome: "https://www.pinterest.com.au/fosterleather/rpg-gnome-male/",
    goblin: "https://www.pinterest.com.au/myselfornot/goblin-male/",
    dwarf: "https://www.pinterest.com.au/guilhermecd3/npc-dwarf-male/",
    genasi: "https://www.pinterest.com.au/myselfornot/genasi-male/",
  },
};

const genderlessRaceURLs = {
  tortle: "https://www.pinterest.com.au/search/pins/?q=tortle%20dnd&rs=typed&term_meta[]=tortle%7Ctyped&term_meta[]=dnd%7Ctyped",
  kenku: "https://www.pinterest.com.au/GameMasterIdeas/dd-kenku/",
};
async function openBrowser() {
  try {
    currentlyDoing = "loading page";
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(`${baseURL}`);
  } catch (e) {
    throw e;
  }
}

async function scroll() {
  await page.evaluate(async () => {
    let distance = 100;
    let scrollHeight = document.body.scrollHeight;
    window.scrollBy(0, distance);
    totalHeight += distance;

    if (totalHeight >= scrollHeight) {
      return true;
    }
    return false;
  });
}

async function getImages(race, gender) {
console.log(`fetching more hot ${gender} ${race} pics`)
  let pageURL = genderedRaceURLs[gender][race]
    ? genderedRaceURLs[gender][race]
    : genderlessRaceURLs[race];
  page ? null : await openBrowser();
  await page.goto(pageURL);
  await page.waitForSelector(
    "#__PWS_ROOT__ > div.zI7.iyn.Hsu > div > div > div.zI7.iyn.Hsu > main > section"
  );
  // await autoScroll(page);
  let totalHeight = 0;
  let data = await page.evaluate(() => {
    return document.querySelector(
      "#__PWS_ROOT__ > div.zI7.iyn.Hsu > div > div > div.zI7.iyn.Hsu > main > section"
    ).innerHTML;
  });

  let lastPoint = 0;

  for (let i = 0; i < 4; i++) {
    let start = data.indexOf('src="', lastPoint);
    if (start == -1) {
      const noMoreImages = await scroll();
      if (noMoreImages) {
        throw "We could not scroll any futher";
      }
    } else {
      let end = data.indexOf('"', start + 5);
      let obj = {
        race: race,
        URL: data.substring(start + 5, end),
      };
      let succesfulAddition = checkAndSend(obj);
      succesfulAddition ? null : i--;
      lastPoint = end;
    }
  }
}

async function checkAndSend(image) {
  let res = false;
  let check = dbQuery.checkIfImageExists(image.URL);
  if (check[0] == null) {
    await dbQuery.createGeneric("image", image);
    console.log("submitted an image");
    res = true;
  }
}

async function lookForImages() {
  const images = await dbQuery.getAllGeneric("image");
  console.log(images);
  console.log(images.length);
}

// doThinkg()
const array = [
  "https://i.pinimg.com/236x/54/98/fd/5498fd476987e395aa0ec28b96b37f3f.jpg",
  "https://i.pinimg.com/236x/50/77/92/50779216dbdae90c3b82324a66f09590.jpg",
  "https://i.pinimg.com/236x/7f/5b/1f/7f5b1f4ef98c902db527ae8af5048759.jpg",
];
module.exports = {
  getMoreImages: (race, gender) => {
    getImages(race, gender)
    return(true)
  },
};
