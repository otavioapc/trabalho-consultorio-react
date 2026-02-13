const PacienteRepository = require('../repositories/PacienteRepository');

class PacienteController{

  async index (request, response){
    const paciente = await PacienteRepository.findAll();
    response.json(paciente);
  }

  async show(request, response){
    const {id} = request.params;
    const paciente = await PacienteRepository.findById(id);

     if(!paciente){
        return response.status(404).json({error: "paciente noa encontrado"});
        }
     response.json(paciente);
  
  }

  async showCpf(req, res) {
  try {
    const { cpf } = req.params;
    
    if (!cpf) {
      return res.status(400).json({ error: "Parâmetro 'cpf' é obrigatório" });
    }
    console.log('CPF recebido:', cpf);
    const paciente = await PacienteRepository.findByCpf(cpf);
    console.log('Paciente encontrado:', paciente); 
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    return res.status(200).json(paciente);

  } catch (error) {
    console.error('Erro na busca por CPF:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

  async store(request, response){
        const {nome, cpf, data_nascimento, telefone, email, endereco} = request.body;
  
        if(!nome || !cpf || !data_nascimento ){
          return response.status(403).json({error: "O nome, cpf e ano de dascimento precisa ser informado"})
        }
        const paciente = await PacienteRepository.create({nome, cpf, data_nascimento, telefone, email, endereco});
        response.status(201).json(paciente);

    }

  async update(request, response) {
    const {id} = request.params;
    const {nome, cpf, data_nascimento, telefone, email, endereco} = request.body;

    const pac = await PacienteRepository.findById(id);
    if(!pac) {
        return response.status(404).json({error: "paciente nao encontrado"});
    }

    if(nome && nome !== pac.nome) {  
        const pacienteByNome = await PacienteRepository.findByNome(nome);
        
    }

    await PacienteRepository.update(id, {
        nome: nome ?? pac.nome,
        cpf: cpf ?? pac.cpf,
        data_nascimento: data_nascimento ?? pac.data_nascimento,
        telefone: telefone ?? pac.telefone,
        email: email ?? pac.email,
        endereco: endereco ?? pac.endereco
    });

    const upDatePac = await PacienteRepository.findById(id);
    response.status(200).json(upDatePac);
}

async delete(req, res) {
  try {
    await PacienteRepository.delete(req.params.id)
    res.sendStatus(204)
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(400).json({
        error: 'Este paciente possui atendimentos vinculados e não pode ser excluído.'
      })
    }

    console.error('Erro ao excluir paciente:', error)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
}



}

module.exports = new PacienteController();