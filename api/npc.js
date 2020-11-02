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

    character.create(req.body ? req.body : {}).then(
        (npc) => {
            queries.createGeneric(objectType, npc).then(npc => {
                character.getDescription(npc[0])
                res.json(npc[0])
            })
        }
    )

})

router.put('/:id', isValidID, (req, res, next) => {
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
