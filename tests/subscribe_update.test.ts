import getUnixTime from "date-fns/getUnixTime";
import mongoose from "mongoose";
import wait from "../utils/wait";
import initDB from "./helper/testdb_init";
import api from "./helper/apiInstance";
import initUsers from "./helper/initUsers";
import tokenStorage from "./helper/tokenStorage";

describe("Get token for test", () => {
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
});

describe("Subscribe update test", () => {
  test("can mark subscribe as read", async () => {
    const uperInDB = await initDB();
    const res = await api
      .get(`/api/getStatus/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const firstUpdate = res.body.lastUpdate;
    await wait(1000);
    const res2 = await api
      .put(`/api/subU/markSubscribeRead/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const secondUpdate = res2.body.lastUpdate;
    expect(firstUpdate === secondUpdate).toBe(false);
  });

  test("can set subscribe's lastUpdate time", async () => {
    const uperInDB = await initDB();
    const res = await api
      .get(`/api/getStatus/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const firstUpdate = res.body.lastUpdate;
    await wait(1000);
    const now = Date.now();
    const res2 = await api
      .put(`/api/subU/changeSubscribeReadTime/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send({ lastUpdateJS: now });
    const secondUpdate = res2.body.lastUpdate;
    expect(secondUpdate).toBe(getUnixTime(now));
    expect(firstUpdate === secondUpdate).toBeFalsy();
  });

  test("can get updated videos", async () => {
    const uperInDB = await initDB();
    const res1 = await api
      .get(`/api/subU/getUpdate/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res1.body).toStrictEqual([]);
    const res2 = await api
      .get(`/api/getStatus/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    const lastUpdateUnix = res2.body.videos[1].created;
    await api
      .put(`/api/subU/changeSubscribeReadTime/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`)
      .send({ lastUpdateUnix });
    const res3 = await api
      .get(`/api/subU/getUpdate/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res3.body.length).toBe(2);
  });

  test("can update uper's videos", async () => {
    const uperInDB = await initDB();
    const firstArchiveCount = uperInDB.archive_count;
    const res1 = await api
      .get(`/api/subU/updateVideos/${uperInDB._id}`)
      .set("authorization", `bearer ${tokenStorage.token}`);
    expect(res1.body.updates).toBeGreaterThan(0);
    expect(res1.body.newUper.archive_count === firstArchiveCount).toBeFalsy();
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
