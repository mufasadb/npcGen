// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      filename: 'postgress://location/api'
    }
  },

  test: {
    client: 'pg',
    connection: {
      filename: 'postgress://location/test-api'
    }
  },
};
