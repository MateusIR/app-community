
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migration", () => {
  describe("Anonymous User", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migration", {
        method: "POST",
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toEqual(true);

      expect(responseBody.length).toBeGreaterThan(0);
    });
    test("Running for the second time", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/migration", {
        method: "POST",
      });
      expect(response1.status).toBe(200);

      const responseBody = await response1.json();

      expect(Array.isArray(responseBody)).toEqual(true);

      expect(responseBody.length).toBe(0);
    });
  });
});
