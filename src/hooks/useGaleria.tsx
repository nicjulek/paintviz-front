import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAvisoModal } from '../modals/AvisoModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export const statusList = [
  { id: 1, nome: "Pré-Ordem" },
  { id: 2, nome: "Aberta" },
  { id: 3, nome: "Em produção" },
  { id: 4, nome: "Finalizada" },
  { id: 5, nome: "Cancelada" }
];

// Função utilitária para exibir o nome do status
export function getStatusNome(id_status: number) {
  const status = statusList.find(s => s.id === Number(id_status));
  return status ? status.nome : String(id_status);
}

// Opções de período
export const periodOptions = [
  { value: "all", label: "Todos os períodos" },
  { value: "today", label: "Hoje" },
  { value: "week", label: "Última semana" },
  { value: "month", label: "Último mês" },
  { value: "3months", label: "Últimos 3 meses" },
  { value: "6months", label: "Últimos 6 meses" },
  { value: "year", label: "Último ano" },
  { value: "custom", label: "Período personalizado" }
];

export function useGaleria() {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alterando, setAlterando] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"nome" | "data_entrega" | "veiculo" | "status">("data_entrega");
  const [sortAsc, setSortAsc] = useState(false); // Mais recentes primeiro por padrão
  
  const [filtroStatus, setFiltroStatus] = useState<string>("aberto"); // Filtro padrão para ordens em aberto
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("month"); // Último mês por padrão
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPrioriModal, setShowPrioriModal] = useState(false);
  const [modalOrdemId, setModalOrdemId] = useState<number | null>(null);
  const [modalStatusId, setModalStatusId] = useState<number>(0);
  const [modalDataEmissao, setModalDataEmissao] = useState<string>("");
  const [modalDataProgramada, setModalDataProgramada] = useState<string>("");
  const [modalDataEntrega, setModalDataEntrega] = useState<string>("");
  const [modalNumeroBox, setModalNumeroBox] = useState<string>("");

  // Hook do AvisoModal
  const { modalProps, mostrarSucesso, mostrarErro, fecharModal } = useAvisoModal();

  useEffect(() => {
    async function fetchOrdens() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/ordem-servico`);
        const ordensComCliente = await Promise.all(
          res.data.map(async (ordem: any) => {
            if (ordem.cliente?.pessoa_fisica?.nome || ordem.cliente?.pessoa_juridica?.empresa) {
              return ordem;
            }
            if (ordem.id_cliente) {
              try {
                const clienteRes = await axios.get(`${API_URL}/clientes/${ordem.id_cliente}`);
                ordem.cliente = clienteRes.data;
              } catch {
                ordem.cliente = null;
              }
            }
            return ordem;
          })
        );
        setOrdens(ordensComCliente);
      } catch (err) {
        console.error('Erro ao carregar ordens:', err);
        mostrarErro('Erro', 'Não foi possível carregar as ordens de serviço.');
        setOrdens([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrdens();
  }, [mostrarErro]);

  // função para calcular data de início baseada no período selecionado
  const getDataInicioByPeriod = (periodo: string): Date | null => {
    const hoje = new Date();
    switch (periodo) {
      case "today":
        return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      case "week":
        const semana = new Date(hoje);
        semana.setDate(hoje.getDate() - 7);
        return semana;
      case "month":
        const mes = new Date(hoje);
        mes.setMonth(hoje.getMonth() - 1);
        return mes;
      case "3months":
        const tresMeses = new Date(hoje);
        tresMeses.setMonth(hoje.getMonth() - 3);
        return tresMeses;
      case "6months":
        const seisMeses = new Date(hoje);
        seisMeses.setMonth(hoje.getMonth() - 6);
        return seisMeses;
      case "year":
        const ano = new Date(hoje);
        ano.setFullYear(hoje.getFullYear() - 1);
        return ano;
      default:
        return null;
    }
  };

  // função para filtrar ordens
  const filtrarOrdens = () => {
    return ordens.filter(ordem => {
      const nome =
        ordem.cliente?.pessoa_fisica?.nome ||
        ordem.cliente?.pessoa_juridica?.empresa ||
        ordem.nome_cliente ||
        "";
      const veiculo = ordem.placa_veiculo || "";
      const dataEntrega = ordem.data_entrega || "";
      const status = ordem.id_status || "";

      // filtro por texto de pesquisa
      let passaFiltroTexto = true;
      if (search.trim()) {
        if (filtro === "nome") {
          passaFiltroTexto = nome.toLowerCase().includes(search.toLowerCase());
        } else if (filtro === "veiculo") {
          passaFiltroTexto = veiculo.toLowerCase().includes(search.toLowerCase());
        } else if (filtro === "data_entrega") {
          passaFiltroTexto = dataEntrega.toLowerCase().includes(search.toLowerCase());
        } else if (filtro === "status") {
          const statusObj = statusList.find(s =>
            s.nome.toLowerCase().includes(search.toLowerCase()) ||
            String(s.id) === search.trim()
          );
          if (!statusObj) {
            passaFiltroTexto = false;
          } else {
            passaFiltroTexto = String(status) === String(statusObj.id);
          }
        }
      }

      // filtro por status
      let passaFiltroStatus = true;
      if (filtroStatus !== "todos") {
        if (filtroStatus === "aberto") {
          // considera "em aberto": Pré-Ordem, Aberta, Em produção
          passaFiltroStatus = ["1", "2", "3"].includes(String(status));
        } else if (filtroStatus === "finalizado") {
          // considera "finalizado": Finalizada, Cancelada
          passaFiltroStatus = ["4", "5"].includes(String(status));
        } else {
          passaFiltroStatus = String(status) === filtroStatus;
        }
      }

      // filtro por período
      let passaFiltroPeriodo = true;
      if (filtroPeriodo !== "all") {
        if (filtroPeriodo === "custom") {
          // período personalizado
          if (dataInicio || dataFim) {
            const dataOrdem = new Date(dataEntrega);
            if (isNaN(dataOrdem.getTime())) {
              passaFiltroPeriodo = false;
            } else {
              if (dataInicio && dataOrdem < new Date(dataInicio)) {
                passaFiltroPeriodo = false;
              }
              if (dataFim && dataOrdem > new Date(dataFim)) {
                passaFiltroPeriodo = false;
              }
            }
          }
        } else {
          // período predefinido
          const dataInicioCalc = getDataInicioByPeriod(filtroPeriodo);
          if (dataInicioCalc) {
            const dataOrdem = new Date(dataEntrega);
            if (isNaN(dataOrdem.getTime()) || dataOrdem < dataInicioCalc) {
              passaFiltroPeriodo = false;
            }
          }
        }
      }

      return passaFiltroTexto && passaFiltroStatus && passaFiltroPeriodo;
    });
  };

  // função para ordenar ordens
  const ordenarOrdens = (ordensFiltradas: any[]) => {
    if (filtro === "data_entrega") {
      return ordensFiltradas.sort((a, b) => {
        const aDate = a.data_entrega ? new Date(a.data_entrega).getTime() : 0;
        const bDate = b.data_entrega ? new Date(b.data_entrega).getTime() : 0;
        return sortAsc ? aDate - bDate : bDate - aDate;
      });
    } else if (filtro === "nome") {
      return ordensFiltradas.sort((a, b) => {
        const aNome =
          a.cliente?.pessoa_fisica?.nome ||
          a.cliente?.pessoa_juridica?.empresa ||
          a.nome_cliente ||
          "";
        const bNome =
          b.cliente?.pessoa_fisica?.nome ||
          b.cliente?.pessoa_juridica?.empresa ||
          b.nome_cliente ||
          "";
        return sortAsc
          ? aNome.localeCompare(bNome)
          : bNome.localeCompare(aNome);
      });
    } else if (filtro === "veiculo") {
      return ordensFiltradas.sort((a, b) => {
        const aVeiculo = a.placa_veiculo || "";
        const bVeiculo = b.placa_veiculo || "";
        return sortAsc
          ? aVeiculo.localeCompare(bVeiculo)
          : bVeiculo.localeCompare(aVeiculo);
      });
    } else if (filtro === "status") {
      return ordensFiltradas.sort((a, b) => {
        return sortAsc ? a.id_status - b.id_status : b.id_status - a.id_status;
      });
    }
    return ordensFiltradas;
  };

  const paginarOrdens = (ordensOrdenadas: any[], cardsPerPage: number) => {
    const totalPages = Math.ceil(ordensOrdenadas.length / cardsPerPage);
    const paginatedOrdens = ordensOrdenadas.slice((page - 1) * cardsPerPage, page * cardsPerPage);
    return { paginatedOrdens, totalPages };
  };

  const openStatusModal = (ordem: any) => {
    setModalOrdemId(ordem.id_ordem_servico);
    setModalStatusId(ordem.id_status);
    setModalNumeroBox(ordem.numero_box || "");
    setModalDataEmissao(ordem.data_emissao || "");
    setModalDataProgramada(ordem.data_programada || "");
    setModalDataEntrega(ordem.data_entrega || "");
    setShowStatusModal(true);
  };

  const openPrioriModal = (ordem: any) => {
    setModalOrdemId(ordem.id_ordem_servico);
    setModalDataEntrega(ordem.data_entrega?.slice(0, 10) || "");
    setShowPrioriModal(true);
  };

  async function alterarStatus() {
  if (!modalOrdemId) return;
  
  // Validação adicional no frontend para ordem de status
  const ordemAtual = ordens.find((o: any) => o.id_ordem_servico === modalOrdemId);
  const statusAtual = ordemAtual?.id_status;
  
  // Validar se pode alterar para o novo status
  if (modalStatusId !== 5 && modalStatusId < statusAtual) {
    mostrarErro('Alteração Inválida', 'Não é possível voltar para um status anterior. O progresso da ordem só pode avançar ou ser cancelado.');
    return;
  }
  
  // Validar datas não podem ser anteriores ao dia atual
  const hoje = new Date().toISOString().split('T')[0];
  
  if (modalStatusId !== 1 && statusAtual === 1) {
    if (modalDataEmissao < hoje) {
      mostrarErro('Data Inválida', 'A data de emissão não pode ser anterior à data atual.');
      return;
    }
    if (modalDataProgramada < hoje) {
      mostrarErro('Data Inválida', 'A data programada não pode ser anterior à data atual.');
      return;
    }
    if (modalDataEntrega < hoje) {
      mostrarErro('Data Inválida', 'A data de entrega não pode ser anterior à data atual.');
      return;
    }
  }
  
  setAlterando(true);

  let payload: any = { id_status: modalStatusId };

  if (modalStatusId !== 1 && statusAtual === 1) {
    payload.data_emissao = modalDataEmissao;
    payload.data_programada = modalDataProgramada;
    payload.data_entrega = modalDataEntrega;
  }
  if (modalStatusId === 3) {
    payload.numero_box = modalNumeroBox;
  }

  try {
    const res = await axios.patch(`${API_URL}/ordem-servico/${modalOrdemId}/status`, payload);
    setOrdens((ordens: any[]) =>
      ordens.map(ordem =>
        ordem.id_ordem_servico === modalOrdemId
          ? {
            ...ordem,
            id_status: modalStatusId,
            numero_box: modalNumeroBox,
            data_emissao: payload.data_emissao ?? ordem.data_emissao,
            data_programada: payload.data_programada ?? ordem.data_programada,
            data_entrega: payload.data_entrega ?? ordem.data_entrega
          }
          : ordem
      )
    );
    setShowStatusModal(false);
    
    mostrarSucesso('Sucesso', res.data.message || 'Status alterado com sucesso!');
    
    setTimeout(() => {
      fecharModal();
    }, 2000);
    
  } catch (error: any) {
    console.error('Erro ao alterar status:', error);
    
    // Verificar se o erro é relacionado à ordem de status
    if (error.response?.data?.error?.includes('status') || error.response?.data?.error?.includes('anterior')) {
      mostrarErro('Alteração Inválida', error.response.data.error);
    } else {
      mostrarErro('Erro', error.response?.data?.error || 'Erro ao alterar status.');
    }
  } finally {
    setAlterando(false);
  }
}

  async function alterarPrioridade() {
  if (!modalOrdemId) return;
  
  const data = new Date().toISOString().split('T')[0];
  if (modalDataEntrega < data) {
    mostrarErro('Data Inválida', 'A data de entrega não pode ser anterior à data atual.');
    return;
  }
  
  setAlterando(true);

  try {
    const res = await axios.patch(`${API_URL}/ordem-servico/${modalOrdemId}/prioridade`, {
      data_entrega: modalDataEntrega
    });
    setOrdens((ordens: any[]) =>
      ordens.map(ordem =>
        ordem.id_ordem_servico === modalOrdemId
          ? { ...ordem, data_entrega: res.data.ordem?.data_entrega ?? modalDataEntrega }
          : ordem
      )
    );
    setShowPrioriModal(false);
    
    mostrarSucesso('Sucesso', res.data.message || 'Prioridade/Data de entrega alterada!');
    
    setTimeout(() => {
      fecharModal();
    }, 2000);
    
  } catch (error: any) {
    console.error('Erro ao alterar prioridade:', error);
    
    // Verificar se o erro é relacionado à data inválida
    if (error.response?.data?.error?.includes('data') || error.response?.data?.error?.includes('anterior')) {
      mostrarErro('Data Inválida', error.response.data.error);
    } else {
      mostrarErro('Erro', error.response?.data?.error || 'Erro ao alterar prioridade.');
    }
  } finally {
    setAlterando(false);
  }
}

  // função para limpar filtros
  const limparFiltros = () => {
    setSearch("");
    setFiltroStatus("aberto");
    setFiltroPeriodo("month");
    setDataInicio("");
    setDataFim("");
    setPage(1);
  };

  return {
    ordens,
    setOrdens,
    loading,
    alterando,
    page,
    setPage,
    search,
    setSearch,
    filtro,
    setFiltro,
    sortAsc,
    setSortAsc,
    filtroStatus,
    setFiltroStatus,
    filtroPeriodo,
    setFiltroPeriodo,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    limparFiltros,
    showStatusModal,
    setShowStatusModal,
    showPrioriModal,
    setShowPrioriModal,
    modalOrdemId,
    modalStatusId,
    setModalStatusId,
    modalDataEmissao,
    setModalDataEmissao,
    modalDataProgramada,
    setModalDataProgramada,
    modalDataEntrega,
    setModalDataEntrega,
    modalNumeroBox,
    setModalNumeroBox,
    filtrarOrdens,
    ordenarOrdens,
    paginarOrdens,
    openStatusModal,
    openPrioriModal,
    alterarStatus,
    alterarPrioridade,
    getStatusNome,
    // Expor props do modal
    modalProps
  };
}