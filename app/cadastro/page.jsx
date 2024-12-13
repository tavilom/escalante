'use client'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/Cadastro.module.css';
import { addDays, format } from 'date-fns';

export default function Cadastro() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: "",
      expediente: "",
      turno: "",
      fiscal: false,
      coordenador: false,
      isAdmin: false,
    }
  });

  // Função para calcular as datas e incluir o expediente para cada turno
  function gerarEscala(turno, expediente) {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    const escala = [];

    let diaAtual = inicioMes;

    if (turno === "12x36") {
      while (diaAtual.getDate() <= diasNoMes) {
        escala.push({
          dia: format(diaAtual, 'yyyy-MM-dd'),
          mes: format(diaAtual, 'yyyy-MM'),
          expediente: escala.length % 2 === 0 ? "07h às 19h" : "19h às 07h", // Alterna entre os expedientes padrões
        });
        diaAtual = addDays(diaAtual, 2); // Trabalha 12h, folga 36h
      }
    } else if (turno === "24x72") {
      while (diaAtual.getDate() <= diasNoMes) {
        escala.push({
          dia: format(diaAtual, 'yyyy-MM-dd'),
          mes: format(diaAtual, 'yyyy-MM'),
          expediente, // Usa o expediente definido pelo usuário
        });
        diaAtual = addDays(diaAtual, 4); // Trabalha 24h, folga 72h
      }
    }

    return escala;
  }

  async function enviaDados(data) {
    const id = Math.floor(Math.random() * 1000); // Gera um ID aleatório
    const escala = gerarEscala(data.turno, data.expediente);

    const novoGuarda = {
      id,
      nome: data.nome,
      turno: data.turno,
      expediente: data.expediente, // Inclui o expediente selecionado
      fiscal: data.fiscal,
      coordenador: data.coordenador,
      isAdmin: data.isAdmin,
      escala, // Inclui as escalas calculadas com os expedientes
    };

    const guarda = await fetch("http://localhost:3004/guardas", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(novoGuarda),
    });

    if (guarda.status === 201) {
      toast.success("Guarda inserido com sucesso");
    } else {
      toast.error("Erro ao inserir o guarda");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Guardas</h1>
      <form onSubmit={handleSubmit(enviaDados)}>
        <div className="row">
          <div className="col-6">
            <label htmlFor="nome" className={styles.formLabel}>Nome do Guarda</label>
            <input type="text" className={`form-control ${styles.formControl}`} id="nome" {...register("nome")} required />
          </div>
          <div className="col-6">
            <label htmlFor="turno" className={styles.formLabel}>Turno</label>
            <select id="turno" className={`form-select ${styles.formSelect}`} {...register("turno")} required>
              <option value="12x36">12x36 (07h às 19h / 19h às 07h)</option>
              <option value="24x72">24x72 (07h às 07h)</option>
            </select>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-6">
            <label htmlFor="expediente" className={styles.formLabel}>Expediente</label>
            <input type="text" className={`form-control ${styles.formControl}`} id="expediente" placeholder="Ex: 07h às 19h" {...register("expediente")} required />
          </div>
          <div className="col-6">
            <label htmlFor="funcoes" className={styles.formLabel}>Funções</label>
            <div className={styles.checkboxContainer}>
              <input type="checkbox" id="fiscal" {...register("fiscal")} />
              <label htmlFor="fiscal">Fiscal</label>
              <input type="checkbox" id="coordenador" {...register("coordenador")} />
              <label htmlFor="coordenador">Coordenador</label>
              <input type="checkbox" id="isAdmin" {...register("isAdmin")} />
              <label htmlFor="isAdmin">Administrador</label>
            </div>
          </div>
        </div>

        <input type="submit" value="Enviar" className={`btn btn-primary me-3 ${styles.btn} ${styles.btnPrimary}`} />
        <input type="button" value="Limpar" className={`btn btn-danger ${styles.btn} ${styles.btnDanger}`} onClick={() => reset()} />
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
