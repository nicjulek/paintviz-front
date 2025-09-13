import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button/Button";
import { Usuario } from "../types/types";

interface ModalCadastroAtendenteProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id?: number;
}

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
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (show && id) {
      setLoading(true);
      axios
        .get<Usuario>(`${API_URL}/usuarios/${id}`)
        .then((response) => setNome(response.data.nome))
        .catch(() => setErro("Não foi possível carregar os dados para edição."))
        .finally(() => setLoading(false));
      setSuccess("");
    } else if (show) {
      setNome("");
      setSenha("");
      setConfirmarSenha("");
      setErro("");
      setSuccess("");
    }
  }, [id, show]);

  // Adicione esta função de validação:
function senhaValida(senha: string) {
  return senha.length >= 6 && /[a-zA-Z]/.test(senha);
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSuccess("");
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
      if (id) {
        await axios.put(`${API_URL}/usuarios/${id}`, payload);
        setSuccess(""); // Não mostra mensagem de cadastro ao atualizar
      } else {
        await axios.post(`${API_URL}/usuarios`, payload);
        setSuccess("Atendente cadastrado com sucesso!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErro(err.response.data.error);
      } else {
        setErro("Erro ao salvar atendente. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.3)" }}>
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
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {id ? "Editar Atendente" : "Cadastrar Novo Atendente"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ borderTop: "2px solid #ceaf76ff", borderBottom: "2px solid #ceaf76ff" }}>
              {erro && <div className="alert alert-danger">{erro}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <div className="mb-3">
                <label className="form-label fw-bold">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o nome do usuário"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <div className="flex-grow-1">
                  <label className="form-label fw-bold">Senha</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Digite a senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm ms-2 mt-4"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Confirmar Senha</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirme a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button
                tipo="submit"
                texto={loading ? "Carregando..." : id ? "Atualizar" : "Cadastrar"}
                cor="primary"
                desabilitado={loading || !nome}
              />
              <Button
                tipo="button"
                texto="Cancelar"
                cor="secondary"
                onClick={onClose}
                desabilitado={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroAtendenteModal;