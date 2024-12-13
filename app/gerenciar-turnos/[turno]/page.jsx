'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from '@/styles/GerenciarTurnos.module.css';

export default function GerenciarTurnos() {
  const [guardas, setGuardas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { turno } = useParams(); // Captura o turno da URL
  const mesAtual = new Date().toISOString().slice(0, 7); // Formato: "2024-12"

  useEffect(() => {
    if (!turno) return;

    async function carregarGuardas() {
      try {
        console.log('Turno recebido da URL:', turno); // Verificar turno recebido
        console.log('Mês atual:', mesAtual); // Verificar mês atual

        const response = await fetch(`http://localhost:3004/guardas`);
        if (!response.ok) throw new Error('Erro ao carregar guardas do servidor.');

        const dados = await response.json();
        console.log('Dados carregados do servidor:', dados); // Verificar dados recebidos

        const guardaEncontrado = dados.find(guarda => guarda.id === turno);
        console.log('Guarda encontrado:', guardaEncontrado); // Verificar se o guarda foi encontrado

        setGuardas(guardaEncontrado ? [guardaEncontrado] : []);
      } catch (error) {
        console.error('Erro ao carregar guardas:', error);
        Swal.fire('Erro ao carregar guardas.');
      } finally {
        setIsLoading(false);
      }
    }

    carregarGuardas();
  }, [turno, mesAtual]);

  const handleInputChange = (id, field, value) => {
    const atualizados = guardas.map((guarda) =>
      guarda.id === id ? { ...guarda, [field]: value } : guarda
    );
    setGuardas(atualizados);
  };

  const handleSave = async () => {
    try {
      for (const guarda of guardas) {
        await fetch(`http://localhost:3004/guardas/${guarda.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guarda),
        });
      }
      Swal.fire('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar guardas:', error);
      Swal.fire('Erro ao salvar os dados.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3004/guardas/${id}`, {
        method: 'DELETE',
      });
      setGuardas(guardas.filter((guarda) => guarda.id !== id));
      Swal.fire('Guarda excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir guarda:', error);
      Swal.fire('Erro ao excluir o guarda.');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gerenciar Turno: {turno}</h1>
      <div className={styles.grid}>
        {guardas.length > 0 ? (
          guardas.map((guarda) => (
            <div key={guarda.id} className={styles.item}>
              <label>Nome:</label>
              <input
                type="text"
                value={guarda.nome}
                onChange={(e) => handleInputChange(guarda.id, 'nome', e.target.value)}
              />
              <label>Expediente:</label>
              <input
                type="text"
                value={guarda.expediente}
                onChange={(e) => handleInputChange(guarda.id, 'expediente', e.target.value)}
              />
              <label>Dia:</label>
              <input type="text" value={guarda.dia} readOnly />
              <button
                className={styles.buttonExcluir}
                onClick={() => handleDelete(guarda.id)}
              >
                Excluir
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum guarda encontrado para este turno e mês.</p>
        )}
      </div>
      <button className={styles.buttonSalvar} onClick={handleSave}>
        Salvar Alterações
      </button>
    </div>
  );
}
