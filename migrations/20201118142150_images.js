
exports.up = function (knex) {
    return knex.schema.createTable('image', function (t) {
        t.increments()
        t.string('race')
        t.string('URL')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('image')
};
