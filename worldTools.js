const worldObjects = require('./worldObs')
const Randomize = require('./randomiser')


function getRaceByLocation(location) {
    if (location) {
        return Randomize.weightedSplit(worldObjects.locationRace()[location])
    } else {

        return Randomize.weightedSplit(worldObjects.defaultSpread())
    }
}



module.exports = {
    race: (location, city) => {
        const res = worldObjects.citySpecificRaceWeight()[city] ? Randomize.weightedSplit(worldObjects.citySpecificRaceWeight()[city]) : getRaceByLocation(location)
        return res
    },
    allRaces: () => {
        return (worldObjects.raceList())
    },
    allLocations: () => {
        return (worldObjects.locationList())
    },
    location: () => {
        return Randomize.evenSplit(worldObjects.locationList())
    },
    job: () => {
        return Randomize.weightedSplit(worldObjects.weightedJobList())
    },
    city: (location) => {
        return Randomize.weightedSplit(worldObjects.cityWeighting()[location])
    },
    cityListByLocation: (location) => {
        let list = worldObjects.cityWeighting()[location]
        let returnable = list.map(city => {return city.name})
        return returnable
    },
    originLocation: (location, race) => {
        const locationWeightList = []
        for (item of worldObjects.locationList()) {
            let name = item
            let weight = 1
            if (worldObjects.originByRace()[race] == item) { weight = weight + 10 }
            if (item == location) { weight = weight + 10 }
            locationWeightList.push({ name: name, weight: weight })
        }
        return Randomize.weightedSplit(locationWeightList)
    },
    age: (race) => {
        return Math.floor(Math.random() * worldObjects.raceMaxAge()[race])
    }
}