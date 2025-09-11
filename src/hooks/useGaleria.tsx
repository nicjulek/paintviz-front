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

  async function alterarStatus({
    modalOrdemId,
    modalStatusId,
    modalNumeroBox,
    modalDataEmissao,
    modalDataProgramada,
    modalDataEntrega,
    ordens,
    setOrdens,
    setShowStatusModal
  }: any) {
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

  async function alterarPrioridade({
    modalOrdemId,
    modalDataEntrega,
    ordens,
    setOrdens,
    setShowPrioriModal
  }: any) {
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
    ordens,
    setOrdens,
    loading,
    setLoading,
    alterando,
    setAlterando,
    alterarStatus,
    alterarPrioridade,
    getStatusNome 
  };
}