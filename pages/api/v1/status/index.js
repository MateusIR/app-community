import database from "infra/database.js"
async function status(request, response) {
  const updatetAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query("SHOW max_connections;");
  const databaseMaxConnectionValue = databaseMaxConnectionResult.rows[0].max_connections;
  
  const databaseOpenConnectionsResult = await database.query({
    text:"SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]}); 
  const databaseOpenConnectionsValue = databaseOpenConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatetAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionValue),
        open_connections: databaseOpenConnectionsValue
        

      }
    }

  });

}


export default status 