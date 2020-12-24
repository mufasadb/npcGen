const knex = require("./knex");

module.exports = {
  getAllGeneric(objectType) {
    return knex(objectType);
  },
  getOneGeneric(objectType, id) {
    console.log(id);
    return knex(objectType).where("id", id).first();
  },
  createGeneric(objectType, object) {
    return knex(objectType).insert(object, "*");
  },
  updateGeneric(objectType, id, user) {
    return knex(objectType).where("id", id).update(user, "*");
  },
  deleteGeneric(objectType, id) {
    return knex(objectType).where("id", id).del();
  },
  getWorldByUser(id) {
    return knex("world").whereIn(
      "id",
      knex("userWorld").select("worldId").where("userId", id)
    );
  },
  getnpcByUser(id) {
    return knex("npc").whereIn(
      "id",
      knex("usernpc").select("npcId").where("userId", id)
    );
  },
  getImagesByRace(race) {
    return knex("image").where("race", race);
  },
  getNotInUseImages(race, worldId) {
    return knex("image")
      .where("race", race)
      .whereNotIn(
        "id",
        knex("imageCharacter").select("imageId").where("id", worldId)
      );
  },
  checkIfImageExists(URL) {
    return knex("image").where("URL", URL);
  },
};
