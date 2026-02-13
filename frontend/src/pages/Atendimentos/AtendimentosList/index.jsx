import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import './index.css'

export default function AtendimentosList() {
  const [atendimentos, setAtendimentos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [atendimentoEditando, setAtendimentoEditando] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [atendimentosRes, pacientesRes, profissionaisRes] = await Promise.all([
          api.get('/atendimento'),
          api.get('/paciente'),
          api.get('/profissional')
        ])

        setAtendimentos(atendimentosRes.data)
        setPacientes(pacientesRes.data)
        setProfissionais(profissionaisRes.data)
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const formatarData = (dataString) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }

  const formatarDataParaInput = (dataString) => {
    const data = new Date(dataString)
    const tzOffset = data.getTimezoneOffset() * 60000
    return new Date(data - tzOffset).toISOString().slice(0, 16)
  }

  const excluirAtendimento = async (id) => {
    if (window.confirm('Deseja excluir este atendimento?')) {
      try {
        await api.delete(`/atendimento/${id}`)
        setAtendimentos(atendimentos.filter(a => a.id !== id))
      } catch (error) {
        console.error('Erro ao excluir atendimento:', error)
        alert('Erro ao excluir atendimento.')
      }
    }
  }

  const salvarEdicao = async () => {
    try {
      await api.put(`/atendimento/${atendimentoEditando.id}`, {
        paciente_id: atendimentoEditando.paciente_id,
        profissional_id: atendimentoEditando.profissional_id,
        data_atendimento: atendimentoEditando.data_atendimento,
        diagnostico: atendimentoEditando.diagnostico
      })

      setAtendimentos(atendimentos.map(a =>
        a.id === atendimentoEditando.id ? atendimentoEditando : a
      ))
      setAtendimentoEditando(null)
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao atualizar atendimento')
    }
  }

  if (loading) return <div>Carregando atendimentos...</div>

  return (
    <div className="container">
      <h2>Atendimentos</h2>
      <button className="novo-btn" onClick={() => navigate('/atendimentos/novo')}>Cadastrar novo</button>

      <ul className="atendimentos-list">
        {atendimentos.map(a => {
          const paciente = pacientes.find(p => p.id === a.paciente_id)
          const profissional = profissionais.find(p => p.id === a.profissional_id)

          return (
            <li key={a.id} className="atendimento-card">
              <div className="atendimento-info">
                <p><strong>Paciente:</strong> {paciente?.nome || 'Desconhecido'}</p>
                <p><strong>Profissional:</strong> {profissional?.nome || 'Desconhecido'}</p>
                <p><strong>Data:</strong> {formatarData(a.data_atendimento)}</p>
                <p><strong>Diagnóstico:</strong> {a.diagnostico || 'Ainda não fornecido'}</p>
              </div>
              <div className="atendimento-actions">
                <button onClick={() => setAtendimentoEditando({ ...a })} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => excluirAtendimento(a.id)} className="btn-delete">
                  Excluir
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {atendimentoEditando && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar Atendimento</h3>

            <label>Paciente:</label>
            <select
              value={atendimentoEditando.paciente_id}
              onChange={(e) => setAtendimentoEditando({ 
                ...atendimentoEditando, 
                paciente_id: parseInt(e.target.value) 
              })}
            >
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            <label>Profissional:</label>
            <select
              value={atendimentoEditando.profissional_id}
              onChange={(e) => setAtendimentoEditando({ 
                ...atendimentoEditando, 
                profissional_id: parseInt(e.target.value) 
              })}
            >
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            <label>Data do Atendimento:</label>
            <input
              type="datetime-local"
              value={formatarDataParaInput(atendimentoEditando.data_atendimento)}
              onChange={(e) => setAtendimentoEditando({ 
                ...atendimentoEditando, 
                data_atendimento: e.target.value 
              })}
            />

            <label>Diagnóstico:</label>
            <textarea
              value={atendimentoEditando.diagnostico || ''}
              onChange={(e) => setAtendimentoEditando({ 
                ...atendimentoEditando, 
                diagnostico: e.target.value 
              })}
              rows="4"
            />

            <div className="modal-buttons">
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setAtendimentoEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
