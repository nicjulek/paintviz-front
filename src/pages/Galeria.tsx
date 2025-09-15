import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import StatusModal from "../modals/StatusModal";
import PrioriModal from "../modals/PrioriModal";
import { useGaleria, statusList } from "../hooks/useGaleria";
import SearchBar from "../components/SearchBar/SearchBar";
import Pagination from "../components/Pagination/Pagination";
import CardsGrid from "../components/CardsGrid/CardsGrid";

const CARDS_PER_PAGE = 16;

const Galeria: React.FC = () => {
  const {
    ordens,
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
    alterarPrioridade
  } = useGaleria();

  if (loading) {
    return <div className="text-center py-5">Carregando...</div>;
  }

  const ordensFiltradas = filtrarOrdens();
  const ordensOrdenadas = ordenarOrdens(ordensFiltradas);
  const { paginatedOrdens, totalPages } = paginarOrdens(ordensOrdenadas, CARDS_PER_PAGE);

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container-fluid py-2">
        <h2 className="mb-4 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
          <i className="bi bi-collection me-2"></i>
          Galeria de Ordens de Serviço
        </h2>
        
        <SearchBar
          search={search}
          setSearch={setSearch}
          filtro={filtro}
          setFiltro={setFiltro}
          sortAsc={sortAsc}
          setSortAsc={setSortAsc}
          setPage={setPage}
        />
        
        <CardsGrid
          ordens={paginatedOrdens}
          openStatusModal={openStatusModal}
          openPrioriModal={openPrioriModal}
        />
        
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
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
        onConfirm={alterarStatus}
        loading={alterando}
      />

      {/* Modal de Prioridade */}
      <PrioriModal
        show={showPrioriModal}
        value={modalDataEntrega}
        onChange={setModalDataEntrega}
        onClose={() => setShowPrioriModal(false)}
        onConfirm={alterarPrioridade}
        loading={alterando}
      />
    </div>
  );
};

export default Galeria;