import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'

import PacientesList from './pages/Pacientes/PacientesList/index.jsx'
import PacientesForm from './pages/Pacientes/PacientesForm/index.jsx'
import ProfissionaisList from './pages/Profissionais/ProfissionaisList/index.jsx'
import ProfissionaisForm from './pages/Profissionais/ProfissionaisForm/index.jsx'
import EspecialidadesList from './pages/Especialidades/EspecialidadeList/index.jsx'
import EspecialidadesForm from './pages/Especialidades/EspecialidadeForm/index.jsx'
import AtendimentosList from './pages/Atendimentos/AtendimentosList/index.jsx'
import AtendimentosForm from './pages/Atendimentos/AtendimentosForm/index.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/pacientes" element={<PacientesList />} />
        <Route path="/pacientes/novo" element={<PacientesForm />} />

        <Route path="/profissionais" element={<ProfissionaisList />} />
        <Route path="/profissionais/novo" element={<ProfissionaisForm />} />

        <Route path="/especialidades" element={<EspecialidadesList />} />
        <Route path="/especialidades/novo" element={<EspecialidadesForm />} />

        <Route path="/atendimentos" element={<AtendimentosList />} />
        <Route path="/atendimentos/novo" element={<AtendimentosForm />} />
      </Routes>
    </>
  )
} 