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
const { expect } = require("chai");
//identifier for the module which will apply the testing
describe("TEST api_patients", () => {
  //description for the types of test which will be applied to the module
  test("should response with statusCode 200", (done) => {
    //test content per module ,for the get all of api_patients a status 200 is expected
    request(app)
      .get("/api_patients/")
      .set({
        Authorization: authBasic,
      })
      .then((response) => {
        assert.deepStrictEqual(response.status, status);
      });
    done();
  });

  test("Get One - should response body patients and response with statusCode 200", (done) => {
    db.sequelize
      .query(
        `SELECT address_1,address_2,api_last_updated,batch_id,city,client_id,contact_by_email,contact_by_phone,contact_by_sms,dob,email,ethnicity,first_name,gender,guest_card_id,id,insert_date::varchar,is_deceased,language,language_secondary,last_name,last_sent FROM api_patients WHERE client_id = ${auth.id} ORDER BY id ASC limit 1`,
        { type: QueryTypes.SELECT }
      )
      .then((onePatients) => {
        request(app)
          .get(`/api_patients/${onePatients[0].id}`)
          .set({
            Authorization: authBasic,
          })
          .then((response) => {
            // expect(response.body).to().equal(onePatients[0]);
            // console.log(response.body);
            assert.deepStrictEqual(response.status, status);
            assert.deepStrictEqual(response.body, onePatients[0]);
          })
          .catch((err) => {
            return err.message;
          });
      });
    done();
  });
});
