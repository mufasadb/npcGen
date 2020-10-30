const knex = require('../db/knex');
const request = require ('supertest');
const app = require('../index')
const expect = require('chai').expect
const fixtures = require('./fixtures')

describe('CRUD users', () => {
    before((done) => {
        knex.migrate.latest().then(() => {
            return knex.seed.run()
        }).then(() => done())

    })
    it('Lists all Records', (done) => {
        request(app)
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .expect('Content-Type',/json/)
        .expect(200)
        .then((response)=>{
            expect(response.body).to.be.a('array')
            expect(response.body).to.deep.equal(fixtures.users)
            done();
        });
    })
})