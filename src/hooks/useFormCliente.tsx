import { useState, useEffect } from "react";
import axios from "axios";
import { Cliente, UseFormClienteProps } from "../types/types";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

// Funções de formatação
const formatarCPF = (cpf: string): string => {
  const apenasNumeros = cpf.replace(/\D/g, "");
  if (apenasNumeros.length <= 11) {
    return apenasNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return cpf;
};

const formatarCNPJ = (cnpj: string): string => {
  const apenasNumeros = cnpj.replace(/\D/g, "");
  if (apenasNumeros.length <= 14) {
    return apenasNumeros
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  return cnpj;
};

const formatarTelefone = (telefone: string): string => {
  const apenasNumeros = telefone.replace(/\D/g, "");
  if (apenasNumeros.length <= 11) {
    if (apenasNumeros.length <= 10) {
      return apenasNumeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    } else {
      return apenasNumeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }
  }
  return telefone;
};

export const useFormCliente = ({ cliente, isEditing = false, show }: UseFormClienteProps) => {
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

  useEffect(() => {
    if (cliente && isEditing) {
      if (cliente.pessoa_fisica) {
        setTipo("fisico");
        setForm({
          nome: cliente.pessoa_fisica.nome || "",
          razao_social: "",
          cnpj: "",
          cpf: cliente.pessoa_fisica.cpf || "",
          telefone: cliente.celular || "",
          email: cliente.email || ""
        });
      } else if (cliente.pessoa_juridica) {
        setTipo("juridico");
        setForm({
          nome: cliente.pessoa_juridica.empresa || "",
          razao_social: cliente.pessoa_juridica.razao_social || "",
          cnpj: cliente.pessoa_juridica.cnpj || "",
          cpf: "",
          telefone: cliente.celular || "",
          email: cliente.email || ""
        });
      }
    } else {
      setForm({
        nome: "",
        razao_social: "",
        cnpj: "",
        cpf: "",
        telefone: "",
        email: ""
      });
      setTipo("fisico");
    }
    setError(""); 
  }, [cliente, isEditing, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação em tempo real
    if (name === "cpf") {
      formattedValue = formatarCPF(value);
    } else if (name === "cnpj") {
      formattedValue = formatarCNPJ(value);
    } else if (name === "telefone") {
      formattedValue = formatarTelefone(value);
    }

    setForm(prev => ({ ...prev, [name]: formattedValue }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSuccess: () => void
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      let payload: Partial<Cliente> = {
        celular: form.telefone.replace(/\D/g, ""), 
        email: form.email
      };

      if (tipo === "fisico") {
        payload.pessoa_fisica = {
          id_cliente: cliente?.id_cliente || 0, 
          nome: form.nome,
          cpf: form.cpf.replace(/\D/g, "") 
        };
      } else {
        payload.pessoa_juridica = {
          id_cliente: cliente?.id_cliente || 0, 
          empresa: form.nome,
          razao_social: form.razao_social,
          cnpj: form.cnpj.replace(/\D/g, "") 
        };
      }

      if (isEditing && cliente?.id_cliente) {
        await axios.put(`${API_URL}/clientes/${cliente.id_cliente}`, payload);
      } else {
        await axios.post(`${API_URL}/clientes`, payload);
      }

      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} cliente.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    tipo,
    setTipo,
    form,
    loading,
    error,
    handleChange,
    handleSubmit
  };
};