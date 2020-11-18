const express = require('express');

const router = express.Router();

const queries = require('../db/queries')

const character = require('../character')

const objectType = 'npc'

function isValidID(req, res, next) {
    if (!isNaN(req.params.id)) {
        return next()
    } else { next(new Error('Invalid ID')) }
}

function validnpc(obj) {
    return true
}


router.get('/', (req, res) => {
    queries.getAllGeneric(objectType).then(npcs => {
        console.log(`returning ${npcs.length} npcs`)
        res.json(npcs);
    })
})

router.get('/by-user/:id', (req, res, next) => {
    queries.getnpcByUser(req.params.id).then(npcs => {
        res.json(npcs)
    })
})

router.get('/:id', isValidID, (req, res, next) => {
    queries.getOneGeneric(objectType, req.params.id).then(npc => {
        if (npc) {
            res.json(npc)
        } else {
            next();
        }
    })
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    character.create(req.body ? req.body : {}).then(
        (npc) => {
            queries.createGeneric(objectType, npc).then(npc => {
                character.description(npc[0])
                res.json(npc[0])
            })
        }
    )

})


router.put('/:id/edit/:attribute', (req, res, next) => {

    if (req.params.attribute == "description") {
        character.description(char)
        res.json({ message: "success" })
    } else {


        console.log(`got a ${req.params.attribute} request`)
        const char = req.body
        const id = req.params.id
        let returnable = ""
        switch (req.params.attribute) {
            case "age":
                returnable = character.age(char.race)
                char.age = returnable
                break;
            case "job":
                returnable = character.job()
                char.job = returnable
                break;
            case "race":
                returnable = character.race(char.location)
                char.race = returnable
                break;
            case "gender":
                returnable = character.gender()
                char.gender = returnable
                break;
            case "originLocation":
                returnable = character.originLocation(char.location, char.race)
                char.gender = returnable
                break;
            case "originCity":
                returnable = character.city(location);
                char.originCity = returnable
                break;
            case "location":
                returnable = character.location();
                char.location = returnable
                break;
            case "city":
                returnable = character.city(char.location);
                char.location = returnable
                break;
            case "voice":
                returnable = character.voice(char.originLocation, char.originLocation, char.job, char.gender)
                char.voice = returnable
                break;
            default:
                next(new Error('no end point for that attribute'))
        }
        if (validnpc(char)) {
            queries.updateGeneric(objectType, id, char).then(npc => {
                res.json(returnable)
            })
        } else (next(new Error('invalid npc')))
    }
})


router.put('/:id', isValidID, (req, res, next) => {
    console.log('asked for one')
    if (validnpc(req.body)) {
        queries.updateGeneric(objectType, req.params.id, req.body).then(npc => {
            res.json(npc[0])
        })
    } else (next(new Error('invalid npc')))
})

router.delete('/:id', isValidID, (req, res, next) => {
    queries.deleteGeneric(objectType, req.params.id).then(() => {
        res.json({
            deleted: true
        })
    })
})

router.post(`/:id/assign`, isValidID, (req, res, next) => {
    const newObject = {
        userId: req.body.user,
        npcId: req.params.id
    }
    queries.createGeneric('usernpc', newObject).then((npc) => {
        res.json(npc[0])
    })
})

module.exports = router
