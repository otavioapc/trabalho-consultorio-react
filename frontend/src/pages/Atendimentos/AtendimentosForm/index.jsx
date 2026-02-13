import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../../services/api'
import './index.css'

export default function AtendimentosForm() {
  const [cpfBusca, setCpfBusca] = useState('')
  const [paciente, setPaciente] = useState(null)
  const [especialidadeId, setEspecialidadeId] = useState('')
  const [profissionalId, setProfissionalId] = useState('')
  const [dataAtendimento, setDataAtendimento] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([])
  const [erroBuscaPaciente, setErroBuscaPaciente] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const cpfQuery = query.get('cpf')
    if (cpfQuery) {
      setCpfBusca(cpfQuery)
      buscarPacientePorCpf(cpfQuery)
    }
  }, [location.search])

  useEffect(() => {
    api.get('/especialidade')
      .then(res => setEspecialidades(res.data))
      .catch(() => setEspecialidades([]))
  }, [])

  const limparCpf = (cpf) => cpf.replace(/[.-]/g, '')

  const buscarPacientePorCpf = async (cpf) => {
    setErroBuscaPaciente(false)
    setPaciente(null)
    setEspecialidadeId('')
    setProfissionalId('')
    setProfissionaisFiltrados([])
    try {
      const res = await api.get(`/paciente/cpf/${limparCpf(cpf)}`)
      setPaciente(res.data)
    } catch (err) {
      setErroBuscaPaciente(true)
    }
  }

  const buscarProfissionaisDaEspecialidade = async (especialidade_id) => {
    setProfissionaisFiltrados([])
    setProfissionalId('')
    if (!especialidade_id) return
    try {
      const res = await api.get('/profissional')
      const filtrados = res.data.filter(p => p.especialidade_id === parseInt(especialidade_id))
      setProfissionaisFiltrados(filtrados)
    } catch (err) {
      console.error('Erro ao buscar profissionais:', err)
      setProfissionaisFiltrados([])
    }
  }

  const salvar = async (e) => {
    e.preventDefault()
    if (!paciente) {
      alert('Paciente inválido')
      return
    }
    if (!profissionalId || !especialidadeId || !dataAtendimento || !diagnostico) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    try {
      await api.post('/atendimento', {
        paciente_id: paciente.id,
        profissional_id: profissionalId,
        data_atendimento: dataAtendimento, // ← formato: YYYY-MM-DD
        diagnostico
      })
      alert('Atendimento salvo com sucesso!')
      navigate('/atendimentos')
    } catch (err) {
      console.error('Erro ao salvar atendimento:', err)
      alert('Erro ao salvar atendimento, tente novamente.')
    }
  }

  // Opcional: função para mostrar data em formato DD/MM/YYYY
  const formatarDataParaExibir = (dataISO) => {
    if (!dataISO) return ''
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="atendimento-container">
      <h2>Agendar Atendimento</h2>

      <label>CPF do Paciente:</label>
      <input
        value={cpfBusca}
        onChange={(e) => setCpfBusca(e.target.value)}
        placeholder="Digite o CPF"
      />
      <button type="button" onClick={() => buscarPacientePorCpf(cpfBusca)}>🔍</button>

      {paciente && (
        <div className="paciente-encontrado">
          <strong>Paciente:</strong> {paciente.nome}<br />
          <strong>Email:</strong> {paciente.email}<br />
          <strong>Telefone:</strong> {paciente.telefone}
        </div>
      )}

      {erroBuscaPaciente && (
        <div className="paciente-nao-encontrado">
          <p>Paciente não encontrado.</p>
          <button onClick={() => navigate(`/pacientes/novo?cpf=${cpfBusca}`)}>
            Cadastrar novo paciente
          </button>
        </div>
      )}

      {paciente && (
        <form onSubmit={salvar} className="form-atendimento">
          <label>Especialidade:</label>
          <select
            value={especialidadeId}
            onChange={(e) => {
              setEspecialidadeId(e.target.value)
              buscarProfissionaisDaEspecialidade(e.target.value)
            }}
            required
          >
            <option value="">Selecione...</option>
            {especialidades.map(e => (
              <option key={e.id} value={e.id}>{e.descricao}</option>
            ))}
          </select>

          <label>Profissional:</label>
          <select
            value={profissionalId}
            onChange={(e) => setProfissionalId(e.target.value)}
            required
            disabled={!profissionaisFiltrados.length}
          >
            <option value="">Selecione...</option>
            {profissionaisFiltrados.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <label>Data do Atendimento:</label>
          <input
            type="date"
            value={dataAtendimento}
            onChange={(e) => setDataAtendimento(e.target.value)}
            required
          />
          {/* Opcional: exibir a data formatada */}
          {dataAtendimento && (
            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Data selecionada: <strong>{formatarDataParaExibir(dataAtendimento)}</strong>
            </p>
          )}

          <label>Diagnóstico:</label>
          <textarea
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            placeholder="Descreva o diagnóstico após a consulta"
            rows={3}
            required
          />

          <button type="submit">Salvar Atendimento</button>
        </form>
      )}
    </div>
  )
}
