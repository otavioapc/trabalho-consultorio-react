import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import './index.css'

export default function ProfissionaisForm() {
  const [nome, setNome] = useState('')
  const [crm, setCrm] = useState('')
  const [especialidadeId, setEspecialidadeId] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [filteredEspecialidades, setFilteredEspecialidades] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const formatarCRM = (value) => {
    // Remove prefixo CRM/ e espaços
    let cleaned = value.replace(/^CRM\//i, '').replace(/\s/g, '')

    // Separa letras e números
    const letras = cleaned.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
    const numeros = cleaned.replace(/[^0-9]/g, '').slice(0, 5)

    // Retorna formatado
    if (letras || numeros) {
      return `CRM/${letras}${letras ? ' ' : ''}${numeros}`
    }

    return ''
  }


  // Formatação do telefone ((00) 00000-0000)
  const formatarTelefone = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11)
    if (nums.length <= 2) return `(${nums}`
    if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
    if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`
  }

  // Validação de e-mail
  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Validação de CRM (formato CRM/UF 12345) - Mantido o original
  const validarCRM = (crm) => {
    return /^CRM\/[A-Z]{2} \d{4,5}$/.test(crm)
  }

  useEffect(() => {
    const carregarEspecialidades = async () => {
      try {
        const res = await api.get('/especialidade')
        setEspecialidades(res.data)
        setFilteredEspecialidades(res.data)
      } catch (err) {
        console.error('Erro ao carregar especialidades:', err)
      }
    }
    carregarEspecialidades()
  }, [])

  // Filtra especialidades conforme o termo de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const filtered = especialidades.filter(e =>
        e.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEspecialidades(filtered)
    } else {
      setFilteredEspecialidades(especialidades)
    }
  }, [searchTerm, especialidades])

  const salvar = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validações (mantidas as originais)
    if (!nome) newErrors.nome = 'Nome é obrigatório'
    if (!crm || !validarCRM(crm)) newErrors.crm = 'CRM inválido (formato: CRM/UF 12345)'
    if (!especialidadeId) newErrors.especialidade = 'Especialidade é obrigatória'
    if (!telefone || telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido'
    if (!email || !validarEmail(email)) newErrors.email = 'E-mail inválido'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await api.post('/profissional', {
        nome,
        crm,
        especialidade_id: especialidadeId,
        telefone: telefone.replace(/\D/g, ''),
        email
      })
      navigate('/profissionais')
    } catch (error) {
      console.error('Erro ao salvar profissional:', error)
      setErrors({
        submit: error.response?.data?.message || 'Erro ao cadastrar profissional'
      })
    }
  }

  return (
    <form className="profissionais-form-container" onSubmit={salvar}>
      <h2>Novo Profissional</h2>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Nome *</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={errors.nome ? 'error' : ''}
        />
        {errors.nome && <span className="error-message">{errors.nome}</span>}
      </div>

      <div className="form-group">
        <label>CRM *</label>
        <input
          value={crm}
          onChange={(e) => setCrm(formatarCRM(e.target.value))}
          placeholder="CRM/UF 12345"
          className={errors.crm ? 'error' : ''}
        />
        {errors.crm && <span className="error-message">{errors.crm}</span>}
      </div>


      <div className="form-group">
        <label>Especialidade *</label>

        {especialidades.length > 5 && (
          <button
            type="button"
            className="search-toggle"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? 'Ocultar pesquisa' : 'Pesquisar especialidade'}
          </button>
        )}

        {showSearch && (
          <input
            type="text"
            placeholder="Pesquisar especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}

        <select
          value={especialidadeId}
          onChange={(e) => setEspecialidadeId(e.target.value)}
          className={errors.especialidade ? 'error' : ''}
        >
          <option value="">Selecione...</option>
          {filteredEspecialidades.map(e => (
            <option key={e.id} value={e.id}>{e.descricao}</option>
          ))}
        </select>
        {errors.especialidade && <span className="error-message">{errors.especialidade}</span>}
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@dominio.com"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Telefone *</label>
        <input
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          placeholder="(00) 00000-0000"
          maxLength={15}
          className={errors.telefone ? 'error' : ''}
        />
        {errors.telefone && <span className="error-message">{errors.telefone}</span>}
      </div>

      <button type="submit" className="submit-button">Salvar</button>
    </form>
  )
}