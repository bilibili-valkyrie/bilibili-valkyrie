import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import Uper from "../models/Uper";
import Video from "../models/Video";
import wait from "../utils/wait";

const api = supertest(app);

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
    const res = await api.get("/api/addSubScribe/66607740");
    expect(res.body.card.mid).toBe("66607740");
    expect(res.body.card.name).toBe("宋浩老师官方");
  });

  test("should return 409 if conflict", async () => {
    const res = await api.get("/api/addSubScribe/66607740");
    expect(res.statusCode).toBe(409);
  });

  test("can remove subscribe", async () => {
    await api.delete("/api/delSubScribe/66607740").expect(204);
    const res = await api.get("/api/addSubScribe/66607740");
    expect(res.statusCode).toBe(200);
  });
});

describe("Subscribe update test", () => {
  test("can update subscribe's lastupdate", async () => {
    const res = await api.get("/api/getStatus/66607740");
    const firstUpdate = res.body.lastUpdate;
    await wait(1000);
    const res2 = await api.put("/api/markSubScribeRead/66607740");
    const secondUpdate = res2.body.lastUpdate;
    expect(firstUpdate === secondUpdate).toBe(false);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
