const express = require("express");

const router = express.Router();

const queries = require("../db/queries");

const objectType = "relation";

function isValidID(req, res, next) {
  if (!isNaN(req.params.id)) {
    return next();
  } else {
    next(new Error("Invalid ID"));
  }
}

function validRelationship(item) {
    const hasType = typeof item.type == "string" && item.type.trim() != "";
    console.log(hasName)
  return hasType;
}

router.get("/", (req, res) => {
  queries.getAllGeneric(objectType).then((items) => {
    res.json(items);
  });
});

router.get("/by-user/:id", (req, res, next) => {
  queries.getitemByUser(32).then((items) => {
    res.json(items);
  });
});

router.get("/:id", isValidID, (req, res, next) => {
  console.log(req.params.id);
  queries.getOneGeneric(objectType, req.params.id).then((item) => {
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

router.post("/", (req, res, next) => {
  if (validRelationship(req.body)) {
    queries.createGeneric(objectType, req.body).then((item) => {
      res.json(item[0]);
    });
  } else {
    next(new Error("invald item"));
  }
});

router.put("/:id", isValidID, (req, res, next) => {
  if (validRelationship(req.body)) {

    queries.updateGeneric(objectType, req.params.id, req.body).then((item) => {

      res.json(item[0]);
    });
  } else next(new Error("invalid item"));
});

router.delete("/:id", isValidID, (req, res, next) => {
  queries.deleteGeneric(objectType, req.params.id).then(() => {
    res.json({
      deleted: true,
    });
  });
});

router.post(`/:id/assign`, isValidID, (req, res, next) => {
  const newObject = {
    userId: req.body.user,
    itemId: req.params.id,
  };
  queries.createGeneric("useritem", newObject).then((item) => {
    res.json(item[0]);
  });
});

module.exports = router;
