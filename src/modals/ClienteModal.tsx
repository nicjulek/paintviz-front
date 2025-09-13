import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

interface ClienteModalProps {
  show: boolean;
  onClose: () => void;
  onClienteCadastrado?: () => void;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ show, onClose, onClienteCadastrado }) => {
  const [tipo, setTipo] = useState<"fisica" | "juridica">("fisica");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let payload: any = {
      celular,
      email,
    };

    if (tipo === "fisica") {
      payload.pessoa_fisica = { nome, cpf };
    } else {
      payload.pessoa_juridica = { empresa, razao_social: razaoSocial, cnpj };
    }

    try {
      await axios.post(`${API_URL}/clientes`, payload);
      if (onClienteCadastrado) onClienteCadastrado();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar cliente.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block", background: "#0008" }}>
      <div className="modal-dialog">
        <div
          className="modal-content"
          style={{
            background: "#F5E3C6",
            border: "2px solid #D2B896",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Cadastrar Cliente</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body" style={{ borderTop: "2px solid #ceaf76ff", borderBottom: "2px solid #ceaf76ff" }}>
              <div className="mb-3">
                <label className="form-label">Tipo de Cliente</label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={e => setTipo(e.target.value as "fisica" | "juridica")}
                >
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
              </div>
              {tipo === "fisica" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">CPF</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cpf}
                      onChange={e => setCpf(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Empresa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={empresa}
                      onChange={e => setEmpresa(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Razão Social</label>
                    <input
                      type="text"
                      className="form-control"
                      value={razaoSocial}
                      onChange={e => setRazaoSocial(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">CNPJ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cnpj}
                      onChange={e => setCnpj(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label">Celular</label>
                <input
                  type="text"
                  className="form-control"
                  value={celular}
                  onChange={e => setCelular(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteModal;