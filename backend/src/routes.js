const {Router} = require("express");

const EspecialidadeController = require("./controllers/EspecialidadeController");
const PacienteController = require("./controllers/PacienteController");
const ProfissionalController = require("./controllers/ProfissionalController");
const AtendimentoController = require("./controllers/AtendimentoController");



const routes = Router();



//Category routes
routes.get("/especialidade", EspecialidadeController.index);
routes.get("/especialidade/:id", EspecialidadeController.show);
routes.post("/especialidade", EspecialidadeController.store);
routes.put("/especialidade/:id", EspecialidadeController.update);
routes.delete("/especialidade/:id", EspecialidadeController.delete)

//Category routes
routes.get("/paciente", PacienteController.index);
routes.get("/paciente/:id", PacienteController.show);
routes.get("/paciente/cpf/:cpf", PacienteController.showCpf);
routes.post("/paciente", PacienteController.store);
routes.put("/paciente/:id", PacienteController.update);
routes.delete("/paciente/:id", PacienteController.delete)

//Category routes
routes.get("/profissional", ProfissionalController.index);
routes.get("/profissional/:id", ProfissionalController.show);
routes.post("/profissional", ProfissionalController.store);
routes.put("/profissional/:id", ProfissionalController.update);
routes.delete("/profissional/:id", ProfissionalController.delete)

//Category routes
routes.get("/atendimento", AtendimentoController.index);
routes.get("/atendimento/:id", AtendimentoController.show);
routes.post("/atendimento", AtendimentoController.store);
routes.put("/atendimento/:id", AtendimentoController.update);
routes.delete("/atendimento/:id", AtendimentoController.delete)



module.exports = routes;