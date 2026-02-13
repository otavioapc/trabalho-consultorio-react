import { useEffect, useState } from 'react';
import api from '../../../services/api';
import './index.css';
import { useNavigate } from 'react-router-dom'


export default function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const navigate = useNavigate()

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get('/paciente');
      console.log('Resposta da API /paciente:', res.data);
      setPacientes(res.data);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const excluirPaciente = async (id) => {
    if (window.confirm('Deseja excluir este paciente?')) {
      try {
        await api.delete(`/paciente/${id}`);
        setPacientes(pacientes.filter(p => p.id !== id));
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao excluir paciente');
      }
    }
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/paciente/${pacienteEditando.id}`, {
        nome: pacienteEditando.nome,
        cpf: pacienteEditando.cpf,
        data_nascimento: pacienteEditando.data_nascimento,
        telefone: pacienteEditando.telefone,
        email: pacienteEditando.email,
        endereco: pacienteEditando.endereco,
      });

      setPacientes(pacientes.map(p =>
        p.id === pacienteEditando.id ? pacienteEditando : p
      ));
      setPacienteEditando(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao atualizar paciente');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container">
      <h2>Pacientes</h2>
      <button className="novo-btn" onClick={() => navigate('/pacientes/novo')}>   Cadastrar novo</button>

      {pacientes.map(p => (
        <div key={p.id} className="paciente-card">
          <p><strong>{p.nome}</strong></p>
          <p>CPF: {p.cpf}</p>
          <p>Data Nascimento: {p.data_nascimento}</p>
          <p>Email: {p.email}</p>
          <p>Telefone: {p.telefone}</p>
          <p>Endereço: {p.endereco}</p>
          <div className="paciente-actions">
            <button onClick={() => setPacienteEditando(p)}>Editar</button>
            <button className="excluir" onClick={() => excluirPaciente(p.id)}>Excluir</button>
          </div>
        </div>
      ))}

      {pacienteEditando && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar Paciente</h3>

            <label>Nome:</label>
            <input
              value={pacienteEditando.nome}
              onChange={e => setPacienteEditando({ ...pacienteEditando, nome: e.target.value })}
            />

            <label>CPF:</label>
            <input
              value={pacienteEditando.cpf}
              onChange={e => setPacienteEditando({ ...pacienteEditando, cpf: e.target.value })}
            />

            <label>Data de Nascimento:</label>
            <input
              type="date"
              value={pacienteEditando.data_nascimento}
              onChange={e => setPacienteEditando({ ...pacienteEditando, data_nascimento: e.target.value })}
            />

            <label>Telefone:</label>
            <input
              value={pacienteEditando.telefone}
              onChange={e => setPacienteEditando({ ...pacienteEditando, telefone: e.target.value })}
            />

            <label>Email:</label>
            <input
              value={pacienteEditando.email}
              onChange={e => setPacienteEditando({ ...pacienteEditando, email: e.target.value })}
            />

            <label>Endereço:</label>
            <input
              value={pacienteEditando.endereco}
              onChange={e => setPacienteEditando({ ...pacienteEditando, endereco: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setPacienteEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
