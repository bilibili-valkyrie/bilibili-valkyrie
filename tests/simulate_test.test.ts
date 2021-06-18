import mongoose from "mongoose";
import api from "./helper/apiInstance";
import Uper from "../models/Uper";
import User from "../models/User";
import Video from "../models/Video";
import tokenStorage from "./helper/tokenStorage";
import userUsedForTest from "./helper/userUsedForTest";

beforeAll(async () => {
  await Promise.all([Uper.deleteMany(), Video.deleteMany(), User.deleteMany()]);
});

describe("user sign up test", () => {
  test("user can sign up", async () => {
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    const res1 = await api.post("/api/users").send(newUser).expect(200);
    expect(res1.body).toHaveProperty("id");
  });

  test("would return 409 if username already exist", async () => {
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    await api.post("/api/users").send(newUser).expect(409);
  });
});

describe("user login test", () => {
  test("user can login", async () => {
    const res1 = await api.post("/api/login").send(userUsedForTest);
    tokenStorage.setToken(res1.body.token);
    const res2 = await api
      .get(`/api/users`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res2.body[0]).toHaveProperty("username", "root");
  });

  test("user cannot login with a wrong password", async () => {
    await api
      .post("/api/login")
      .send({ ...userUsedForTest, password: "asdfghjkl;" })
      .expect(401);
  });
});

describe("subscribing test", () => {
  test("status is returned as json", async () => {
    await api
      .get("/api/sub/getAllStatus")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("can add subscribe", async () => {
    const res = await api
      .get("/api/sub/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res.body.card.mid).toBe("66607740");
    expect(res.body.card.name).toBe("宋浩老师官方");
  });

  test("should return 409 if conflict", async () => {
    const res = await api
      .get("/api/sub/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res.statusCode).toBe(409);
  });

  test("invalid subscribe", async () => {
    const res = await api
      .get("/api/sub/addSubscribe/abdcfd")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(400);
    expect(res.text).toBe("abdcfd is not valid.");
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
