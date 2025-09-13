import React from "react";

const SearchBar: React.FC<{
  search: string;
  setSearch: (value: string) => void;
  filtro: "nome" | "data_entrega" | "veiculo" | "status";
  setFiltro: (value: "nome" | "data_entrega" | "veiculo" | "status") => void;
  sortAsc: boolean;
  setSortAsc: (value: boolean) => void;
  setPage: (page: number) => void;
}> = ({ search, setSearch, filtro, setFiltro, sortAsc, setSortAsc, setPage }) => (
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
            setFiltro(e.target.value as "nome" | "data_entrega" | "veiculo" | "status");
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
          <option value="veiculo">Placa</option>
          <option value="status">Status</option>
        </select>
        <button
          className="btn btn-outline-secondary"
          type="button"
          title={sortAsc ? "Ordenar do primeiro para o último" : "Ordenar do último para o primeiro"}
          onClick={() => setSortAsc(!sortAsc)}
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
);

export default SearchBar;