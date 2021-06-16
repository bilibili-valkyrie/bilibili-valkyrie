import bcrypt from "bcryptjs";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany();
});

describe("users basic test", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("users add and remove test", () => {
  test("can add users", async () => {
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    await api.post("/api/users").send(newUser).expect(200);
    const res = await api.get("/api/users");
    console.log(res.body);
  });

  test("would return 409 if conflict", async () => {
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    await api.post("/api/users").send(newUser).expect(409);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
