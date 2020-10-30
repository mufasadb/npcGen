const Random = require('./randomiser')
const World = require('./worldTools')
const NameGen = require('./NameGen')
const Voice = require('./voice')
const Description = require('./description')



async function createNPC(setGender, setLocation, setCity, setRace, setJob, setOriginCity, setOriginLocation, setPlayerNotes) {
    const resultingChar = {}
    let location = ""
    let race = ""
    let gender = ""
    let originLocation = ""
    if (setLocation) { location = setLocation } else {
        location = World.location()
    }
    console.log(`NPC is in ${location}`)
    if (setRace) { race = setRace } else {
        race = World.race(location)
    }
    console.log(`NPC is a ${race}`)
    if (setCity) { resultingChar.city = setCity } else {
        resultingChar.city = World.city(location)
    }
    if (setGender) { gender = setGender } else {
        gender = Random.evenSplit(["male", "female"])
    }
    if (setJob) { job = setJob } else {
        job = World.job()
    }
    if (setOriginLocation) { originLocation } else {
        originLocation = World.originLocation(location, race)
        console.log(`origin is ${originLocation}`)
    }
    if (setOriginCity) { orginCity = setOriginCity } else {
        originCity = World.city(originLocation)
    }

    resultingChar.location = location
    resultingChar.race = race
    resultingChar.gender = gender
    resultingChar.job = job
    resultingChar.originLocation = originLocation
    resultingChar.originCity = originCity
    resultingChar.voice = Voice.get(originLocation, originCity, job, gender)
    resultingChar.playerNotes = setPlayerNotes ? setPlayerNotes : ''
    resultingChar.name = await NameGen.nameByRaceGender(race, gender, location)
    resultingChar.age = 100
    resultingChar.userId = 32
    return(resultingChar)
}




module.exports = {
    create: async function (obj) {
        return await createNPC(obj.gender, obj.location, obj.city, obj.race, obj.job, obj.origincity, obj.originLocation, obj.race)
    },
    getDescription: async function (obj) {
        Description.getDescription(obj)
    }
}