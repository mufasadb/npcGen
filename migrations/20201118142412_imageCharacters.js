
exports.up = function (knex) {
    return knex.schema.createTable('imageCharacter', function (t) {
        t.increments()
        t.integer('npcId').references('id').inTable('npc').notNullable();
        t.integer('imageId').references('id').inTable('image').notNullable();
        t.integer('worldId').references('id').inTable('world').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('imageCharacter')
};