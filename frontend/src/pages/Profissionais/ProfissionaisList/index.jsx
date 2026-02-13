import { useEffect, useState } from 'react'
import api from '../../../services/api'
import './index.css'
import { useNavigate } from 'react-router-dom'


export default function ProfissionaisList() {
  const [profissionais, setProfissionais] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [profissionalEditando, setProfissionalEditando] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profissionaisRes, especialidadesRes] = await Promise.all([
          api.get('/profissional'),
          api.get('/especialidade')
        ])
        setProfissionais(profissionaisRes.data)
        setEspecialidades(especialidadesRes.data)
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const excluirProfissional = async (id) => {
    if (window.confirm('Deseja excluir este profissional?')) {
      try {
        await api.delete(`/profissional/${id}`)
        setProfissionais(profissionais.filter(p => p.id !== id))
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao excluir profissional')
      }
    }
  }

  const salvarEdicao = async () => {
    try {
      await api.put(`/profissional/${profissionalEditando.id}`, {
        nome: profissionalEditando.nome,
        crm: profissionalEditando.crm,
        especialidade_id: profissionalEditando.especialidade_id,
        telefone: profissionalEditando.telefone,
        email: profissionalEditando.email
      })

      setProfissionais(profissionais.map(p =>
        p.id === profissionalEditando.id ? profissionalEditando : p
      ))
      setProfissionalEditando(null)
      alert('Profissional atualizado com sucesso!')
    } catch (err) {
  console.error('Detalhes do erro:', err);                 // linha nova
  console.error('Resposta da API:', err.response?.data);   // linha nova
  alert(
    err.response?.data?.message ||
    err.response?.data?.error   ||
    'Erro ao atualizar profissional'
  );
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="pacientes-container">
      <h2>Profissionais</h2>
<button className="novo-btn" onClick={() => navigate('/profissionais/novo')}>  
   
   Cadastrar novo
      </button>

      {profissionais.map(p => {
        const especialidade = especialidades.find(e => e.id === p.especialidade_id)
        return (
          <div className="paciente-card" key={p.id}>
            <p><strong>{p.nome}</strong></p>
            <p>CRM: {p.crm}</p>
            <p>Especialidade: {especialidade?.descricao || especialidade?.nome || 'N/A'}</p>
            <p>Email: {p.email}</p>
            <p>Telefone: {p.telefone}</p>
            <div className="paciente-actions">
              <button onClick={() => setProfissionalEditando({ ...p })}>Editar</button>
              <button className="excluir" onClick={() => excluirProfissional(p.id)}>Excluir</button>
            </div>
          </div>
        )
      })}

      {profissionalEditando && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar Profissional</h3>

            <label>Nome:</label>
            <input
              value={profissionalEditando.nome}
              onChange={(e) => setProfissionalEditando({ ...profissionalEditando, nome: e.target.value })}
            />

            <label>CRM:</label>
            <input
              value={profissionalEditando.crm}
              onChange={(e) => setProfissionalEditando({ ...profissionalEditando, crm: e.target.value })}
            />

            <label>Especialidade:</label>
            <select
              value={profissionalEditando.especialidade_id}
              onChange={(e) =>
                setProfissionalEditando({
                  ...profissionalEditando,
                  especialidade_id: parseInt(e.target.value)
                })
              }
            >
              <option value="">Selecione...</option>
              {especialidades.map(e => (
                <option key={e.id} value={e.id}>{e.descricao || e.nome}</option>
              ))}
            </select>

            <label>Email:</label>
            <input
              value={profissionalEditando.email}
              onChange={(e) => setProfissionalEditando({ ...profissionalEditando, email: e.target.value })}
            />

            <label>Telefone:</label>
            <input
              value={profissionalEditando.telefone}
              onChange={(e) => setProfissionalEditando({ ...profissionalEditando, telefone: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setProfissionalEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
