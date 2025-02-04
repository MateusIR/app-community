
import {join} from "node:path"
import migrationRuner from "node-pg-migrate"
import database from "infra/database.js"

export default async function migration(request, response) {

  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = { 
    dbClient: dbClient, 
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations"}

 if (request.method === "POST"){
  const migratedMigrations = await migrationRuner({
    ...defaultMigrationOptions,
    dryRun: false
  })

  await dbClient.end();

 if (migratedMigrations.length > 0) {
  return response.status(201).json(migratedMigrations);
 }

 return response.status(200).json(migratedMigrations);

  }
  if (request.method === "GET"){
    const pendingMigrations = await migrationRuner(defaultMigrationOptions)
    await dbClient.end();
   return response.status(200).json(pendingMigrations);
  }
    response.status(405).end(`Method ${request.method} Not Allowed`);
}


