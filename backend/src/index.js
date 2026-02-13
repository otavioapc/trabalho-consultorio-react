const express = require("express");
const cors = require('cors')
const db = require("./models/ConnectDatabase");
const routes = require("./routes");

const app = express();
app.use(cors());
const port = 3000;

// Conexão com o banco de dados
db.testConnection().catch((err) => {
  console.error(
    "Não foi possível conectar ao banco de dados. Encerrando o aplicativo."
  );
  process.exit(1);
});

app.use(express.json());
app.use(routes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
