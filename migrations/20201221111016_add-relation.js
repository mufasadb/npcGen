exports.up = function (knex) {
    return knex.schema.createTable("relation", (table) => {
      table.increments();
        table.text("type"); //URL, item, npc
        table.text("url"); //the link to the item itself
        table.text("relationName"); //the name of the object its linked to
        table.text("relationDescription"); //description of relation (i.e. mother of)
        table.integer("relationMirrorId"); //ID of the relatioend relation (i.e. the relation indicating the child for the mother)
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("relaton");
  };
  