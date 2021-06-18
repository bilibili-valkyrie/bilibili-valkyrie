import { getUnixTime } from "date-fns";
import mongoose from "mongoose";
import Uper from "../models/Uper";
import User from "../models/User";
import Video from "../models/Video";
import wait from "../utils/wait";
import api from "./helper/apiInstance";
import dbRWhelper from "./helper/dbRWhelper";
import tokenStorage from "./helper/tokenStorage";
import userUsedForTest from "./helper/userUsedForTest";

let uperInDB: { id: string; archive_count: number }; // 用户1订阅的up主的必要信息
let userToken2: string; // 用户2的Token
const user2 = {
  username: "ChenRui",
  name: "Five",
  password: "fkkkkyou",
}; // 用户2的信息

beforeAll(async () => {
  await Promise.all([Uper.deleteMany(), Video.deleteMany(), User.deleteMany()]);
});

describe("user sign up test", () => {
  test("user can sign up", async () => {
    const res = await api.post("/api/users").send(userUsedForTest).expect(200);
    expect(res.body).toHaveProperty("id");
    await api.post("/api/users").send(user2).expect(200);
  });

  test("would return 409 if username already exist", async () => {
    await api.post("/api/users").send(userUsedForTest).expect(409);
  });
});

describe("user login test", () => {
  test("user can login", async () => {
    const res1 = await api.post("/api/login").send(userUsedForTest).expect(200);
    tokenStorage.setToken(res1.body.token);
    const res2 = await api.post("/api/login").send(user2);
    userToken2 = res2.body.token;
    const res3 = await api
      .get(`/api/users`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res3.body[0]).toHaveProperty("username", userUsedForTest.username);
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

    // 以第二个用户添加同一个up主的订阅，TA的订阅与视频应该与第一个用户相区分
    const res2 = await api
      .get("/api/sub/addSubscribe/66607740")
      .set("authorization", `bearer ${userToken2}`);
    expect(res2.body.card.mid).toBe("66607740");
    expect(res2.body.card.name).toBe("宋浩老师官方");
  });

  test("should return 409 if conflict", async () => {
    const res = await api
      .get("/api/sub/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res.statusCode).toBe(409);
  });

  test("invalid subscribe should return 400", async () => {
    const res = await api
      .get("/api/sub/addSubscribe/abdcfd")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(400);
    expect(res.text).toBe("abdcfd is not valid.");
  });
});

describe("user update subscribe test", () => {
  test("can get all status", async () => {
    const res = await api
      .get("/api/sub/getAllstatus")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(200);
    [uperInDB] = res.body;
  });
  test("can mark subscribe as read", async () => {
    const res = await api
      .get(`/api/sub/getStatus/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const firstUpdate = res.body.lastUpdate;
    await wait(1000);
    const res2 = await api
      .put(`/api/sub/markSubscribeRead/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const secondUpdate = res2.body.lastUpdate;
    expect(firstUpdate === secondUpdate).toBe(false);
  });

  test("can set subscribe's lastUpdate time", async () => {
    const res = await api
      .get(`/api/sub/getStatus/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const firstUpdate = res.body.lastUpdate;
    await wait(1000);
    const now = Date.now();
    const res2 = await api
      .put(`/api/sub/changeSubscribeReadTime/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send({ lastUpdateJS: now });
    const secondUpdate = res2.body.lastUpdate;
    expect(secondUpdate).toBe(getUnixTime(now));
    expect(firstUpdate === secondUpdate).toBeFalsy();
  });

  test("can get updated videos", async () => {
    const res1 = await api
      .get(`/api/sub/getUpdate/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res1.body).toStrictEqual([]);
    const res2 = await api
      .get(`/api/sub/getStatus/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const lastUpdateUnix = res2.body.videos[1].created;
    await api
      .put(`/api/sub/changeSubscribeReadTime/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send({ lastUpdateUnix });
    const res3 = await api
      .get(`/api/sub/getUpdate/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res3.body.length).toBe(2);
  });

  test("can update uper's videos", async () => {
    const firstArchiveCount = uperInDB.archive_count;
    const res1 = await api
      .get(`/api/sub/updateVideos/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res1.body.updates).toBeGreaterThanOrEqual(0);
    if (res1.body.updates > 0) {
      expect(res1.body.newUper.archive_count).toBe(firstArchiveCount);
    }
  });
});

describe("user and subscribe delete test", () => {
  test("can remove subscribe", async () => {
    await api
      .delete(`/api/sub/delSubscribe/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(204);
    const res1 = await api
      .get(`/api/sub/getStatus/${uperInDB.id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res1.body).toStrictEqual({});

    // 重新添加订阅，为验证此前订阅已被删除，同时为用户1的注销作准备
    const res2 = await api
      .get("/api/sub/addSubscribe/66607740")
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res2.statusCode).toBe(200);
  });

  test("user can write off", async () => {
    const usersBeforeWriteOff = await dbRWhelper.usersInDB();
    expect(usersBeforeWriteOff.length).toBe(2);
    const userToDelete = userUsedForTest;
    await api
      .delete("/api/users")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send(userToDelete)
      .expect(204);
    const usersAfterWriteOff = await dbRWhelper.usersInDB();
    expect(usersAfterWriteOff.length).toBe(1);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
