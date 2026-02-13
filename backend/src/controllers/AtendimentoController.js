const AtendimentoRepository = require('../repositories/AtendimentoRepository');

class AtendimentoController{

  async index (request, response){
    const prof = await AtendimentoRepository.findAll();
    response.json(prof);
  }

  async show(request, response){
    const {id} = request.params;
    const prof = await AtendimentoRepository.findById(id);

     if(!prof){
        return response.status(404).json({error: "atendimento noa encontrado"});
        }
     response.json(prof);
  
  }

  async store(request, response){
        const {paciente_id, profissional_id, data_atendimento, diagnostico} = request.body;
  
        if(!paciente_id || !profissional_id ){
          return response.status(403).json({error: "O nome e crm precisa ser informado"})
        }
        const paciente = await AtendimentoRepository.create({paciente_id, profissional_id, data_atendimento, diagnostico});
        response.status(201).json(paciente);

    }

  async update(request, response) {
    const { id } = request.params;
    const { paciente_id, profissional_id, data_atendimento, diagnostico } = request.body;

    try {
        const atendimento = await AtendimentoRepository.findById(id);
        if (!atendimento) {
            return response.status(404).json({ error: "Atendimento não encontrado" });
        }
        if (paciente_id) {
            const pacienteExists = await PacienteRepository.findById(paciente_id);
            if (!pacienteExists) {
                return response.status(400).json({ error: "Paciente não encontrado" });
            }
        }
        if (profissional_id) {
            const profissionalExists = await ProfissionalRepository.findById(profissional_id);
            if (!profissionalExists) {
                return response.status(400).json({ error: "Profissional não encontrado" });
            }
        }
        await AtendimentoRepository.update(id, {
            paciente_id: paciente_id ?? atendimento.paciente_id,
            profissional_id: profissional_id ?? atendimento.profissional_id,
            data_atendimento: data_atendimento ?? atendimento.data_atendimento,
            diagnostico: diagnostico ?? atendimento.diagnostico
        });
        const atendimentoAtualizado = await AtendimentoRepository.findById(id);
        return response.status(200).json(atendimentoAtualizado);

    } catch (error) {
        console.error("Erro ao atualizar atendimento:", error);
        return response.status(500).json({ error: "Erro interno ao atualizar atendimento" });
    }
}
  async delete(request, response){
      const {id} = request.params;

      if(!id){
        return response.status(400).json({message: "id do atendimento invalido"})
      }

      await AtendimentoRepository.delete(id);
      response.status(204).json({message: "excluido com sucesso"});
  }

}

module.exports = new AtendimentoController();