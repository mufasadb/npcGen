const knex = require('./knex');

module.exports = {
    getAllGeneric(objectType) {
        return knex(objectType);
    },
    getOneGeneric(objectType, id) {
        console.log(id)
        return knex(objectType).where("id", id).first();
    },
    createGeneric(objectType, user) {
        return knex(objectType).insert(user, '*')
    },
    updateGeneric(objectType, id, user) {
        return knex(objectType).where('id', id).update(user, '*')
    },
    deleteGeneric(objectType, id) {
        return knex(objectType).where('id', id).del();
    },
    getWorldByUser(id) {
        return knex('world').whereIn('id',
            knex('userWorld').select('worldId').where('userId', id))
    },
    getnpcByUser(id) {
        return knex('npc').whereIn('id',
            knex('usernpc').select('npcId').where('userId', id))
    }
} 