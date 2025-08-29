import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import InputGenerico from "../InputGenerico/InputGenerico";
import Button from "../Button/Button";

interface Cliente {
  id_cliente: number;
  nome: string;
}

interface Status {
  id_status: number;
  descricao: string;
}

interface IOrdemFormData {
  id_cliente: string;
  id_usuario_responsavel: string;
  id_status: string;
  modelo_veiculo: string;
  placa_veiculo: string;
  identificacao_veiculo: string;
  data_emissao: string;
  data_entrega: string;
  data_programada: string;
}

const FormularioOrdem: React.FC<{ idDaOrdemParaEditar?: string | number }> = ({ idDaOrdemParaEditar }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  
  const [formData, setFormData] = useState<IOrdemFormData>({
    id_cliente: "",
    id_usuario_responsavel: "",
    id_status: "",
    modelo_veiculo: "",
    placa_veiculo: "",
    identificacao_veiculo: "",
    data_emissao: "",
    data_entrega: "",
    data_programada: "",
  });

  useEffect(() => {
    const idUsuario = localStorage.getItem("id_usuario");
    if (idUsuario) {
      
      setFormData((prev) => ({ ...prev, id_usuario_responsavel: idUsuario }));
    }
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/clientes");
        setClientes(response.data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/status");
        setStatus(response.data);
      } catch (err) {
        
        console.error("Erro ao buscar status", err);
      }
    };

    fetchStatus();
  }, []);

  //useEffect para buscar os dados da ordem de serviço quando estiver em modo de edição
  useEffect(() => {
    // Só executa se um ID foi passado para o componente
    if (idDaOrdemParaEditar) {
      const fetchOrdemData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/ordens-servico/${idDaOrdemParaEditar}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados da ordem para edição:", error);
          alert("Não foi possível carregar os dados para edição.");
        }
      };
      fetchOrdemData();
    }
  }, [idDaOrdemParaEditar]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (idDaOrdemParaEditar) {
        // Requisição put para atualizar a ordem existente
        await axios.put(`http://localhost:3000/ordens-servico/${idDaOrdemParaEditar}`, formData);
        alert("Ordem atualizada com sucesso!");
      } else {
        // Requisição post para criar uma nova ordem
        await axios.post("http://localhost:3000/ordens-servico", formData);
        alert("Ordem cadastrada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
      alert("Erro ao salvar a ordem.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      {/*Título dinâmico */}
      <h4 className="mb-3">
        {idDaOrdemParaEditar ? 'Edição de Ordem de Serviço' : 'Cadastro de Ordem de Serviço'}
      </h4>

      {/* Seletor de Cliente */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="flex-grow-1">
          <div>
            <label className="block mb-1">Cliente</label>
            <Select
              options={clientes.map((c) => ({
                value: c.id_cliente,
                label: c.nome,
              }))}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  
                  id_cliente: opt ? String(opt.value) : "",
                }))
              }
              placeholder="Selecione um cliente..."
              isSearchable
            />
          </div>
        </div>
        <div className="align-self-end">
          <Button
            tipo="button"
            texto="Cadastrar Cliente"
            cor="secondary"
            onClick={() => console.log("Cadastrar cliente")}
          />
        </div>
      </div>

      {/* Seletor de Status */}
      <div className="flex-grow-1 mb-3">
        <div>
          <label className="block mb-1">Status</label>
          <Select
            options={status.map((s) => ({
              value: s.id_status,
              label: s.descricao,
            }))}
            onChange={(opt) =>
              setFormData((prev) => ({
                ...prev,
               
                id_status: opt ? String(opt.value) : "",
              }))
            }
            placeholder="Selecione um status..."
            isSearchable
          />
        </div>
      </div>
      

      {/* Inputs Genéricos */}
      <InputGenerico
        titulo="Modelo do Veículo"
        placeholder="EX: Scania R450"
        valor={formData.modelo_veiculo}
        onChange={(valor) =>
          
          setFormData((prev) => ({ ...prev, modelo_veiculo: valor }))
        }
      />

      <InputGenerico
        titulo="Placa do Veículo"
        placeholder="Ex: ABC123"
        valor={formData.placa_veiculo}
        onChange={(valor) =>
          
          setFormData((prev) => ({ ...prev, placa_veiculo: valor }))
        }
      />

      <InputGenerico
        titulo="Identificação do Veículo"
        placeholder="Ex: XYZ789012345"
        valor={formData.identificacao_veiculo}
        onChange={(valor) =>
          
          setFormData((prev) => ({ ...prev, identificacao_veiculo: valor }))
        }
      />

      <InputGenerico
        titulo="Data de Emissão"
        placeholder="dd/mm/aa"
        valor={formData.data_emissao}
        onChange={(valor) =>
         
          setFormData((prev) => ({ ...prev, data_emissao: valor }))
        }
      />

      <InputGenerico
        titulo="Data de Entrega"
        placeholder="dd/mm/aa"
        valor={formData.data_entrega}
        onChange={(valor) =>
          
          setFormData((prev) => ({ ...prev, data_entrega: valor }))
        }
      />

      <InputGenerico
        titulo="Data Programada"
        placeholder="dd/mm/aa"
        valor={formData.data_programada}
        onChange={(valor) =>
          
          setFormData((prev) => ({ ...prev, data_programada: valor }))
        }
      />

      {/* Botões */}
      <div className="d-flex justify-content-end gap-3 mt-4">
        <Button
          tipo="button"
          texto="Voltar"
          icone={<i className="bi bi-arrow-left"></i>}
          cor="secondary"
          onClick={() => console.log("Voltar")}
        />
        <Button
          tipo="submit"
          // Texto do botão dinâmico
          texto={idDaOrdemParaEditar ? 'Atualizar' : 'Salvar'}
          icone={<i className="bi bi-save"></i>}
          cor="success"
        />
      </div>
    </form>
  );
};

export default FormularioOrdem;