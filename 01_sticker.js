
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {name: 'daniel', email: 'daniel@test.com', isAdmin: 'true'},
        {name: 'Sunny', email: 'sunny@test.com', isAdmin: 'false'},
        {name: 'Luna Beach', email: 'luna@test.com', isAdmin: 'false'},
      ]);
    });
};
