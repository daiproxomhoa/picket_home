import request from "supertest";
import app from "../../src/app";

describe("POST /upload", () => {
  it("should return the number of unique houses", (done) => {
    request(app)
      .post("/house/get_total_address")
      .attach("file", "test/house/test_sorted_ids.csv")
      .expect(200)
      .end(function (err: any, res: any) {
        if (err) return done(err);
        expect(res.body).toEqual({ uniqueHouses: 3 });
        done();
      });
  });
  it("Case unsorted id", (done) => {
    request(app)
      .post("/house/get_total_address")
      .attach("file", "test/house/test_unsorted_ids.csv")
      .expect(200)
      .end(function (err: any, res: any) {
        if (err) return done(err);
        expect(res.body).toEqual({ uniqueHouses: 3 });
        done();
      });
  });
  it("Case Empty Row", (done) => {
    request(app)
      .post("/house/get_total_address")
      .attach("file", "test/house/test_empty_row.csv")
      .expect(200)
      .end(function (err: any, res: any) {
        if (err) return done(err);
        expect(res.body).toEqual({ uniqueHouses: 3 });
        done();
      });
  });
});
