import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./index.js";

describe("GET /products", () => {
  it("should return a list of products", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("reviews");
  });
});
