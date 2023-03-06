import mongoose from "mongoose";
import request from "supertest";
import { app } from "../src/app";
import chai from "chai";
import chaiHttp from "chai-http";
import { faker } from "@faker-js/faker";
import axios from "axios";
import User from "../src/models/user.model";

chai.use(chaiHttp);

let token = "";
let tweetId = 0;

const expect = chai.expect;
describe("Tweet", () => {
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
        token = res.body.token;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("login successful");
        done();
      });
  });

  it("should create a tweet successfully", (done) => {
    chai
      .request(app)
      .post("/v1/tweet/create")
      .set("Authorization", `Bearer ${token}`)
      .send([
        {
          message: faker.lorem.sentence(),
          id: 0,
        },
      ])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("tweet created successfully");
        done();
      });
  });

  it("should get a user's tweets successfully", (done) => {
    chai
      .request(app)
      .get("/v1/tweet")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        tweetId = res.body.tweets[0]?._id;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should update a tweet successfully", (done) => {
    chai
      .request(app)
      .patch(`/v1/tweet/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: faker.lorem.sentence(),
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Tweet updated successfully");
        done();
      });
  });

  it("should user like a tweet", (done) => {
    chai
      .request(app)
      .patch(`/v1/tweet/like/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        like: true,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Tweet updated successfully");
        done();
      });
  });
  it("should user unlike a tweet", (done) => {
    chai
      .request(app)
      .patch(`/v1/tweet/like/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        like: false,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Tweet updated successfully");
        done();
      });
  });

  it("should delete a tweet successfully", (done) => {
    chai
      .request(app)
      .delete(`/v1/tweet/${tweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Tweet deleted successfully");
        done();
      });
  });

  it("should get a user's feeds successfully", (done) => {
    chai
      .request(app)
      .get("/v1/tweet/feed")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});
