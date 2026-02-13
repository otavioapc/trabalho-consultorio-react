
const db = require('../models/ConnectDatabase');

class AtendimentoRepository{

  async findAll(){
       const rows = await db.query(`SELECT * from atendimentos`)
       return rows;
  }
  async findById(id){
      const [row] = await db.query(`SELECT * FROM atendimentos WHERE id = ? 
        `,
      [id]
    )
       return row;
  }

  async create({paciente_id, profissional_id, data_atendimento, diagnostico}) {
      const diagnosticoTratado = diagnostico === undefined ? null : diagnostico;

      const result = await db.query(`insert into atendimentos (paciente_id, profissional_id, data_atendimento, diagnostico) values (?, ?,?,?)`,
      [paciente_id, profissional_id, data_atendimento, diagnosticoTratado])

      const insertedId = result.insertId
      return {
        id: insertedId,
        paciente_id,
        profissional_id,
        data_atendimento,
        diagnostico
        }
    }

  async update(id, { paciente_id, profissional_id, data_atendimento, diagnostico }) {
    const result = await db.query(
        `UPDATE atendimentos SET 
            paciente_id = ?, 
            profissional_id = ?, 
            data_atendimento = ?, 
            diagnostico = ?,
            updated_at = NOW() 
        WHERE id = ?`,
        [paciente_id, profissional_id, data_atendimento, diagnostico, id]
    );
    return result;
}

  async delete(id){
     const deleteItem = await db.query(`DELETE FROM atendimentos WHERE id = ? 
      `,
      [id]
    )
       return deleteItem;
  }


}

module.exports = new AtendimentoRepository();