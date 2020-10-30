
exports.up = function(knex) {
    return knex.schema.createTable('site-users', (table) => {
        table.increments();
        table.text('name');
        table.text('email');
        table.text('isAdmin');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('site-users')
  };
  