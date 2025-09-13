import { useEffect, useState } from "react";
import axios from "axios";

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

export function useGaleria() {
  const [ordens, setOrdens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alterando, setAlterando] = useState(false);

  // Estados do filtro/busca
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"nome" | "data_entrega" | "veiculo" | "status">("nome");
  const [sortAsc, setSortAsc] = useState(true);

  // Estados dos modais
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPrioriModal, setShowPrioriModal] = useState(false);
  const [modalOrdemId, setModalOrdemId] = useState<number | null>(null);
  const [modalStatusId, setModalStatusId] = useState<number>(0);
  const [modalDataEmissao, setModalDataEmissao] = useState<string>("");
  const [modalDataProgramada, setModalDataProgramada] = useState<string>("");
  const [modalDataEntrega, setModalDataEntrega] = useState<string>("");
  const [modalNumeroBox, setModalNumeroBox] = useState<string>("");

  useEffect(() => {
    async function fetchOrdens() {
      try {
        const res = await axios.get(`${API_URL}/ordem-servico`);
        const ordensComCliente = await Promise.all(
          res.data.map(async (ordem: any) => {
            if (ordem.cliente?.pessoa_fisica?.nome || ordem.cliente?.pessoa_juridica?.empresa) {
              return ordem;
            }
            if (ordem.id_cliente) {
              try {
                const clienteRes = await axios.get(`${API_URL}/clientes/${ordem.id_cliente}`);
                return { ...ordem, cliente: clienteRes.data };
              } catch {
                return ordem;
              }
            }
            return ordem;
          })
        );
        setOrdens(ordensComCliente);
      } catch (err) {
        setOrdens([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrdens();
  }, []);

  // Função para filtrar ordens
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

      if (filtro === "nome") {
        return nome.toLowerCase().includes(search.toLowerCase());
      }
      if (filtro === "veiculo") {
        return veiculo.toLowerCase().includes(search.toLowerCase());
      }
      if (filtro === "data_entrega") {
        return dataEntrega.toLowerCase().includes(search.toLowerCase());
      }
      if (filtro === "status") {
        if (search.trim() !== "") {
          const statusObj = statusList.find(s =>
            s.nome.toLowerCase().includes(search.toLowerCase()) ||
            String(s.id) === search.trim()
          );
          if (!statusObj) return false;
          return String(status) === String(statusObj.id);
        }
        return true;
      }
      return true;
    });
  };

  // Função para ordenar ordens
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

  // Função para paginar ordens
  const paginarOrdens = (ordensOrdenadas: any[], cardsPerPage: number) => {
    const totalPages = Math.ceil(ordensOrdenadas.length / cardsPerPage);
    const paginatedOrdens = ordensOrdenadas.slice((page - 1) * cardsPerPage, page * cardsPerPage);
    return { paginatedOrdens, totalPages };
  };

  // Handlers dos modais
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
    setAlterando(true);

    let payload: any = { id_status: modalStatusId };

    const ordemAtual = ordens.find((o: any) => o.id_ordem_servico === modalOrdemId);
    if (modalStatusId !== 1 && ordemAtual?.id_status === 1) {
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
      alert(res.data.message || "Status alterado com sucesso!");
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao alterar status.");
    } finally {
      setAlterando(false);
    }
  }

  async function alterarPrioridade() {
    if (!modalOrdemId) return;
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
      alert(res.data.message || "Prioridade/Data de entrega alterada!");
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao alterar prioridade.");
    } finally {
      setAlterando(false);
    }
  }

  return {
    // Estados principais
    ordens,
    setOrdens,
    loading,
    alterando,

    // Estados de filtro/busca
    page,
    setPage,
    search,
    setSearch,
    filtro,
    setFiltro,
    sortAsc,
    setSortAsc,

    // Estados dos modais
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

    // Funções utilitárias
    filtrarOrdens,
    ordenarOrdens,
    paginarOrdens,
    openStatusModal,
    openPrioriModal,
    alterarStatus,
    alterarPrioridade,
    getStatusNome
  };
}