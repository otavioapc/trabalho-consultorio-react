const mysql = require("mysql2/promise");

const client = mysql.createPool({
  host: "45.132.157.52",
  port: 3306,
  user: "u864744069_tassy",
  password: "Tassy692416+",
  database: "u864744069_jpa_exemplo",
  waitForConnections: true,       // Esperar por conexões disponíveis
  connectionLimit: 10,            // Número máximo de conexões no pool
  queueLimit: 0,                  // Sem limite de fila (0 = ilimitado)
  idleTimeout: 60000,             // Encerrar conexões inativas após 60s
  enableKeepAlive: true,          // Manter conexões vivas
  keepAliveInitialDelay: 10000,   // Enviar ping a cada 10s
});


const testConnection = async () => {
  try {
    const connection = await client.getConnection();
    console.log("MySQL conectado com sucesso!");
    connection.release(); 
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
};


exports.query = async (_query, values = []) => {
  let connection;
  try {
    connection = await client.getConnection(); 
    const [rows] = await connection.execute(_query, values);
    return rows;
  } catch (error) {
    console.error("❌ Database query error:", error);
    
  
    if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log("🔄 Tentando reconectar ao banco de dados...");
      await testConnection(); 
      return exports.query(_query, values); 
    }

    throw error;
  } finally {
    if (connection) connection.release(); 
  }
};

exports.testConnection = testConnection;