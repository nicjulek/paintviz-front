import React, { useState } from "react";
import "./formularioordem.css";
import InputGenerico from "../InputGenerico/InputGenerico";
import Button from "../Button/Button";

const FormularioOrdem: React.FC = () => {
  const [formData, setFormData] = useState({
      cliente: "",
      usuario: "",
      status: "",
      modelo: "",
      placa: "",
      identificacao: "",
      data1: "",
      data2: "",
      data3:""
    });
  

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da ordem:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h4 className="mb-3">Cadastro de Ordem de Serviço</h4>


      <div className="d-flex align-items-center gap-3">  
      <div className="flex-grow-1">     
      <InputGenerico
        titulo="Cliente"
        placeholder="Nome do Cliente"
        valor={formData.cliente}
        onChange={(valor) => setFormData(prev => ({ ...prev, cliente: valor }))}
      />
      </div>
      <div className="align-self-end">
      <Button
        tipo="button"
        texto="Cadastrar Cliente"
        cor="secondary"
        onClick={() => console.log('Voltar')}
      />
      </div>
      </div> 

      <InputGenerico
        titulo="Usuário"
        placeholder="Usuário Responsável"
        valor={formData.usuario}
        onChange={(valor) => setFormData(prev => ({ ...prev, nome: valor }))}
      />

      <div className="mb-3" id="grupo-status">
      <label htmlFor="input-status" className="form-label">Status:</label>
      <select
        className="form-control"
        id="input-status"
        name="status"
        value={formData.status || ""}
        onChange={handleChange}
        required
      >
        <option value="">Selecione o status</option>
        <option value="pre_ordem">Pré-ordem</option>
        <option value="em_producao">Em Produção</option>
        <option value="finalizado">Finalizado</option>
      </select>
    </div>

    <InputGenerico
        titulo="Modelo"
        placeholder="EX: Scania R450"
        valor={formData.modelo}
        onChange={(valor) => setFormData(prev => ({ ...prev, modelo: valor }))}
      />

      <InputGenerico
        titulo="Placa do Veículo"
        placeholder="Ex: ABC123"
        valor={formData.placa}
        onChange={(valor) => setFormData(prev => ({ ...prev, placa: valor }))}
      />

      <InputGenerico
        titulo="Identificação do Veículo"
        placeholder="Ex: XYZ789012345"
        valor={formData.identificacao}
        onChange={(valor) => setFormData(prev => ({ ...prev, identificacao: valor }))}
      />

      <InputGenerico
        titulo="Data de Emissão"
        placeholder="dd/mm/aa"
        valor={formData.data1}
        onChange={(valor) => setFormData(prev => ({ ...prev, data1: valor }))}
      />

      <InputGenerico
        titulo="Data de Entrega"
        placeholder="dd/mm/aa"
        valor={formData.data2}
        onChange={(valor) => setFormData(prev => ({ ...prev, data2: valor }))}
      />

      <InputGenerico
        titulo="Data Programada"
        placeholder="dd/mm/aa"
        valor={formData.data3}
        onChange={(valor) => setFormData(prev => ({ ...prev, data3: valor }))}
      />

      <div className="d-flex justify-content-end gap-3 mt-4">
      <Button
        tipo="button"
        texto="Voltar"
        icone={<i className="bi bi-arrow-left"></i>}
        cor="secondary"
        onClick={() => console.log('Voltar')}
      />
      <Button
        tipo="submit"
        texto="Salvar"
        icone={<i className="bi bi-save"></i>}
        cor="success"
      />
</div>
    </form>
  );
};

export default FormularioOrdem;
