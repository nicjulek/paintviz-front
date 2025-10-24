import React, { useState, useMemo } from "react";
import FormularioCliente from "../FormularioCliente/FormularioCliente";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormOrdem } from "../../hooks/useFormOrdem";

const FormularioOrdem: React.FC = () => {
  const {
    clientes,
    showModal,
    setShowModal,
    statusList,
    form,
    loading,
    error,
    bloqueado,
    handleChange,
    handleVoltar,
    handleSubmit,
    fetchData,
    isPreOrdem,
    isEdicao,
    usuarioLogado
  } = useFormOrdem();

  //dropdown
  const [pesquisaCliente, setPesquisaCliente] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [pesquisaStatus, setPesquisaStatus] = useState("");
  const [showDropdownStatus, setShowDropdownStatus] = useState(false);

  const hoje = new Date().toISOString().split('T')[0];

  // Filtra e ordena clientes alfabeticamente
  const clientesFiltrados = useMemo(() => {
    const clientesOrdenados = clientes
      .map(c => ({
        ...c,
        nomeDisplay: c.pessoa_fisica ? c.pessoa_fisica.nome : c.pessoa_juridica?.empresa || 'Cliente sem nome'
      }))
      .sort((a, b) => a.nomeDisplay.localeCompare(b.nomeDisplay));

    if (!pesquisaCliente) return clientesOrdenados;

    return clientesOrdenados.filter(c => 
      c.nomeDisplay.toLowerCase().includes(pesquisaCliente.toLowerCase())
    );
  }, [clientes, pesquisaCliente]);

  // filtra e ordena status alfabeticamente
  // remove status que não podem ser selecionados ao criar uma nova ordem
  const statusFiltrados = useMemo(() => {
    let statusDisponivel = statusList;

    // se não é edição, filtra status que não podem ser criados
    if (!isEdicao) {
      // assume-se que os IDs dos status são:
      // 3 = Em produção, 4 = Finalizada, 5 = Cancelada
      const statusProibidos = ['3', '4', '5']; // ids dos status proibidos para criação
      statusDisponivel = statusList.filter(s => 
        !statusProibidos.includes(String(s.id_status))
      );
    }

    const statusOrdenados = statusDisponivel
      .map(s => ({
        ...s,
        nomeDisplay: s.descricao || s.nome_status || 'Status sem nome'
      }))
      .sort((a, b) => a.nomeDisplay.localeCompare(b.nomeDisplay));

    if (!pesquisaStatus) return statusOrdenados;

    return statusOrdenados.filter(s => 
      s.nomeDisplay.toLowerCase().includes(pesquisaStatus.toLowerCase())
    );
  }, [statusList, pesquisaStatus, isEdicao]);

  const handleClienteSelect = (cliente: any) => {
    handleChange({ target: { name: 'id_cliente', value: cliente.id_cliente } } as any);
    setPesquisaCliente(cliente.nomeDisplay);
    setShowDropdown(false);
  };

  const handleStatusSelect = (status: any) => {
    handleChange({ target: { name: 'status', value: status.id_status } } as any);
    setPesquisaStatus(status.nomeDisplay);
    setShowDropdownStatus(false);
  };

  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisaCliente(e.target.value);
    setShowDropdown(true);
    // Limpa seleção se o usuário está digitando
    if (form.id_cliente) {
      handleChange({ target: { name: 'id_cliente', value: '' } } as any);
    }
  };

  const handlePesquisaStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisaStatus(e.target.value);
    setShowDropdownStatus(true);
    // Limpa seleção se o usuário está digitando
    if (form.status) {
      handleChange({ target: { name: 'status', value: '' } } as any);
    }
  };

  console.log("Acesso bloqueado?", bloqueado, "| Edição?", isEdicao);
  //bloqueia cadastro se nenhum pintura existe (menos em edição)
  if (bloqueado && !isEdicao) {
    return (
      <div className="container py-4">
        <div className="bg-paintviz-accent p-4 rounded shadow text-center">
          <h2 className="mb-4">Cadastro de Ordem de Serviço</h2>
          <div className="alert alert-warning">
            Para cadastrar uma ordem de serviço, primeiro crie e salve uma pintura.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
        <i className="bi bi-truck me-2"></i>
        Cadastro de Ordem de Serviço</h2>
      <form
        className="p-4 shadow"
        style={{
          background: '#D5C0A0',
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
          border: "1px solid #fff",
          borderRadius: "24px"
        }}
        onSubmit={handleSubmit}
      >
        <div className="row mb-3">
          <div className="col-md-8">
            <label className="form-label">Cliente: <span className="text-danger">*</span></label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Selecione o nome do cliente"
                value={pesquisaCliente}
                onChange={handlePesquisaChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={(e) => {
                  // delay para permitir clique no dropdown
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                style={{ paddingRight: '2.5rem' }}
                required
              />
              <i 
                className="bi bi-chevron-down position-absolute"
                style={{
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#6c757d'
                }}
              ></i>
              {showDropdown && clientesFiltrados.length > 0 && (
                <div 
                  className="position-absolute w-100 bg-white border rounded shadow-lg"
                  style={{ 
                    top: '100%', 
                    zIndex: 1000, 
                    maxHeight: '200px', 
                    overflowY: 'auto' 
                  }}
                >
                  {clientesFiltrados.map(cliente => (
                    <div
                      key={cliente.id_cliente}
                      className="p-2 border-bottom cursor-pointer hover-bg-light"
                      style={{ cursor: 'pointer' }}
                      onMouseDown={(e) => e.preventDefault()} // evita perder foco do input
                      onClick={() => handleClienteSelect(cliente)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {cliente.nomeDisplay}
                    </div>
                  ))}
                </div>
              )}
              {showDropdown && pesquisaCliente && clientesFiltrados.length === 0 && (
                <div 
                  className="position-absolute w-100 bg-white border rounded shadow-lg p-2"
                  style={{ top: '100%', zIndex: 1000 }}
                >
                  <div className="text-muted">Nenhum cliente encontrado</div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => setShowModal(true)}
            >
              Cadastrar Cliente
            </button>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Usuário: <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={usuarioLogado?.nome || 'Usuário não encontrado'}
              disabled
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Status: <span className="text-danger">*</span></label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Selecione o status"
                value={pesquisaStatus}
                onChange={handlePesquisaStatusChange}
                onFocus={() => setShowDropdownStatus(true)}
                onBlur={(e) => {
                  setTimeout(() => setShowDropdownStatus(false), 200);
                }}
                style={{ paddingRight: '2.5rem' }}
                required
              />
              <i 
                className="bi bi-chevron-down position-absolute"
                style={{
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#6c757d'
                }}
              ></i>
              {showDropdownStatus && statusFiltrados.length > 0 && (
                <div 
                  className="position-absolute w-100 bg-white border rounded shadow-lg"
                  style={{ 
                    top: '100%', 
                    zIndex: 1000, 
                    maxHeight: '200px', 
                    overflowY: 'auto' 
                  }}
                >
                  {statusFiltrados.map(status => (
                    <div
                      key={status.id_status}
                      className="p-2 border-bottom cursor-pointer hover-bg-light"
                      style={{ cursor: 'pointer' }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleStatusSelect(status)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {status.nomeDisplay}
                    </div>
                  ))}
                </div>
              )}
              {showDropdownStatus && pesquisaStatus && statusFiltrados.length === 0 && (
                <div 
                  className="position-absolute w-100 bg-white border rounded shadow-lg p-2"
                  style={{ top: '100%', zIndex: 1000 }}
                >
                  <div className="text-muted">Nenhum status encontrado</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Modelo do Veículo: <span className="text-danger">*</span></label>
            <input
              className="form-control"
              name="modelo_veiculo"
              value={form.modelo_veiculo}
              onChange={handleChange}
              required
              placeholder="Ex: Scania R450"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Placa do Veículo: <span className="text-danger">*</span></label>
            <input
              className="form-control"
              name="placa_veiculo"
              value={form.placa_veiculo}
              onChange={handleChange}
              required={!isPreOrdem}
              placeholder="Ex: ABC1234"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Identificação do Veículo: <span className="text-danger">*</span></label>
            <input
              className="form-control"
              name="identificacao_veiculo"
              value={form.identificacao_veiculo}
              onChange={handleChange}
              required={!isPreOrdem}
              placeholder="Ex: XYZ789012345"
            />
          </div>
        </div>
        {!isPreOrdem && (
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Data de Emissão:</label>
              <input
                type="date"
                className="form-control"
                name="data_emissao"
                value={form.data_emissao}
                onChange={handleChange}
                min={hoje}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Data de Entrega:</label>
              <input
                type="date"
                className="form-control"
                name="data_entrega"
                value={form.data_entrega}
                onChange={handleChange}
                min={hoje}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Data Programada:</label>
              <input
                type="date"
                className="form-control"
                name="data_programada"
                value={form.data_programada}
                onChange={handleChange}
                min={hoje}
                required
              />
            </div>
          </div>
        )}
        {String(form.status) === "3" && (
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Número do Box:</label>
              <input
                className="form-control"
                name="numero_box"
                value={form.numero_box}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleVoltar}
            style={{
              background: "#93908cff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              padding: "10px 20px"
            }}>
            <i className="bi bi-x-circle me-2"></i> Voltar
          </button>
          <button type="submit" className="btn btn-success" disabled={loading} style={{
            background: loading ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            padding: "10px 20px",
            boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
          }}>
            <i className="bi bi-check-circle me-2"></i> {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
      <FormularioCliente
        show={showModal}
        onClose={() => setShowModal(false)}
        onClienteCadastrado={fetchData}
      />
    </div>
  );
};

export default FormularioOrdem;