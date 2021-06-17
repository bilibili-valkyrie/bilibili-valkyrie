import mongoose from "mongoose";
import Uper from "../models/Uper";
import Video from "../models/Video";
import initDB from "./helper/testdb_init";
import api from "./helper/apiInstance";

beforeAll(async () => {
  await Uper.deleteMany();
  await Video.deleteMany();
});

describe("Basic Test", () => {
  test("status is returned as json", async () => {
    await api
      .get("/api/getAllStatus")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("Subscribe basic test", () => {
  test("can add subscribe", async () => {
    const res = await api.get("/api/subAR/addSubscribe/66607740");
    expect(res.body.card.mid).toBe("66607740");
    expect(res.body.card.name).toBe("宋浩老师官方");
  });

  test("should return 409 if conflict", async () => {
    const res = await api.get("/api/subAR/addSubscribe/66607740");
    expect(res.statusCode).toBe(409);
  });

  test("can remove subscribe", async () => {
    const uperInDB = await initDB();
    await api.delete(`/api/subAR/delSubscribe/${uperInDB._id}`).expect(204);
    const res = await api.get("/api/subAR/addSubscribe/66607740");
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
