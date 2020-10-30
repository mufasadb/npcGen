
exports.up = function(knex) {
    return knex.schema.createTable('world', (table) => {
        table.increments();
        table.text('name');
        table.text('imageURL');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('world')

};