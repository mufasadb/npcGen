exports.up = function (knex) {
    return knex.schema.createTable("relation", (table) => {
        table.increments();
        table.integer('npcId').references('id').inTable('npc')
        table.integer('itemId').references('id').inTable('item')
        table.text("targetType"); //URL, item, npc
        table.text("url"); //the link to the item itself
        table.text("relationName"); //the name of the object its linked to (this is tehcnicall redundant but saves multiple calls or left join db queries)
        table.text("relationDescription"); //description of relation (i.e. mother of)
        table.integer("relationMirrorId"); //ID of the related relation (i.e. the relation indicating the child for the mother)
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("relation");
  };
  