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
describe("TEST api_providers", () => {
  //description for the types of test which will be applied to the module
  test("should response with statusCode 200", (done) => {
    //test content per module ,for the get all of api_providers a status 200 is expected
    request(app)
      .get("/api_providers/")
      .set({
        Authorization: authBasic,
      })
      .then((response) => {
        assert.deepStrictEqual(response.status, status);
      });
    done();
  });

  test("Get One - should response body providers and response with statusCode 200", (done) => {
    db.sequelize
      .query(
        `SELECT cd address_1,address_2,city,client_id,created_at,ext_id,first_name,id,last_name,location_id,npi,phone_office,provider_name,specialty,state,updated_at,zip FROM api_providers WHERE client_id = ${auth.id} ORDER BY id ASC LIMIT 1`,
        { type: QueryTypes.SELECT }
      )
      .then((oneProvidersTest) => {
        const oneProvider = oneProvidersTest[0];
        request(app)
          .get(`/api_providers/${oneProvidersTest[0].id}`)
          .set({
            Authorization: authBasic,
          })
          .then((response) => {
            assert.deepStrictEqual(response.status, status);
            assert.deepStrictEqual(response.body, oneProvidersTest[0]);
          })
          .catch((err) => {
            return err.message;
          });
      });
    done();
  });
});
