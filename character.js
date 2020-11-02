const Random = require('./randomiser')
const World = require('./worldTools')
const NameGen = require('./NameGen')
const Voice = require('./voice')
const Description = require('./description')
const WorldDetails = require('./worldObs')



async function createNPC(obj) {
    const { setLocation, setCity, setGender, setOriginLocation, setOriginCity, setJob, setRace, setAge } = obj
    const resultingChar = {}
    let location = setLocation ? setLocation : getLocation()
    let race = setRace ? setRace : getRace(location)
    let gender = setGender ? setGender : getGender()
    let originLocation = setOriginLocation ? setOriginLocation : getOriginLocation(location, race)
    let originCity = setOriginCity ? setOriginCity : getCity(originLocation)



    resultingChar.location = location
    resultingChar.race = race
    resultingChar.gender = gender
    resultingChar.job = getJob();
    resultingChar.originLocation = originLocation
    resultingChar.originCity = originCity
    resultingChar.city = getCity(location)
    resultingChar.voice = getVoice(originLocation, originCity, job, gender);
    resultingChar.playerNotes = ''
    resultingChar.name = await NameGen.nameByRaceGender(race, gender, location)
    resultingChar.age = setAge ? setAge : Math.floor(Math.random() * 60);
    resultingChar.userId = 32
    return (resultingChar)
}


function getLocation() { return World.location() };
function getRace(location) { return World.race(location) };
function getOriginLocation(location, race) { return World.originLocation(location, race) };
function getGender() { return Random.evenSplit(["male", "female"]) };
function getCity(location) { return World.city(location) };
function getJob() { return World.job() };
function getVoice(originLocation, originCity, job, gender) { return Voice.get(originLocation, originCity, job, gender) }

function errorThrower(type) { throw { name: `no${type}`, message: `That ${type} is not a valid ${type} for this world` } }

module.exports = {
    create: async function (obj) {
        return await createNPC(obj)
    },
    getDescription: async function (obj) {
        Description.getDescription(obj)
    }, 
    getLocation: () => { return getLocation() },
    getRace: (location) => {
        if (WorldDetails.locationList.includes(location)) {
            return getRace(location)
        } else {
            errorThrower("location")
        }
    },
    getOriginLocation: (location, race) => {
        if (WorldDetails.locationList.includes(location)) {
            if (WorldDetails.raceList.includeS(race)) {
                return getOriginLocation(location, race)
            } else { errorThrower("race") }
        } else { errorThrower("location") }
    },
    getGender: () => { return getGender(); },
    getCity: (location) => {
        if (WorldDetails.locationList.includes(location)) {
            return getCity(location)
        } else {
            errorThrower("location")
        }
    },
    getJob: () => { return getJob() },
    getVoice: (originLocation, originCity, job, gender) => {
        if (WorldDetails.locationList.includes(originLocation)) {
            return getVoice(originLocation, originCity, job, gender)
        } else { errorThrower("location") }
    }
}