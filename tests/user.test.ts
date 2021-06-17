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

describe("users add test", () => {
  test("can add users", async () => {
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    const res1 = await api.post("/api/users").send(newUser).expect(200);
    expect(res1.body).toHaveProperty("id");
    const res2 = await api.get(`/api/users/${res1.body.id}`);
    expect(res2.body).toHaveProperty("username", "root");
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

describe("users login test", () => {
  test("can get token", async () => {
    const signedUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    const res = await api.post("/api/login").send(signedUser);
    expect(res.body).toHaveProperty("token");
  });
});

describe("users delete test", () => {
  test("would return 400 if bad request", async () => {
    const userToDelete = {
      fff: "root",
      kkk: "Superuser",
      password: "fkkkkyou",
    };
    await api.delete("/api/users").send(userToDelete).expect(400);
  });
  test("can delete user", async () => {
    const userToDelete = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    await api.delete("/api/users").send(userToDelete).expect(204);
  });
  test("would return 404 if not exist", async () => {
    const userToDelete = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    await api.delete("/api/users").send(userToDelete).expect(404);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
