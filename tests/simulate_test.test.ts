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
    const res = await api.post("/api/users").send(userUsedForTest).expect(201);
    expect(res.body).toHaveProperty("username");
    await api.post("/api/users").send(user2).expect(201);
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
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(201);
    expect(res.body.card.mid).toBe("66607740");
    expect(res.body.card.name).toBe("宋浩老师官方");

    // 以第二个用户添加同一个up主的订阅，TA的订阅与视频应该与第一个用户相区分
    const res2 = await api
      .get("/api/sub/addSubscribe/66607740")
      .set("authorization", `bearer ${userToken2}`);
    expect(res2.body.card.mid).toBe("66607740");
    expect(res2.body.card.name).toBe("宋浩老师官方");
  });

  // 同一个用户当然不应该能重复订阅同一个up主
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
    expect(res2.statusCode).toBe(201);
  });

  test("user can write off", async () => {
    const usersBeforeWriteOff = await dbRWhelper.usersInDB();
    expect(usersBeforeWriteOff.length).toBe(2);
    const upersBeforeWriteOff = await dbRWhelper.upersInDB();
    expect(upersBeforeWriteOff.length).toBe(2);
    const videosBeforeWriteOff = await dbRWhelper.videosInDB();
    expect(videosBeforeWriteOff.length).toBe(60);
    await api
      .delete("/api/users")
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send({ password: userUsedForTest.password })
      .expect(204);
    const usersAfterWriteOff = await dbRWhelper.usersInDB();
    expect(usersAfterWriteOff.length).toBe(1);
    const upersAfterWriteOff = await dbRWhelper.upersInDB();
    expect(upersAfterWriteOff.length).toBe(1);
    const videosAfterWriteOff = await dbRWhelper.videosInDB();
    expect(videosAfterWriteOff.length).toBe(30);
  });

  test("should not able to login after write off", async () => {
    await api.post("/api/login").send(userUsedForTest).expect(401);
  });

  test("should not able to use old token after write off", async () => {
    await api
      .get(`/api/users`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .expect(401);
  });
});

describe("user modify test", () => {
  test("user can modify their username", async () => {
    await api
      .put("/api/users")
      .set("authorization", `bearer ${userToken2}`)
      .send({
        username: "XuYi",
        oldPassword: user2.password,
        newPassword: userUsedForTest.password,
      })
      .expect(200);
    const usersInDB = await dbRWhelper.usersInDB();
    expect(usersInDB[0]).toHaveProperty("username", "XuYi");
  });

  test("should not able to use old token after modifying info", async () => {
    const usersInDB = await dbRWhelper.usersInDB();
    expect(usersInDB[0].tokenRevoked).toBe(true);
    await api
      .get(`/api/users`)
      .set("authorization", `bearer ${userToken2}`)
      .expect(401);
  });

  test("can login with new info", async () => {
    const res = await api
      .post("/api/login")
      .send({ username: "XuYi", password: userUsedForTest.password })
      .expect(200);
    userToken2 = res.body.token;
  });

  test("cannot use old token after revoking token", async () => {
    await api
      .get("/api/login/revokeToken")
      .set("authorization", `bearer ${userToken2}`)
      .expect(200);
    await api
      .get(`/api/users`)
      .set("authorization", `bearer ${userToken2}`)
      .expect(401);
  });

  test("can login again after old token was revoked", async () => {
    const res = await api
      .post("/api/login")
      .send({ username: "XuYi", password: userUsedForTest.password })
      .expect(200);
    expect(res.body).toHaveProperty("token");
    userToken2 = res.body.token;
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
