const Randomise = require(`./randomiser`)

const locationList = {
    "northern andor": "Irish",
    "southern andor": "Irish",
    "afen": "British",
    "cairhien": 'Scottish',
    "tar valon": 'British',
    "chilera": 'Australian',
    "krethiz": 'Kiwi',
    "tear": 'Russian',
    "illian": 'West Country',
    "terrabon": 'French',
    "trencouche": 'German',
    "borderlands": "Asian",
    "picheap": 'Australian'
}
const voiceAlterations = ["Clenched Teeth", "Lisp sh", "lisp th", "fast and excitd", "slow and bored", "slow and dumb", "thinks about talking", "slurs", "grizzled", "hard of hearing and loud", "extra syllables (puhlease", "mumbles", "bottom jaw out", "sharp cuttof", "lips pursed", "sensual and smooth", "signs", "perpetually coughing"]

function decideVoice(originLocation, originCity, job, race) {
    let res = ""
    if (originCity == 'Camelyn') {
        res = "Speaks with a Brittish Accent"
    } else {
        res = `Speaks with a ${locationList[originLocation]} accent`
    }
    for (let i = 0; i > 3; i++) {
        let dice = Math.floor(Math.random())
        if (dice < 1 / (Math.pow(4, i))) {
            if (res.includes('sounds like')) {
                res + `, ${Randomise(voiceAlterations)}`
            } else { res + ` and sounds like ${Randomise(voiceAlterations)}` }
        }
    }
    return res
}

module.exports = {
    get: (originLocation, originCity, job, race) => {
        return decideVoice(originLocation, originCity, job, race)
    }
}