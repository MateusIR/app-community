import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP schema public cascade; create schema public;");
})

test("POST /api/v1/migration should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migration",{
    method: "POST",})
  expect(response.status).toBe(201);  

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toEqual(true);

  expect(responseBody.length).toBeGreaterThan(0);

});
test("POST /api/v1/migration should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migration",{
    method: "POST",})
  expect(response1.status).toBe(200);  

  const responseBody = await response1.json();

  expect(Array.isArray(responseBody)).toEqual(true);

  expect(responseBody.length).toBe(0);

});

