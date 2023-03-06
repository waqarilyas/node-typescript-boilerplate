import mongoose from "mongoose";
import request from "supertest";
import { app } from "../src/app";
import chai from "chai";
import chaiHttp from "chai-http";
import { faker } from "@faker-js/faker";

chai.use(chaiHttp);

const expect = chai.expect;
describe("Auth", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/podopolo");
  });

  after(async () => {
    await mongoose.connection.close();
  });

  const user = {
    name: faker.name.fullName(),
    userName: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    age: faker.random.numeric(),
  };

  it("should register a user successfully", (done) => {
    chai
      .request(app)
      .post("/v1/auth/register")
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("user created successfully");
        done();
      });
  });

  it("should login a user successfully", (done) => {
    chai
      .request(app)
      .post("/v1/auth/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("login successful");
        done();
      });
  });
});
