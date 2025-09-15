import React, { useState, useEffect } from "react";
import axios from "axios";
import { Usuario } from "../types/types";
import { ModalCadastroAtendenteProps } from "../types/types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

const CadastroAtendenteModal: React.FC<ModalCadastroAtendenteProps> = ({
  show,
  onClose,
  onSuccess,
  id,
}) => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (show && id) {
      setLoading(true);
      const token = localStorage.getItem('token');
      axios
        .get<Usuario>(`${API_URL}/usuarios/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        .then((response) => setNome(response.data.nome))
        .catch(() => setErro("Não foi possível carregar os dados para edição."))
        .finally(() => setLoading(false));
    } else if (show) {
      setNome("");
      setSenha("");
      setConfirmarSenha("");
      setErro("");
    }
  }, [id, show]);

  function senhaValida(senha: string) {
    return senha.length >= 6 && /[a-zA-Z]/.test(senha);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (senha) {
      if (!senhaValida(senha)) {
        setErro("A senha deve ter pelo menos 6 caracteres e conter letras.");
        setLoading(false);
        return;
      }
      if (senha !== confirmarSenha) {
        setErro("As senhas não conferem.");
        setLoading(false);
        return;
      }
    }

    const payload: any = { nome };
    if (senha) {
      payload.senha = senha;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (id) {
        await axios.put(`${API_URL}/usuarios/${id}`, payload, { headers });
      } else {
        await axios.post(`${API_URL}/usuarios`, payload, { headers });
      }

      // Limpar campos após sucesso
      setNome("");
      setSenha("");
      setConfirmarSenha("");
      setErro("");

      onSuccess();
      onClose();
    } catch (err: any) {
      setErro(err.response?.data?.error || "Erro ao salvar atendente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block", background: "#0008" }}>
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
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-person-gear me-2"></i>
                {id ? "Editar Atendente" : "Cadastrar Novo Atendente"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
            </div>
            <div className="modal-body" style={{ borderTop: "2px solid #ceaf76ff", borderBottom: "2px solid #ceaf76ff" }}>
              {erro && (
                <div className="alert alert-danger d-flex align-items-center" style={{ borderRadius: "8px" }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {erro}
                </div>
              )}

              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-person me-2"></i>
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o nome do atendente"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #D2B896"
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-lock me-2"></i>
                    {id ? "Nova Senha (opcional)" : "Senha"}
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Digite a senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required={!id}
                      disabled={loading}
                      style={{
                        borderRadius: "8px 0 0 8px",
                        border: "2px solid #D2B896",
                        borderRight: "1px solid #D2B896"
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      style={{
                        borderRadius: "0 8px 8px 0",
                        border: "2px solid #D2B896",
                        borderLeft: "1px solid #D2B896",
                        backgroundColor: "white"
                      }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {!id && (
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Mínimo 6 caracteres contendo letras
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    <i className="bi bi-shield-check me-2"></i>
                    Confirmar Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirme a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required={!id || !!senha}
                    disabled={loading}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #D2B896"
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary d-flex align-items-center"
                onClick={onClose}
                disabled={loading}
                style={{
                  background: "#93908cff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  padding: "10px 20px"
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success d-flex align-items-center"
                disabled={loading || !nome || (!id && !senha)}
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
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {id ? "Atualizar" : "Salvar"}
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

export default CadastroAtendenteModal;