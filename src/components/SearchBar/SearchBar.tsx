import React from "react";
import { periodOptions, statusList } from "../../hooks/useGaleria";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  filtro: "nome" | "data_entrega" | "veiculo" | "status";
  setFiltro: (value: "nome" | "data_entrega" | "veiculo" | "status") => void;
  sortAsc: boolean;
  setSortAsc: (value: boolean) => void;
  setPage: (page: number) => void;
  filtroStatus: string;
  setFiltroStatus: (value: string) => void;
  filtroPeriodo: string;
  setFiltroPeriodo: (value: string) => void;
  dataInicio: string;
  setDataInicio: (value: string) => void;
  dataFim: string;
  setDataFim: (value: string) => void;
  limparFiltros: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  filtro,
  setFiltro,
  sortAsc,
  setSortAsc,
  setPage,
  filtroStatus,
  setFiltroStatus,
  filtroPeriodo,
  setFiltroPeriodo,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  limparFiltros
}) => {
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFiltroChange = (value: "nome" | "data_entrega" | "veiculo" | "status") => {
    setFiltro(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFiltroStatus(value);
    setPage(1);
  };

  const handlePeriodoChange = (value: string) => {
    setFiltroPeriodo(value);
    setPage(1);
  };

  return (
    <div
      className="mb-4"
      style={{ 
        background: 'linear-gradient(135deg, #D5C0A0 0%, #c4b094 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(79, 56, 37, 0.15)',
        boxShadow: '0 4px 12px rgba(79, 56, 37, 0.1)',
        overflow: 'hidden'
      }}
    >
      <div 
        className="px-3 py-2"
        style={{ 
          background: 'linear-gradient(135deg, #4F3825 0%, #3d2c1c 100%)'
        }}
      >
        <h6 className="mb-0 fw-bold d-flex align-items-center" style={{ color: '#D5C0A0', fontSize: '1rem' }}>
          <div 
            className="d-flex align-items-center justify-content-center me-2"
            style={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #D5C0A0 0%, #b8a586 100%)',
              borderRadius: '6px',
              color: '#4F3825'
            }}
          >
            <i className="bi bi-funnel-fill" style={{ fontSize: '0.85rem' }}></i>
          </div>
          Filtros e Busca
        </h6>
      </div>

      <div className="px-3 py-2">
        <div className="row g-2 align-items-end">
          <div className="col-5">
            <label className="form-label fw-bold mb-2" style={{ color: '#4F3825', fontSize: '0.95rem' }}>
              <i className="bi bi-search me-1"></i> Buscar:
            </label>
            <div className="input-group">
              <select
                className="form-select border-0"
                style={{ 
                  maxWidth: '130px',
                  backgroundColor: 'rgba(79, 56, 37, 0.1)',
                  color: '#4F3825',
                  fontWeight: '600',
                  fontSize: '1rem',
                  borderRadius: '10px 0 0 10px',
                  padding: '10px 12px'
                }}
                value={filtro}
                onChange={(e) => handleFiltroChange(e.target.value as any)}
              >
                <option value="nome">Cliente</option>
                <option value="veiculo">Veículo</option>
                <option value="data_entrega">Data</option>
                <option value="status">Status</option>
              </select>
              <input
                type="text"
                className="form-control border-0"
                style={{ 
                  borderRadius: '0 10px 10px 0',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#4F3825',
                  fontWeight: '500',
                  fontSize: '1rem',
                  padding: '10px 14px'
                }}
                placeholder={`Digite ${
                  filtro === "nome" ? "nome do cliente" :
                  filtro === "veiculo" ? "placa do veículo" :
                  filtro === "data_entrega" ? "data" :
                  "status"
                }...`}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-2">
            <label className="form-label fw-bold mb-1" style={{ color: '#4F3825', fontSize: '0.95rem' }}>
              <i className="bi bi-tag-fill me-1"></i> Status:
            </label>
            <select
              className="form-select border-0"
              style={{ 
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#4F3825',
                fontWeight: '500',
                fontSize: '1rem',
                padding: '10px 12px'
              }}
              value={filtroStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="aberto">Em aberto</option>
              <option value="finalizado">Finalizadas</option>
              <optgroup label="Específicos:">
                {statusList.map(status => (
                  <option key={status.id} value={String(status.id)}>
                    {status.nome}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          
          {/* Período */}
          <div className="col-2">
            <label className="form-label fw-bold mb-1" style={{ color: '#4F3825', fontSize: '0.95rem' }}>
              <i className="bi bi-calendar-range-fill me-1"></i> Período:
            </label>
            <select
              className="form-select border-0"
              style={{ 
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#4F3825',
                fontWeight: '500',
                fontSize: '1rem',
                padding: '10px 12px'
              }}
              value={filtroPeriodo}
              onChange={(e) => handlePeriodoChange(e.target.value)}
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {filtroPeriodo === "custom" ? (
            <div className="col-2">
              <label className="form-label fw-bold mb-1" style={{ color: '#4F3825', fontSize: '0.95rem' }}>
                <i className="bi bi-calendar-week me-1"></i> Datas:
              </label>
              <div className="d-flex gap-1">
                <input
                  type="date"
                  className="form-control border-0"
                  style={{ 
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#4F3825',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '8px 10px'
                  }}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  title="Data início"
                />
                <input
                  type="date"
                  className="form-control border-0"
                  style={{ 
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#4F3825',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '8px 10px'
                  }}
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  title="Data fim"
                />
              </div>
            </div>
          ) : (
            /* Ordenação - aparece quando não tem período customizado */
            <div className="col-2">
              <label className="form-label fw-bold mb-1" style={{ color: '#4F3825', fontSize: '0.95rem' }}>
                <i className="bi bi-arrow-up-down me-1"></i> Ordenação:
              </label>
              <select
                className="form-select border-0"
                style={{ 
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#4F3825',
                  fontWeight: '600',
                  fontSize: '1rem',
                  padding: '10px 12px'
                }}
                value={sortAsc ? "asc" : "desc"}
                onChange={(e) => setSortAsc(e.target.value === "asc")}
              >
                <option value="desc">
                  {filtro === "data_entrega" ? "Mais recente" : 
                   filtro === "nome" ? "Z → A" :
                   "Decrescente"}
                </option>
                <option value="asc">
                  {filtro === "data_entrega" ? "Mais antigo" : 
                   filtro === "nome" ? "A → Z" :
                   "Crescente"}
                </option>
              </select>
            </div>
          )}
          
          {/* Botão Limpar */}
          <div className="col-1">
            <button
              className="btn w-100 fw-bold d-flex align-items-center justify-content-center"
              style={{
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: '#4F3825',
                color: '#D5C0A0',
                border: 'none',
                fontSize: '1rem',
                padding: '10px 8px',
                marginTop: '1.4rem',
                minHeight: '42px'
              }}
              onClick={limparFiltros}
              title="Limpar filtros"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D5C0A0';
                e.currentTarget.style.color = '#4F3825';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4F3825';
                e.currentTarget.style.color = '#D5C0A0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;