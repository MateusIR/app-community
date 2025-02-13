import { join } from "node:path";
import migrationRuner from "node-pg-migrate";
import database from "infra/database.js";

export default async function migration(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "POST") {
      const migratedMigrations = await migrationRuner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
    if (request.method === "GET") {
      const pendingMigrations = await migrationRuner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
