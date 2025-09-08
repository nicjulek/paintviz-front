import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

interface Props {
  show: boolean;
  onClose: () => void;
  onClienteCadastrado: () => void;
}

const FormularioCliente: React.FC<Props> = ({ show, onClose, onClienteCadastrado }) => {
  const [tipo, setTipo] = useState<"fisico" | "juridico">("fisico");
  const [form, setForm] = useState({
    nome: "",
    razao_social: "",
    cnpj: "",
    cpf: "",
    telefone: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let payload: any = {
        celular: form.telefone,
        email: form.email
      };
      if (tipo === "fisico") {
        payload.pessoa_fisica = {
          nome: form.nome,
          cpf: form.cpf
        };
      } else {
        payload.pessoa_juridica = {
          empresa: form.nome,
          razao_social: form.razao_social,
          cnpj: form.cnpj
        };
      }
      await axios.post(`${API_URL}/clientes`, payload);
      onClienteCadastrado();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar cliente.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ background: "#E8D5B7" }}>
          <div className="modal-header">
            <h4 className="modal-title">Cadastro de Cliente</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3 d-flex gap-4 justify-content-center">
                <div>
                  <input type="radio" id="fisico" name="tipo" checked={tipo === "fisico"} onChange={() => setTipo("fisico")} />
                  <label htmlFor="fisico" className="ms-2">Físico</label>
                </div>
                <div>
                  <input type="radio" id="juridico" name="tipo" checked={tipo === "juridico"} onChange={() => setTipo("juridico")} />
                  <label htmlFor="juridico" className="ms-2">Jurídico</label>
                </div>
              </div>
              {tipo === "fisico" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nome: <span className="text-danger">*</span></label>
                    <input className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">CPF: <span className="text-danger">*</span></label>
                      <input className="form-control" name="cpf" value={form.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Telefone: <span className="text-danger">*</span></label>
                      <input className="form-control" name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-mail: <span className="text-danger">*</span></label>
                    <input className="form-control" name="email" value={form.email} onChange={handleChange} required placeholder="exemplo@dominio.com" />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nome: <span className="text-danger">*</span></label>
                    <input className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Razão Social: <span className="text-danger">*</span></label>
                    <input className="form-control" name="razao_social" value={form.razao_social} onChange={handleChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">CNPJ: <span className="text-danger">*</span></label>
                      <input className="form-control" name="cnpj" value={form.cnpj} onChange={handleChange} required placeholder="00.000.000/0001-00" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Telefone: <span className="text-danger">*</span></label>
                      <input className="form-control" name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-mail: <span className="text-danger">*</span></label>
                    <input className="form-control" name="email" value={form.email} onChange={handleChange} required placeholder="exemplo@dominio.com" />
                  </div>
                </>
              )}
              {error && <div className="alert alert-danger mt-2">{error}</div>}
            </div>
            <div className="modal-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Voltar</button>
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

export default FormularioCliente;