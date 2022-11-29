const request = require("supertest");
const app = require("../app");
const assert = require("assert");
const auth = { username: "sih", password: "sih*#1", id: 3 };
const authBasic =
  "Basic " +
  Buffer.from(auth.username + ":" + auth.password).toString("base64");
const status = 200;
//call database query
const db = require("../models/index");
const { QueryTypes } = require("sequelize");
const PayerModel = require("../models").api_payers;
describe("TEST api_payers", () => {
  test("should response with statusCode 200 ", (done) => {
    request(app)
      .get("/api_payers/")
      .set({
        Authorization: authBasic,
      })
      .then((response) => {
        assert.deepStrictEqual(response.status, status);
      });
    done();
  });

  test("Get One - should response body payers and response with statusCode 200", (done) => {
    db.sequelize
      .query(
        `SELECT id,client_id,payer_name,payer_ext_id,address_1,address_2,city,state,zip,phone_main,insert_date::varchar,last_updated,batch_id FROM api_payers WHERE client_id = ${auth.id} ORDER BY id ASC LIMIT 1`,
        {
          type: QueryTypes.SELECT,
        }
      )
      .then((onePayersTest) => {
        const onePayer = onePayersTest[0];
        request(app)
          .get(`/api_payers/${onePayersTest[0].id}`)
          .set({
            Authorization: authBasic,
          })
          .then((response) => {
            assert.deepStrictEqual(response.status, status);
            assert.deepEqual(response.body, onePayer);
          })
          .catch((err) => {
            return err.message;
          });
      });
    done();
  });
});
