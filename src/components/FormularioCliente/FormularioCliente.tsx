import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormularioClienteProps } from "../../types/types";
import { useFormCliente } from "../../hooks/useFormCliente";

const FormularioCliente: React.FC<FormularioClienteProps> = ({
  show,
  onClose,
  onClienteCadastrado,
  cliente = null,
  isEditing = false
}) => {
  const {
    tipo,
    setTipo,
    form,
    loading,
    error,
    handleChange,
    handleSubmit
  } = useFormCliente({ cliente, isEditing, show });

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, () => {
      onClienteCadastrado();
      onClose();
    });
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="modal-dialog modal-lg">
        <div
          className="modal-content"
          style={{
            background: "#F5E3C6",
            border: "2px solid #D2B896",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }}
        >
          <div
            className="modal-header"
            style={{
              borderBottom: "2px solid #D2B896",
              background: "linear-gradient(135deg, #F5E3C6 0%, #E8D4B3 100%)"
            }}
          >
            <h4
              className="modal-title fw-bold"
              style={{ color: "#5A402A" }}
            >
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {isEditing ? 'Editar Cliente' : 'Cadastro de Cliente'}
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                filter: "sepia(1) hue-rotate(20deg) saturate(2) brightness(0.8)"
              }}
            ></button>
          </div>
          <form onSubmit={onSubmit}>
            <div
              className="modal-body"
              style={{ background: "#F5E3C6" }}
            >
              <div className="mb-3 d-flex gap-4 justify-content-center">
                <div>
                  <input
                    type="radio"
                    id="fisico"
                    name="tipo"
                    checked={tipo === "fisico"}
                    onChange={() => setTipo("fisico")}
                    disabled={isEditing}
                  />
                  <label htmlFor="fisico" className="ms-2 fw-semibold" style={{ color: "#5A402A" }}>
                    Físico
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="juridico"
                    name="tipo"
                    checked={tipo === "juridico"}
                    onChange={() => setTipo("juridico")}
                    disabled={isEditing}
                  />
                  <label htmlFor="juridico" className="ms-2 fw-semibold" style={{ color: "#5A402A" }}>
                    Jurídico
                  </label>
                </div>
              </div>

              {tipo === "fisico" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                      Nome: <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      required
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF"
                      }}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                        CPF: <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="cpf"
                        value={form.cpf}
                        onChange={handleChange}
                        required
                        placeholder="000.000.000-00"
                        maxLength={14}
                        style={{
                          border: "2px solid #D2B896",
                          borderRadius: "8px",
                          background: "#FFFFFF"
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                        Telefone: <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        required
                        placeholder="(XX) XXXXX-XXXX"
                        maxLength={15}
                        style={{
                          border: "2px solid #D2B896",
                          borderRadius: "8px",
                          background: "#FFFFFF"
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                      E-mail: <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="exemplo@dominio.com"
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF"
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                      Nome: <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      required
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF"
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                      Razão Social: <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="razao_social"
                      value={form.razao_social}
                      onChange={handleChange}
                      required
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF"
                      }}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                        CNPJ: <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="cnpj"
                        value={form.cnpj}
                        onChange={handleChange}
                        required
                        placeholder="00.000.000/0001-00"
                        maxLength={18}
                        style={{
                          border: "2px solid #D2B896",
                          borderRadius: "8px",
                          background: "#FFFFFF"
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                        Telefone: <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        required
                        placeholder="(XX) XXXXX-XXXX"
                        maxLength={15}
                        style={{
                          border: "2px solid #D2B896",
                          borderRadius: "8px",
                          background: "#FFFFFF"
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: "#5A402A" }}>
                      E-mail: <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="exemplo@dominio.com"
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF"
                      }}
                    />
                  </div>
                </>
              )}

              {error && (
                <div
                  className="alert mt-2"
                  style={{
                    background: "linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%)",
                    border: "2px solid #f5c2c7",
                    borderRadius: "12px",
                    color: "#721c24"
                  }}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
            </div>
            <div
              className="modal-footer"
              style={{
                borderTop: "2px solid #D2B896",
                background: "#F5E3C6"
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                style={{
                  background: "#93908cff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  padding: "10px 20px"
                }}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
                style={{
                  background: loading ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  padding: "10px 20px",
                  boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {isEditing ? 'Atualizando...' : 'Salvando...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                    {isEditing ? 'Atualizar' : 'Salvar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioCliente;