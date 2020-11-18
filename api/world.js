const express = require('express');

const router = express.Router();

const queries = require('../db/queries')

const World = require('../worldTools')


const objectType = 'world'

function isValidID(req, res, next) {
    if (!isNaN(req.params.id)) {
        return next()
    } else { next(new Error('Invalid ID')) }
}

function validWorld(world) {
    const hasName = typeof world.name == 'string' && world.name.trim() != '';
    const hasURL = typeof world.name == 'string' && world.name.trim() != '';
    return hasName && hasURL
}

router.get('/', (req, res) => {

    queries.getAllGeneric(objectType).then(worlds => {
        res.json(worlds);
    })
})

router.get('/by-user/:id', (req, res, next) => {
    queries.getWorldByUser(32).then(worlds => {
        res.json(worlds)
    })
})


//specifcs for dropdown / option lists
router.get('/locationList', (req, res, next) => {
    console.log('location list')
    res.json(World.allLocations())
})

router.get('/raceList', (req, res, next) => {
    res.json(World.allRaces())
})

router.get('/cityList/:city', (req, res, next) => {
    if (World.allLocations().includes(req.params.city)) {
        res.json(World.cityListByLocation(req.params.city))
    } else {
        (next(new Error('invalid location')))
    }
})


router.get('/:id', isValidID, (req, res, next) => {
    queries.getOneGeneric(objectType, req.params.id).then(world => {
        if (world) {
            res.json(world)
        } else {
            next();
        }
    })
})

router.post('/', (req, res, next) => {
    if (validWorld(req.body)) {
        queries.createGeneric(objectType, req.body).then(world => {
            res.json(world[0])
        })
    } else {
        next(new Error('invald world'))
    }
})

router.put('/:id', isValidID, (req, res, next) => {
    if (validworld(req.body)) {
        queries.updateGeneric(objectType, req.params.id, req.body).then(world => {
            res.json(world[0])
        })
    } else (next(new Error('invalid world')))
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
        worldId: req.params.id
    }
    queries.createGeneric('userWorld', newObject).then((world) => {
        res.json(world[0])
    })
})

module.exports = router
