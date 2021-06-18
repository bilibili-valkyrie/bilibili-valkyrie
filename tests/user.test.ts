import mongoose from "mongoose";
import User from "../models/User";
import api from "./helper/apiInstance";
import tokenStorage from "./helper/tokenStorage";
import userUsedForTest from "./helper/userUsedForTest";

beforeAll(async () => {
  await User.deleteMany();
});

describe("users add test", () => {
  test("can add users", async () => {
    const res1 = await api.post("/api/users").send(userUsedForTest).expect(200);
    expect(res1.body).toHaveProperty("id");
    const res2 = await api.post("/api/login").send(userUsedForTest);
    tokenStorage.setToken(res2.body.token);
    const res3 = await api
      .get(`/api/users/${res1.body.username}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res3.body).toHaveProperty("username", "root");
  });

  test("would return 409 if conflict", async () => {
    await api.post("/api/users").send(userUsedForTest).expect(409);
  });
});

describe("users login test", () => {
  test("can get token", async () => {
    const res = await api.post("/api/login").send(userUsedForTest);
    expect(res.body).toHaveProperty("token");
  });
  test("user cannot login with a wrong password", async () => {
    await api
      .post("/api/login")
      .send({ ...userUsedForTest, password: "asdfghjkl;" })
      .expect(401);
  });
});

describe("users delete test", () => {
  test("would return 400 if bad request", async () => {
    const userToDelete = {
      fff: "root",
      kkk: "Superuser",
      password: "fkkkkyou",
    };
    await api
      .delete("/api/users")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send(userToDelete)
      .expect(400);
  });
  test("can delete user", async () => {
    const userToDelete = userUsedForTest;
    await api
      .delete("/api/users")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send(userToDelete)
      .expect(204);
  });
  test("would return 404 if not exist", async () => {
    const userToDelete = userUsedForTest;
    await api
      .delete("/api/users")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send(userToDelete)
      .expect(404);
  });
});

describe("users basic test", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
