
import {join} from "node:path"
import migrationRuner from "node-pg-migrate"
export default async function migration(request, response) {

  const defaultMigrationOptions = { 
    databaseUrl: process.env.DATABASE_URL,
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
 if (migratedMigrations.length > 0) {
  return response.status(201).json(migratedMigrations);
 }

 return response.status(200).json(migratedMigrations);

  }
  if (request.method === "GET"){
    const pendingMigrations = await migrationRuner(defaultMigrationOptions)
   return response.status(200).json(pendingMigrations);
  }
    response.status(405).end(`Method ${request.method} Not Allowed`);
}


