import { useEffect, useState } from 'react'
import api from '../../../services/api'
import { useNavigate } from 'react-router-dom'
import './index.css'

export default function EspecialidadesList() {
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [especialidadeEditando, setEspecialidadeEditando] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/especialidade')
        setEspecialidades(res.data)
      } catch (err) {
        console.error('Erro ao buscar especialidades:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const excluirEspecialidade = async (id) => {
    if (window.confirm('Deseja excluir esta especialidade?')) {
      try {
        await api.delete(`/especialidade/${id}`)
        setEspecialidades(especialidades.filter(e => e.id !== id))
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao excluir especialidade')
      }
    }
  }

  const salvarEdicao = async () => {
    try {
      await api.put(`/especialidade/${especialidadeEditando.id}`, {
        descricao: especialidadeEditando.descricao,
      })

      setEspecialidades(especialidades.map(e =>
        e.id === especialidadeEditando.id ? especialidadeEditando : e
      ))
      setEspecialidadeEditando(null)
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao atualizar especialidade')
    }
  }

  if (loading) return <div>Carregando especialidades...</div>

  return (
    <div className="container">
      <h2>Especialidades</h2>
      <button className="novo-btn" onClick={() => navigate('/especialidades/novo')}>          Cadastrar novo
      </button>

      <div className="especialidade-list">
        {especialidades.map(e => (
          <div key={e.id} className="especialidade-card">
            <p>{e.descricao}</p>
            <div className="especialidade-actions">
              <button onClick={() => setEspecialidadeEditando({ ...e })}>Editar</button>
              <button className="excluir" onClick={() => excluirEspecialidade(e.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {especialidadeEditando && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar Especialidade</h3>

            <label>Descrição:</label>
            <textarea
              value={especialidadeEditando.descricao}
              onChange={e => setEspecialidadeEditando({ ...especialidadeEditando, descricao: e.target.value })}
              rows="3"
            />

            <div className="modal-buttons">
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setEspecialidadeEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
