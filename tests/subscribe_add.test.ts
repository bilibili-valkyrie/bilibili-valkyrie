import mongoose from "mongoose";
import Uper from "../models/Uper";
import Video from "../models/Video";
import initDB from "./helper/testdb_init";
import api from "./helper/apiInstance";
import tokenStorage from "./helper/tokenStorage";
import initUsers from "./helper/initUsers";

beforeAll(async () => {
  await Uper.deleteMany();
  await Video.deleteMany();
});

describe("Basic Test", () => {
  test("get token", async () => {
    await initUsers();
    const signedUser = {
      username: "root",
      name: "Superuser",
      password: "fkkkkyou",
    };
    const res = await api.post("/api/login").send(signedUser);
    expect(res.body).toHaveProperty("token");
    tokenStorage.setToken(res.body.token);
  });
  test("status is returned as json", async () => {
    await api
      .get("/api/getAllStatus")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("Subscribe basic test", () => {
  test("can add subscribe", async () => {
    const res = await api
      .get("/api/subAR/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res.body.card.mid).toBe("66607740");
    expect(res.body.card.name).toBe("宋浩老师官方");
  });

  test("should return 409 if conflict", async () => {
    const res = await api
      .get("/api/subAR/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res.statusCode).toBe(409);
  });

  test("can remove subscribe", async () => {
    const uperInDB = await initDB();
    await api
      .delete(`/api/subAR/delSubscribe/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(204);
    const res = await api
      .get("/api/subAR/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
