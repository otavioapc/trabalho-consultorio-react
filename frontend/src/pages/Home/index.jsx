import { useNavigate } from 'react-router-dom'
import './index.css'

// Ícones do Lucide
import { Stethoscope, HeartPulse, Users, NotebookPen } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <img src="/logoCoracaoDeOuro.png" alt="Consultório Coração de Ouro" className="home-logo" />

      <button className="btn-atendimento" onClick={() => navigate('/atendimentos/novo')}>
        <NotebookPen size={20} style={{ marginRight: '8px' }} />
        Registre um Atendimento
      </button>

      <div className="home-cards">
        <div className="home-card" onClick={() => navigate('/profissionais')}>
          <Stethoscope size={40} />
          <span>Profissionais</span>
        </div>

        <div className="home-card" onClick={() => navigate('/especialidades')}>
          <HeartPulse size={40} />
          <span>Especialidades</span>
        </div>

        <div className="home-card" onClick={() => navigate('/pacientes')}>
          <Users size={40} />
          <span>Pacientes</span>
        </div>
      </div>
    </div>
  )
}
