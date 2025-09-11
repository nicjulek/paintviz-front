import React from "react";
import FormularioCliente from "../FormularioCliente/FormularioCliente";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormOrdem } from "../../hooks/useFormOrdem";

const FormularioOrdem: React.FC = () => {
  const {
    clientes,
    usuarios,
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
    isEdicao
  } = useFormOrdem();

  console.log("Acesso bloqueado?", bloqueado, "| Edição?", isEdicao);

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
      <h2 className="mb-4">Cadastro de Ordem de Serviço</h2>
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
            <select
              className="form-control"
              name="id_cliente"
              value={form.id_cliente}
              onChange={handleChange}
              required
            >
              <option value="">Nome do Cliente</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.pessoa_fisica ? c.pessoa_fisica.nome : c.pessoa_juridica?.empresa}
                </option>
              ))}
            </select>
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
            <select
              className="form-control"
              name="id_usuario_responsavel"
              value={form.id_usuario_responsavel}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o usuário</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Status: <span className="text-danger">*</span></label>
            <select
              className="form-control select-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o status</option>
              {statusList.map(s => (
                <option key={s.id_status} value={s.id_status}>{s.descricao || s.nome_status}</option>
              ))}
            </select>
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
        {/* Só mostra campos de data se NÃO for pré-ordem */}
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
                required
              />
            </div>
          </div>
        )}
        {statusList.find(s => String(s.id_status) === String(form.status))?.descricao === "em_produção" && (
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
          <button type="button" className="btn btn-secondary" onClick={handleVoltar}>
            <i className="bi bi-arrow-left"></i> Voltar
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <i className="bi bi-check-lg"></i> {loading ? "Salvando..." : "Salvar"}
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