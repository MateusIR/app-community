
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
function DBStatus(){
   const {isLoading, data} = useSWR("/api/v1/status", fetchAPI);
  let dbVersionText,dbConnectionsText,dbMaxConnectionsText = "carregando..."
  if (!isLoading && data){
    dbVersionText = data.dependencies.database.version
    dbConnectionsText = data.dependencies.database.open_connections
    dbMaxConnectionsText = data.dependencies.database.max_connections
    
  }
  
  return(
  <div>gi
    <h1>Status do DB</h1>
    Versão do DB: <strong>{dbVersionText}</strong><br></br>
    Conexões abertas: <strong>{dbConnectionsText}</strong> <br></br>
    Máximo de Conexões: <strong>{dbMaxConnectionsText}</strong>
  </div>
  );
}


function UpdatedAt(){
 const {isLoading, data} = useSWR("/api/v1/status", fetchAPI,{
  refreshInterval: 2000,
 });

let updatedAtText = "carregando..."
if (!isLoading && data)
  updatedAtText = new Date(data.updated_at).toLocaleString("pt-br")

return (
  <div>
    Última atualização: <strong>{updatedAtText}</strong>
  </div>
);
}

export default function StatusPage() {
return(
  <>
<h1>Status:</h1>
<UpdatedAt/>
<DBStatus/>
</>
);
}