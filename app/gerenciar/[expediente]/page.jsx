'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from '@/styles/Gerenciar.module.css';

export default function GerenciarExpediente() {
  const [guardas, setGuardas] = useState([]);
  const [nomesGuardas, setNomesGuardas] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const { expediente } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Iniciando fetch...');

        // Buscar guardas do expediente
        const responseGuardas = await fetch('http://localhost:3004/guardas?expediente=' + expediente);
        if (!responseGuardas.ok) throw new Error('Erro ao buscar guardas');
        const guardasData = await responseGuardas.json();
        setGuardas(guardasData);

        // Buscar todos os nomes de guardas disponíveis
        const responseNomes = await fetch('http://localhost:3004/guardas');
        if (!responseNomes.ok) throw new Error('Erro ao buscar nomes de guardas');
        const nomesData = await responseNomes.json();
        setNomesGuardas([...new Set(nomesData.map(g => g.nome))]); // Remover duplicados

        // Buscar todos os expedientes disponíveis
        const responseExpedientes = await fetch('http://localhost:3004/expedientes');
        if (!responseExpedientes.ok) throw new Error('Erro ao buscar expedientes');
        const expedientesData = await responseExpedientes.json();
        setExpedientes(expedientesData);

        setIsLoading(false); // Concluir carregamento
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false); // Evitar loop infinito
      }
    }
    fetchData();
  }, [expediente]);

  const handleEdit = (id, data) => {
    setEditMode(id);
    setFormData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (id) => {
    try {
      await fetch('http://localhost:3004/guardas/' + id, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedGuardas = guardas.map(guarda =>
        guarda.id === id ? { ...guarda, ...formData } : guarda
      );
      setGuardas(updatedGuardas);
      setEditMode(null);
      Swal.fire('Guarda atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Swal.fire('Erro ao salvar guarda');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch('http://localhost:3004/guardas/' + id, {
        method: 'DELETE',
      });
      const novosDados = guardas.filter(guarda => guarda.id !== id);
      setGuardas(novosDados);
      Swal.fire('Guarda excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      Swal.fire('Erro ao excluir guarda');
    }
  };

  const handleIncluirGuarda = () => {
    router.push('/cadastro'); // Redireciona para a página de cadastro
  };

  if (isLoading) {
    return (
      <div>
        <h1>Carregando...</h1>
      </div>
    );
  }

  if (!guardas.length) {
    return (
      <div>
        <h1>Nenhum dado encontrado para este expediente.</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gerenciar Expediente: {expediente}</h1>

      {/* Botão para incluir guarda */}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleIncluirGuarda}>Incluir Guarda</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Expediente</th>
            <th>Turno</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {guardas.map(guarda => (
            <tr key={guarda.id}>
              <td>
                {editMode === guarda.id ? (
                  <select name="nome" value={formData.nome} onChange={handleChange}>
                    <option value="">Selecione um nome</option>
                    {nomesGuardas.map(nome => (
                      <option key={nome} value={nome}>{nome}</option>
                    ))}
                  </select>
                ) : (
                  guarda.nome
                )}
              </td>
              <td>
                {editMode === guarda.id ? (
                  <select name="expediente" value={formData.expediente} onChange={handleChange}>
                    <option value="">Selecione um expediente</option>
                    {expedientes.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.nome}</option>
                    ))}
                  </select>
                ) : (
                  expedientes.find(exp => String(exp.id) === String(guarda.expediente))?.nome || 'Desconhecido'
                )}
              </td>

              <td>{guarda.turno}</td>
              <td>
                {editMode === guarda.id ? (
                  <button className={styles.button} onClick={() => handleSave(guarda.id)}>Salvar</button>
                ) : (
                  <>
                    <button className={styles.button} onClick={() => handleEdit(guarda.id, { nome: guarda.nome, expediente: guarda.expediente })}>Editar</button>
                    <button className={styles.button} onClick={() => handleDelete(guarda.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
