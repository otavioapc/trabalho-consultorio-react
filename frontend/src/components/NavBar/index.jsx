import './index.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link className="navbar-logo" to="/">🏥 Consultório</Link>
      <Link className="navbar-link" to="/pacientes">Pacientes</Link>
      <Link className="navbar-link" to="/profissionais">Profissionais</Link>
      <Link className="navbar-link" to="/especialidades">Especialidades</Link>
      <Link className="navbar-link" to="/atendimentos">Atendimentos</Link>
    </nav>
  )
}
