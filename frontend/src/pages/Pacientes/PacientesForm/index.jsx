import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'
import './index.css'

export default function PacientesForm() {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Formatação do CPF (000.000.000-00)
  const formatarCPF = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11)
    if (nums.length <= 3) return nums
    if (nums.length <= 6) return `${nums.slice(0,3)}.${nums.slice(3)}`
    if (nums.length <= 9) return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6)}`
    return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6,9)}-${nums.slice(9,11)}`
  }

  // Formatação do telefone ((00) 00000-0000)
  const formatarTelefone = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11)
    if (nums.length <= 2) return `(${nums}`
    if (nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`
    if (nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`
  }

  // Validação de e-mail
  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const salvar = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validações
    if (!nome) newErrors.nome = 'Nome é obrigatório'
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF inválido'
    if (!dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'
    if (!telefone || telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido'
    if (!email || !validarEmail(email)) newErrors.email = 'E-mail inválido'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await api.post('/paciente', {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        data_nascimento: dataNascimento,
        telefone: telefone.replace(/\D/g, ''),
        email,
        endereco
      })
      console.log('Paciente cadastrado com sucesso:', res.data)
      navigate('/pacientes')
    } catch (error) {
      console.error('Erro ao salvar paciente:', error.response?.data || error.message)
      setErrors({
        submit: error.response?.data?.message || 'Erro ao cadastrar paciente'
      })
    }
  }

  return (
    <form className="pacientes-form-container" onSubmit={salvar}>
      <h2>Novo Paciente</h2>

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
        <label>CPF *</label>
        <input
          value={cpf}
          onChange={(e) => setCpf(formatarCPF(e.target.value))}
          placeholder="000.000.000-00"
          maxLength={14}
          className={errors.cpf ? 'error' : ''}
        />
        {errors.cpf && <span className="error-message">{errors.cpf}</span>}
      </div>

      <div className="form-group">
        <label>Data de Nascimento *</label>
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          className={errors.dataNascimento ? 'error' : ''}
        />
        {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
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
        <label>Endereço</label>
        <input
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-button">Salvar</button>
    </form>
  )
}