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
describe("TEST api_typecode_list", () => {
  //description for the types of test which will be applied to the module
  test("GET All - should response with statusCode 200 ", async (done) => {
    //test content per module ,for the get all of api_typecode_list a status 200 is expected
    request(app)
      .get("/api_typecode_list/")
      .set({
        Authorization: authBasic,
      })
      .then((response) => {
        assert.deepStrictEqual(response.status, status);
      });
    done();
  });

  test("Get One - should response body tycode_list and response with statusCode 200", (done) => {
    db.sequelize
      .query(`SELECT * FROM typecode_list ORDER BY id ASC LIMIT 1`, {
        type: QueryTypes.SELECT,
      })
      .then((oneTypecode_listTest) => {
        const oneTypeCode = oneTypecode_listTest[0];
        request(app)
          .get(`/api_typecode_list/${oneTypecode_listTest[0].id}`)
          .set({
            Authorization: authBasic,
          })
          .then((response) => {
            assert.deepStrictEqual(response.status, status);
            assert.deepStrictEqual(response.body, oneTypeCode);
          });
      });
    done();
  });

  test("POST - should response status code 200 when a body is sent to you and show new objet in database", (done) => {
    request(app)
      .post("/api_typecode_list/")
      .set({
        Authorization: authBasic,
        "Content-Type": "application/json",
        Accept: "*/*",
      })
      .send({ cms_description: "prueba3", cms_taxonomy: "prueba3" })
      .then((response) => {
        assert.deepStrictEqual(response.status, status);
      })
      .catch((err) => {
        return err.message;
      });
    done();
  });
});
