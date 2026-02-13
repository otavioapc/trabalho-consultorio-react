const db = require('../models/ConnectDatabase');

class ProfissionalRepository {
  async findAll() {
    const rows = await db.query(`SELECT * from profissionais`);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`SELECT * FROM profissionais WHERE id = ?`, [id]);
    return row;
  }

  async findByNome(nome) {
    const [row] = await db.query(`SELECT * FROM profissionais WHERE nome = ?`, [nome]);
    return row;
  }

  async findByCrm(crm) {
    const [row] = await db.query(`SELECT * FROM profissionais WHERE crm = ?`, [crm]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query(`SELECT * FROM profissionais WHERE email = ?`, [email]);
    return row;
  }

  async create({ nome, crm, especialidade_id, telefone, email }) {
    const result = await db.query(
      `INSERT INTO profissionais (nome, crm, especialidade_id, telefone, email) VALUES (?, ?, ?, ?, ?)`,
      [nome, crm, especialidade_id, telefone, email]
    );

    const insertedId = result.insertId;
    return {
      id: insertedId,
      nome,
      crm,
      especialidade_id,
      telefone,
      email
    };
  }

  async update(id, { nome, crm, especialidade_id, telefone, email }) {
    const result = await db.query(
      `UPDATE profissionais SET nome = ?, crm = ?, especialidade_id = ?, telefone = ?, email = ? WHERE id = ?`,
      [nome, crm, especialidade_id, telefone, email, id]
    );
    return result;
  }

  async delete(id) {
    const deleteItem = await db.query(`DELETE FROM profissionais WHERE id = ?`, [id]);
    return deleteItem;
  }
}

module.exports = new ProfissionalRepository();