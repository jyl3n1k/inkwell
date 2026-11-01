import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { errorHandler } from "../error-handler.js";
import { logger } from "../../lib/logger.js";

const originalEnvironment = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = originalEnvironment;
  jest.restoreAllMocks();
});

test.each(["production", "development"])("error responses in %s", async (environment) => {
  process.env.NODE_ENV = environment;
  const log = jest.spyOn(logger, "error").mockImplementation(() => {});
  const app = express();
  app.get("/failure", () => { throw new Error("private database details"); });
  app.use(errorHandler);
  const response = await request(app).get("/failure");
  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: {
    code: "INTERNAL_ERROR",
    message: environment === "production" ? "Something went wrong." : "private database details",
  } });
  expect(log).toHaveBeenCalledWith({ err: expect.any(Error) }, "Request failed");
});
