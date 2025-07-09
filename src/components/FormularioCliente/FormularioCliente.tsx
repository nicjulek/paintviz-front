import React, { useState } from "react";

const FormularioCliente: React.FC = () => {
  const [formData, setFormData] = useState({
    opcao: "",
    nome: "",
    razao: "",
    cpf: "",
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
      <h4 className="mb-3">Cadastro de cliente</h4>

      <div className="mb-3">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="fisico"
            value="Físico"
            checked={formData.opcao === "Físico"}
            onChange={handleChange}
            required
            id="fisico"
          />
          <label className="form-check-label" htmlFor="fisico">
            Físico
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="juridico"
            value="Jurídico"
            checked={formData.opcao === "Jurídico"}
            onChange={handleChange}
            required
            id="juridico"
          />
          <label className="form-check-label" htmlFor="juridico">
            Jurídico
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome</label>
        <input
          type="text"
          className="form-control"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>

      {formData.opcao === "Jurídico" && (
      <div className="mb-3">
        <label htmlFor="razao" className="form-label">Razão Social</label>
        <input
          type="text"
          className="form-control"
          id="razao"
          name="razao"
          value={formData.razao}
          onChange={handleChange}
          required
        />
      </div>
    )}

      <div className="mb-3">
      <label htmlFor="cpf" className="form-label">
        {formData.opcao === "Jurídico" ? "CNPJ" : "CPF"}
      </label>
      <input
        type="text"
        className="form-control"
        id="cpf"
        name="cpf"
        value={formData.cpf}
        onChange={handleChange}
        required
      />
    </div>


      <div className="mb-3">
        <label htmlFor="telefone" className="form-label">Telefone (número)</label>
        <input
          type="number"
          className="form-control"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="campo5" className="form-label">E-mail</label>
        <input
          type="text"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

    </form>
  );
};

export default FormularioCliente;
