
exports.up = function (knex) {
    return knex.schema.createTable('npc', (table) => {
        table.increments();
        table.text('name');
        table.text('location');
        table.text('city');
        table.text('job');
        table.text('race');
        table.text('gender');
        table.text('originLocation');
        table.text('originCity');
        table.text('voice');
        table.text('description');
        table.text('imageURL');
        table.integer('age')
        table.integer('userId');
        table.text('playerNotes')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('npc')
};
