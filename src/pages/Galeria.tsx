import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import StatusModal from "../modals/StatusModal";
import PrioriModal from "../modals/PrioriModal";
import { useGaleria, statusList, periodOptions } from "../hooks/useGaleria";
import SearchBar from "../components/SearchBar/SearchBar";
import Pagination from "../components/Pagination/Pagination";
import CardsGrid from "../components/CardsGrid/CardsGrid";
import { Tooltip } from "../components/Tooltip";

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
        <Tooltip helpText="Esta é a galeria onde você pode visualizar todas as ordens de serviço do sistema. Use os filtros e ferramentas de pesquisa para encontrar ordens específicas.">
          <h2 className="mb-4 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
            <i className="bi bi-collection me-2"></i>
            Galeria de Ordens de Serviço
          </h2>
        </Tooltip>
        
        <Tooltip helpText="Use esta barra de pesquisa para filtrar ordens por cliente, status, período e outros critérios. Você pode combinar múltiplos filtros para encontrar exatamente o que procura.">
          <SearchBar
            search={search}
            setSearch={setSearch}
            filtro={filtro}
            setFiltro={setFiltro}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
            setPage={setPage}
            filtroStatus={filtroStatus}
            setFiltroStatus={setFiltroStatus}
            filtroPeriodo={filtroPeriodo}
            setFiltroPeriodo={setFiltroPeriodo}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            limparFiltros={limparFiltros}
          />
        </Tooltip>
        
        {/* Indicador de resultados */}
        <div className="mb-4">
          <Tooltip helpText="Este painel mostra quantas ordens estão sendo exibidas no total e quais filtros estão ativos. Os badges coloridos indicam os filtros aplicados.">
            <div 
              className="d-flex align-items-center justify-content-between p-3 rounded-3"
              style={{
                background: 'linear-gradient(135deg, rgba(213, 192, 160, 0.3) 0%, rgba(196, 176, 148, 0.3) 100%)',
                border: '1px solid rgba(79, 56, 37, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle-fill me-2" style={{ color: '#4F3825', fontSize: '1.2rem' }}></i>
                <span style={{ color: '#4F3825', fontSize: '1rem', fontWeight: '600' }}>
                  Exibindo <strong>{paginatedOrdens.length}</strong> de <strong>{ordensFiltradas.length}</strong> ordens
                </span>
              </div>
              
              <div className="d-flex gap-2">
                {filtroStatus !== "todos" && (
                  <Tooltip helpText="Este badge indica que há um filtro de status ativo. Clique no botão 'Limpar Filtros' na barra de pesquisa para remover.">
                    <span 
                      className="badge px-3 py-2"
                      style={{
                        backgroundColor: '#4F3825',
                        color: '#D5C0A0',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        borderRadius: '20px'
                      }}
                    >
                      <i className="bi bi-funnel-fill me-1"></i>
                      {filtroStatus === "aberto" ? "Em aberto" : 
                       filtroStatus === "finalizado" ? "Finalizadas" : 
                       filtroStatus}
                    </span>
                  </Tooltip>
                )}
                {filtroPeriodo !== "all" && (
                  <Tooltip helpText="Este badge indica que há um filtro de período ativo. As ordens mostradas estão limitadas ao período selecionado.">
                    <span 
                      className="badge px-3 py-2"
                      style={{
                        backgroundColor: '#0d6efd',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        borderRadius: '20px'
                      }}
                    >
                      <i className="bi bi-calendar3 me-1"></i>
                      {filtroPeriodo === "month" ? "Último mês" :
                       filtroPeriodo === "week" ? "Última semana" :
                       filtroPeriodo === "today" ? "Hoje" :
                       filtroPeriodo === "custom" ? "Período personalizado" :
                       periodOptions.find(p => p.value === filtroPeriodo)?.label || filtroPeriodo}
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
          </Tooltip>
        </div>
        
        <Tooltip helpText="Aqui estão exibidas todas as ordens de serviço em formato de cards. Clique em uma ordem para ver detalhes completos, ou use os botões de ação para alterar status e prioridade rapidamente.">
          <CardsGrid
            ordens={paginatedOrdens}
            openStatusModal={openStatusModal}
            openPrioriModal={openPrioriModal}
          />
        </Tooltip>
        
        {totalPages > 1 && (
          <Tooltip helpText="Use esta paginação para navegar entre as diferentes páginas de ordens. Você pode ir diretamente para uma página específica ou usar as setas para navegar sequencialmente.">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Tooltip>
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