import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import CardOrdem from "../components/CardOrdem/CardOrdem";
import StatusModal from "../modals/StatusModal";
import PrioriModal from "../modals/PrioriModal";
import { useGaleria, statusList } from "../hooks/useGaleria";

const CARDS_PER_PAGE = 16;

const Galeria: React.FC = () => {
  const {
    ordens,
    setOrdens,
    loading,
    alterando,
    alterarStatus,
    alterarPrioridade
  } = useGaleria();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"nome" | "data_entrega" | "veiculo" | "status">("nome");
  const [sortAsc, setSortAsc] = useState(true);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPrioriModal, setShowPrioriModal] = useState(false);
  const [modalOrdemId, setModalOrdemId] = useState<number | null>(null);
  const [modalStatusId, setModalStatusId] = useState<number>(0);
  const [modalDataEmissao, setModalDataEmissao] = useState<string>("");
  const [modalDataProgramada, setModalDataProgramada] = useState<string>("");
  const [modalDataEntrega, setModalDataEntrega] = useState<string>("");
  const [modalNumeroBox, setModalNumeroBox] = useState<string>("");

  let ordensFiltradas = ordens.filter(ordem => {
    const nome =
      ordem.cliente?.pessoa_fisica?.nome ||
      ordem.cliente?.pessoa_juridica?.empresa ||
      ordem.nome_cliente ||
      "";
    const veiculo = ordem.identificacao_veiculo || "";
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

  if (filtro === "data_entrega") {
    ordensFiltradas = ordensFiltradas.sort((a, b) => {
      const aDate = a.data_entrega ? new Date(a.data_entrega).getTime() : 0;
      const bDate = b.data_entrega ? new Date(b.data_entrega).getTime() : 0;
      return sortAsc ? aDate - bDate : bDate - aDate;
    });
  } else if (filtro === "nome") {
    ordensFiltradas = ordensFiltradas.sort((a, b) => {
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
    ordensFiltradas = ordensFiltradas.sort((a, b) => {
      const aVeiculo = a.identificacao_veiculo || "";
      const bVeiculo = b.identificacao_veiculo || "";
      return sortAsc
        ? aVeiculo.localeCompare(bVeiculo)
        : bVeiculo.localeCompare(aVeiculo);
    });
  } else if (filtro === "status") {
    ordensFiltradas = ordensFiltradas.sort((a, b) => {
      return sortAsc ? a.id_status - b.id_status : b.id_status - a.id_status;
    });
  }

  const totalPages = Math.ceil(ordensFiltradas.length / CARDS_PER_PAGE);
  const paginatedOrdens = ordensFiltradas.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

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

  const handleConfirmStatus = async () => {
    await alterarStatus({
      modalOrdemId,
      modalStatusId,
      modalNumeroBox,
      modalDataEmissao,
      modalDataProgramada,
      modalDataEntrega,
      ordens,
      setOrdens,
      setShowStatusModal
    });
  };

  const handleConfirmPriori = async () => {
    await alterarPrioridade({
      modalOrdemId,
      modalDataEntrega,
      ordens,
      setOrdens,
      setShowPrioriModal
    });
  };

  if (loading) {
    return <div className="text-center py-5">Carregando...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container-fluid py-2">
        <h3 className="fw-bold mb-3 ms-1">Galeria de Ordens de Serviço</h3>
        <div className="row justify-content-center mb-4">
          <div className="col-12 px-2 d-flex justify-content-center">
            <div
              className="d-flex flex-row align-items-center gap-2 px-3 py-2 rounded shadow-sm"
              style={{
                background: "#dcc7a3",
                width: "100%",
                maxWidth: "1700px",
                minWidth: 200,
                margin: "0 auto",
                boxSizing: "border-box",
                borderRadius: "16px",
                justifyContent: "center",
                boxShadow: "0 8px 32px 0 rgba(90,64,42,0.18), 0 2px 8px 0 rgba(90,64,42,0.10)"
              }}
            >
              <span className="me-2" style={{ color: "#888", fontSize: "1.3rem" }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={
                  filtro === "status"
                    ? "Pesquisar status por nome ou número..."
                    : "Pesquisar..."
                }
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{
                  minWidth: 200,
                  width: "100%",
                  maxWidth: "1500px",
                  fontSize: "1rem",
                }}
              />
              <select
                className="form-select"
                value={filtro}
                onChange={e => {
                  setFiltro(e.target.value as any);
                  setPage(1);
                  setSearch("");
                }}
                style={{
                  minWidth: 180,
                  maxWidth: 220,
                  fontSize: "1rem",
                  color: "#888",
                  borderRadius: "8px",
                  backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg fill=\"%23666\" height=\"16\" viewBox=\"0 0 24 24\" width=\"16\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.2em"
                }}
              >
                <option value="nome">Nome do Cliente</option>
                <option value="data_entrega">Data de Entrega</option>
                <option value="veiculo">Veículo</option>
                <option value="status">Status</option>
              </select>
              <button
                className="btn btn-outline-secondary"
                type="button"
                title={sortAsc ? "Ordenar do primeiro para o último" : "Ordenar do último para o primeiro"}
                onClick={() => setSortAsc(s => !s)}
                style={{
                  minWidth: 48,
                  fontSize: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#5A402A",
                  color: "#fff",
                  border: "2px solid #C4AE78"
                }}
              >
                {sortAsc ? (
                  <i className="bi bi-arrow-down-short"></i>
                ) : (
                  <i className="bi bi-arrow-up-short"></i>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="row gx-4 gy-4 justify-content-center" style={{ marginLeft: 0, marginRight: 0 }}>
          {paginatedOrdens.map(ordem => (
            <div
              className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
              key={ordem.id_ordem_servico}
            >
              <div style={{ width: "100%", maxWidth: 380, minWidth: 220 }}>
                <CardOrdem
                  id_ordem_servico={ordem.id_ordem_servico}
                  identificacao_veiculo={ordem.identificacao_veiculo}
                  status={ordem.id_status}
                  nome_cliente={
                    ordem.cliente?.pessoa_fisica?.nome ||
                    ordem.cliente?.pessoa_juridica?.empresa ||
                    ordem.nome_cliente ||
                    ""
                  }
                  data_entrega={ordem.data_entrega}
                  id_pintura={ordem.id_pintura}
                  onAlterarStatus={() => openStatusModal(ordem)}
                  onAlterarPrioridade={() => openPrioriModal(ordem)}
                />
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item${page === i + 1 ? " active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
              </li>
            </ul>
          </nav>
        )}
      </main>

      {/* Modal de Status */}
      <StatusModal
        show={showStatusModal}
        statusList={statusList}
        value={modalStatusId}
        statusAtual={
          modalOrdemId
            ? ordens.find(o => o.id_ordem_servico === modalOrdemId)?.id_status ?? 1
            : 1
        }
        dataEmissao={modalDataEmissao}
        dataProgramada={modalDataProgramada}
        dataEntrega={modalDataEntrega}
        onDataEmissaoChange={setModalDataEmissao}
        onDataProgramadaChange={setModalDataProgramada}
        onDataEntregaChange={setModalDataEntrega}
        numeroBox={modalNumeroBox}
        onNumeroBoxChange={setModalNumeroBox}
        onChange={setModalStatusId}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleConfirmStatus}
        loading={alterando}
      />

      {/* Modal de Prioridade */}
      <PrioriModal
        show={showPrioriModal}
        value={modalDataEntrega}
        onChange={setModalDataEntrega}
        onClose={() => setShowPrioriModal(false)}
        onConfirm={handleConfirmPriori}
        loading={alterando}
      />
    </div>
  );
};

export default Galeria;