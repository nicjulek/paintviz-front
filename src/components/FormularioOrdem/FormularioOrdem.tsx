import React, { useState } from 'react';
import './formularioordem.css';

//FORMULARIO GENÉRICO PARA TESTE

type FormularioOrdemProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onSubmit?: (valor: string) => void;
};

const FormularioOrdem: React.FC<FormularioOrdemProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  onSubmit,
}) => {
  const [valor, setValor] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(valor);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-3">
        <label htmlFor={name} className="form-label">{label}</label>
        <input
          type={type}
          id={name}
          name={name}
          className="form-control"
          placeholder={placeholder}
          value={valor}
          onChange={handleChange}
          required={required}
        />
      </div>
      <button type="submit" className="btn btn-primary">Enviar</button>
    </form>
  );
};

export default FormularioOrdem;