import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button/Button";
import { Usuario } from "../types/types";

const CadastroAtendentes: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

  useEffect(() => {
    if (id) {
      const buscarAtendente = async () => {
        setLoading(true);
        try {
          const response = await axios.get<Usuario>(`${API_URL}/usuarios/${id}`);
          setNome(response.data.nome);
        } catch (error) {
          console.error("Erro ao buscar dados do atendente:", error);
          setErro("Não foi possível carregar os dados para edição.");
        } finally {
          setLoading(false);
        }
      };
      buscarAtendente();
    }
  }, [id, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSuccess("");
    setLoading(true);

    if (!id) {
      if (!senha) {
        setErro("A senha é obrigatória para novos usuários.");
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
    if (!id || senha) {
      payload.senha = senha;
    }

    try {
      if (id) {
        await axios.put(`${API_URL}/usuarios/${id}`, payload);
        setSuccess("Atendente atualizado com sucesso!");
      } else {
        await axios.post(`${API_URL}/usuarios`, payload);
        setSuccess("Atendente cadastrado com sucesso!");
      }
      navigate("/gestaoatendentes");
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

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4"
        style={{ backgroundColor: "var(--paintviz-accent)" }}
      >
        <h3
          className="fw-bold mb-3"
          style={{ color: "var(--paintviz-text)" }}
        >
          {id ? "Editar Atendente" : "Cadastrar Novo Atendente"}
        </h3>

        {erro && <div className="alert alert-danger">{erro}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
              onClick={toggleShowPassword}
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

          <Button
          tipo="submit"
          texto={loading ? "Carregando..." : id ? "Atualizar" : "Cadastrar"}
          icone={
            loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : undefined
          }
          cor="primary"
          tamanho="lg"
          className="w-100 fw-bold mb-2"
          desabilitado={loading || !nome}
        />

          <Button
            tipo="button"
            texto="Voltar"
            cor="secondary"
            className="w-100 fw-bold"
            onClick={() => navigate("/gestaoatendentes")}
            desabilitado={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default CadastroAtendentes;
