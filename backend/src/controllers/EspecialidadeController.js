const EspecialidadeRepository = require('../repositories/EspecialidadeRepository');

class EspecialidadeController{

  async index (request, response){
    const especialidade = await EspecialidadeRepository.findAll();
    response.json(especialidade);
  }

  async show(request, response){
    const {id} = request.params;
    const especialidade = await EspecialidadeRepository.findById(id);

     if(!especialidade){
        return response.status(404).json({error: "especialidade noa encontrado"});
        }
     response.json(especialidade);
  
  }

  async store(request, response){
        const {descricao} = request.body;
        if(!descricao){
          return response.status(403).json({error: "O nome da categoria precisa ser informado"})
        }
        const especialidade = await EspecialidadeRepository.create({descricao});
        response.status(201).json(especialidade);
    }

  async update(request, response){
  
     const {id} = request.params;
     const {descricao} = request.body;

     const espec = await EspecialidadeRepository.findById(id);
     if(!espec){
      return response.status(404).json({error: "contato nao encontrado"})
     }

     if(descricao){
        const especialidadeByNome = await EspecialidadeRepository.findByName(descricao);

        if(especialidadeByNome){
          return response.status(400).json({error: "esse nome ja está sendo usado"});
        }
      }

        await EspecialidadeController.update(id, {
        descricao: descricao ?? especialidade.descricao})

      const upDateCat = await EspecialidadeRepository.findById(id)
      response.status(200).json(upDateCat);

  }

async delete(req, res) {
  try {
    await EspecialidadeRepository.delete(req.params.id);
    res.sendStatus(204); 
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      return res.status(400).json({
        error: 'Esta especialidade está vinculada a um ou mais profissionais e não pode ser excluída.'
      });
    }

    console.error('Erro ao excluir especialidade:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

}

module.exports = new EspecialidadeController();