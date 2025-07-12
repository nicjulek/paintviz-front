import React, { useState } from "react";
import "./formulariocliente.css";
import InputGenerico from "../InputGenerico/InputGenerico";

const FormularioCliente: React.FC = () => {
  const [formData, setFormData] = useState({
    opcao: "",
    nome: "",
    razaoSocial: "",
    documento: "",
    telefone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cliente cadastrado: ", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h4 className="mb-3">Cadastro de Cliente</h4>

      <div className="mb-3" id="grupo-tipo-cliente">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="opcao"
            value="Físico"
            checked={formData.opcao === "Físico"}
            onChange={handleChange}
            required
            id="radio-pessoa-fisica"
          />
          <label className="form-check-label" htmlFor="radio-pessoa-fisica">
            Físico
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="opcao"
            value="Jurídico"
            checked={formData.opcao === "Jurídico"}
            onChange={handleChange}
            required
            id="radio-pessoa-juridica"
          />
          <label className="form-check-label" htmlFor="radio-pessoa-juridica">
            Jurídico
          </label>
        </div>
      </div>

      <InputGenerico
        titulo="Nome"
        placeholder="Nome Completo"
        valor={formData.nome}
        onChange={(valor) => setFormData(prev => ({ ...prev, nome: valor }))}
      />

      {formData.opcao === "Jurídico" && (
        <InputGenerico
          titulo="Razão Social"
          placeholder="Razão Social Completa"
          valor={formData.razaoSocial}
          onChange={(valor) => setFormData(prev => ({ ...prev, razaoSocial: valor }))}
        />
      )}

      <div className="mb-3" id="grupo-telefone-email">
        <div className="w-100" id="grupo-documento">
          <InputGenerico
            titulo={formData.opcao === "Jurídico" ? "CNPJ" : "CPF"}
            placeholder={formData.opcao === "Jurídico" ? "00.000.000/0000-00" : "000.000.000-00"}
            valor={formData.documento}
            onChange={(valor) => setFormData(prev => ({ ...prev, documento: valor }))}
          />
        </div>

        <div className="w-100" id="grupo-telefone">
          <InputGenerico
            titulo="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            valor={formData.telefone}
            onChange={(valor) => setFormData(prev => ({ ...prev, telefone: valor }))}
            type="tel"
          />
        </div>
      </div>

      <InputGenerico
        titulo="E-mail"
        type="email"
        placeholder="exemplo@dominio.com"
        valor={formData.email}
        onChange={(valor) => setFormData(prev => ({ ...prev, email: valor }))}
      />

      <div className="botoes-form">
        <button type="button" className="btn-voltar">
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
        <button type="submit" className="btn-salvar">
          <i className="bi bi-save"></i> Salvar
        </button>
      </div>
    </form>
  );
};

export default FormularioCliente;
