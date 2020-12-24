exports.up = function (knex) {
  return knex.schema.createTable("item", (table) => {
    table.increments();
    table.text("name");
    table.text("location");
    table.text("type");
    table.text("city");
    table.text("description");
    table.integer("userId");
    table.text("playerNotes");
      table.text("details");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("item");
};
