// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import app from "../../expressApp";

class Api {
  api: supertest.SuperTest<supertest.Test>;

  constructor(apiToCreate: Express.Application) {
    this.api = supertest(apiToCreate);
  }
}

const apiInstance = new Api(app);

export default apiInstance.api;
