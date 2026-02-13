import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import './index.css'

export default function EspecialidadesForm() {
  const [nome, setNome] = useState('')
  const navigate = useNavigate()

  const salvar = async (e) => {
    e.preventDefault()
    try {
      await api.post('/especialidade', { descricao: nome })
      navigate('/especialidades')
    } catch (error) {
      console.error('Erro ao salvar especialidade:', error)
    }
  }

  return (
    <form className="especialidades-form-container" onSubmit={salvar}>
      <h2>Nova Especialidade</h2>
      <label>Nome:</label>
      <input value={nome} onChange={(e) => setNome(e.target.value)} required />
      <button type="submit">Salvar</button>
    </form>
  )
}
