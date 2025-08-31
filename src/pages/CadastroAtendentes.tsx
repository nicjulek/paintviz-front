import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button/Button";

const CadastroAtendentes: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); 
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const buscarAtendente = async () => {
        setLoading(true);
        try {
          const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";
          const response = await axios.get(`${API_URL}/usuarios/${id}`);
          setUsuario(response.data.name); 
        } catch (error) {
          console.error("Erro ao buscar dados do atendente:", error);
          setError("Não foi possível carregar os dados para edição.");
        } finally {
          setLoading(false);
        }
      };
      buscarAtendente();
    }
  }, [id]);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

      if (id) {
        await axios.put(`${API_URL}/usuarios/${id}`, { nome: usuario, senha });
        setSuccess("Usuário atualizado com sucesso!");
      } else {
        await axios.post(`${API_URL}/usuarios`, { nome: usuario, senha });
        setSuccess("Usuário cadastrado com sucesso!");
      }

      setUsuario("");
      setSenha("");
      setConfirmarSenha("");

    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.details) {
        setError(error.response.data.details.join(", "));
      } else {
        setError("Erro ao conectar com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => navigate(-1);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ backgroundColor: "#D5C0A0" }}>
        <h3 className="fw-bold mb-3">{id ? "Editar Usuário" : "Cadastrar Novo Usuário"}</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleCadastro}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nome</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome do usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Confirmar Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirme a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            tipo="submit"
            texto={loading ? "Carregando..." : id ? "Atualizar" : "Cadastrar"}
            cor="primary"
            tamanho="lg"
            className="w-100 fw-bold mb-2"
            desabilitado={loading || !usuario || !senha || !confirmarSenha}
          />

          <Button
            tipo="button"
            texto="Voltar"
            cor="secondary"
            className="w-100 fw-bold"
            onClick={handleVoltar}
            desabilitado={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default CadastroAtendentes;