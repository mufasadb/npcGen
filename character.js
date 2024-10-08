const Random = require('./randomiser')
const World = require('./worldTools')
const NameGen = require('./NameGen')
const Voice = require('./voice')
const Description = require('./description')
const WorldDetails = require('./worldObs')

const defaultRacesForDescriptions = ["human", "teifling","dwarf","elf","halfling","gnome","halfOrc","halfElf"]



async function createNPC(obj) {
    const { setName, setLocation, setCity, setGender, setOriginLocation, setOriginCity, setJob, setRace, setAge, userId } = obj
    const resultingChar = {}
    let location = setLocation ? setLocation : getLocation()
    let race = setRace ? setRace : getRace(location)
    let gender = setGender ? setGender : getGender()
    let originLocation = setOriginLocation ? setOriginLocation : getOriginLocation(location, race)
    let originCity = setOriginCity ? setOriginCity : getCity(originLocation)
    let job = setJob ? setJob : getJob();


    resultingChar.location = location;
    resultingChar.race = race;
    resultingChar.gender = gender;
    resultingChar.job = job
    resultingChar.originLocation = originLocation;
    resultingChar.originCity = originCity;
    resultingChar.city = setCity ? setCity : getCity(location);
    resultingChar.voice = getVoice(originLocation, originCity, job, gender);
    resultingChar.playerNotes = '';
    resultingChar.name = setName ? setName : await NameGen.nameByRaceGender(race, gender, location);
    resultingChar.age = setAge ? setAge : Math.floor(Math.random() * 60);
    resultingChar.userId = userId? userId: 32
    return (resultingChar)
}


function getLocation() { return World.location() };
function getRace(location) { return World.race(location) };
function getOriginLocation(location, race) { return World.originLocation(location, race) };
function getGender() { return Random.evenSplit(["male", "female"]) };
function getCity(location) { return World.city(location) };
function getJob() { return World.job() };
function getVoice(originLocation, originCity, job, gender) { return Voice.get(originLocation, originCity, job, gender) }
function getAge(race) { return World.age(race) }

function errorThrower(type) { throw { name: `no${type}`, message: `That ${type} is not a valid ${type} for this world` } }

module.exports = {
    create: async function (obj) {
        console.log(obj)
        return await createNPC(obj)
    },
    description: async function (obj) {
        console.log(obj)
        if (defaultRacesForDescriptions.includes(obj.race)) {
            console.log(`The race ${obj.race} is the old type`)
            Description.getDescriptionOriginal(obj)
        } else {
            console.log(`using new description type for the race of ${obj.race}`)
            Description.getDescriptionPinterest(obj)
        }
    },
    location: () => { return getLocation() },
    race: (location) => {
        if (WorldDetails.locationList().includes(location)) {
            return getRace(location)
        } else {
            errorThrower("location")
        }
    },
    originLocation: (location, race) => {
        if (WorldDetails.locationList().includes(location)) {
            if (WorldDetails.raceList().includeS(race)) {
                return getOriginLocation(location, race)
            } else { errorThrower("race") }
        } else { errorThrower("location") }
    },
    gender: () => { return getGender(); },
    city: (location) => {
        if (WorldDetails.locationList().includes(location)) {
            return getCity(location)
        } else {
            errorThrower("location")
        }
    },
    job: () => { return getJob() },
    voice: (originLocation, originCity, job, gender) => {
        if (WorldDetails.locationList().includes(originLocation)) {
            return getVoice(originLocation, originCity, job, gender)
        } else { errorThrower("location") }
    },
    age: (race) => {
        if (WorldDetails.raceMaxAge()[race]) {
            return getAge(race)
        } else { errorThrower("race") }
    }
}