
const db = require('../models/ConnectDatabase');

class EspecialidadeRepository{

  async findAll(){
       const rows = await db.query(`SELECT * from especialidade`)
       return rows;
  }
  async findById(id){
      const [row] = await db.query(`SELECT * FROM especialidade WHERE id = ? 
        `,
      [id]
    )
       return row;
  }

   async findByName(nome) {
      const [row] = await db.query(`SELECT * FROM especialidade WHERE descricao = ?`, [nome]);
      return row;
    }
  
  async create({descricao}) {
      const result = await db.query(`insert into especialidade (descricao) values (?)`,
      [descricao])

      const insertedId = result.insertId
      return {
        id: insertedId,
        descricao
        }
    }

  async update(id, {descricao}){
      const result = await db.query(`UPDATE especialidade SET descricao = ? where id = ?`,
      [descricao, id])

      return result;
  }

  async delete(id){
     const deleteItem = await db.query(`DELETE FROM especialidade WHERE id = ?`,
      [id]
    )
       return deleteItem;
  }


}

module.exports = new EspecialidadeRepository();