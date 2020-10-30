
exports.up = function (knex) {
    return knex.schema.createTable('userWorld', function (t) {
        t.increments()
        t.integer('worldId').references('id').inTable('world').notNullable();
        t.integer('userId').references('id').inTable('site-users').notNullable();
    
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('userWorld')
};