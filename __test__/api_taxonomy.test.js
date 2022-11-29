//requiring module to set up server environment for testing
const request = require("supertest");
//module to simulate a hit
const assert = require("assert");
//server in running
const app = require("../app");
//username and password of user existing
const auth = { username: "sih", password: "sih*#1", id: 3 };
//method of auth for basic auth
const authBasic =
  "Basic " +
  Buffer.from(auth.username + ":" + auth.password).toString("base64");
//status code 200
const status = 200;
//call database query
const db = require("../models/index");
const { QueryTypes } = require("sequelize");
//identifier for the module which will apply the testing
describe("TEST api_taxonomy", () => {
  //description for the types of test which will be applied to the module
  test("should response with statusCode 200 ", (done) => {
    //test content per module ,for the get all of api_taxonomy a status 200 is expected
    request(app)
      .get("/api_taxonomy/")
      .set({
        Authorization: authBasic,
      })
      .then((response) => {
        assert.deepStrictEqual(response.status, status);
      });
    done();
  });
  test("Get One - should response body taxonomy and response with statusCode 200", (done) => {
    db.sequelize
      .query(`SELECT * FROM api_taxonomy ORDER BY id ASC LIMIT 1`, {
        type: QueryTypes.SELECT,
      })
      .then((oneTaxonomyTest) => {
        const oneTaxonomy = oneTaxonomyTest[0];
        request(app)
          .get(`/api_taxonomy/${oneTaxonomyTest[0].id}`)
          .set({
            Authorization: authBasic,
          })
          .then((response) => {
            assert.deepStrictEqual(response.status, status);
            assert.deepEqual(response.body, oneTaxonomy);
          });
      });
    done();
  });
});
