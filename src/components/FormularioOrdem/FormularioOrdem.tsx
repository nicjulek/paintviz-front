import React, { useState, useMemo } from "react";
import FormularioCliente from "../FormularioCliente/FormularioCliente";
import AvisoModal, { useAvisoModal } from "../../modals/AvisoModal";
import { Tooltip } from "../Tooltip";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormOrdem } from "../../hooks/useFormOrdem";

const FormularioOrdem: React.FC = () => {
  const {
    clientes,
    showModal,
    setShowModal,
    statusList,
    form,
    loading,
    error,
    bloqueado,
    handleChange,
    handleVoltar,
    handleSubmit: originalHandleSubmit,
    fetchData,
    isPreOrdem,
    isEdicao,
    usuarioLogado
  } = useFormOrdem();

  // Hook do AvisoModal
  const { modalProps, mostrarSucesso, mostrarErro } = useAvisoModal();

  //dropdown
  const [pesquisaCliente, setPesquisaCliente] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [pesquisaStatus, setPesquisaStatus] = useState("");
  const [showDropdownStatus, setShowDropdownStatus] = useState(false);

  const hoje = new Date().toISOString().split('T')[0];

  // Wrapper do handleSubmit para mostrar modal de sucesso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await originalHandleSubmit(e);
      
      // Se chegou até aqui, a operação foi bem-sucedida
      const tipoOperacao = isEdicao ? 'atualizada' : 'criada';
      mostrarSucesso(
        'Sucesso!', 
        `Ordem de serviço ${tipoOperacao} com sucesso!`
      );
      
    } catch (error) {
      // Se houver erro, mostra modal de erro
      mostrarErro(
        'Erro!', 
        'Ocorreu um erro ao salvar a ordem de serviço. Tente novamente.'
      );
    }
  };

  // Filtra e ordena clientes alfabeticamente
  const clientesFiltrados = useMemo(() => {
    const clientesOrdenados = clientes
      .map(c => ({
        ...c,
        nomeDisplay: c.pessoa_fisica ? c.pessoa_fisica.nome : c.pessoa_juridica?.empresa || 'Cliente sem nome'
      }))
      .sort((a, b) => a.nomeDisplay.localeCompare(b.nomeDisplay));

    if (!pesquisaCliente) return clientesOrdenados;

    return clientesOrdenados.filter(c => 
      c.nomeDisplay.toLowerCase().includes(pesquisaCliente.toLowerCase())
    );
  }, [clientes, pesquisaCliente]);

  // filtra e ordena status alfabeticamente
  // remove status que não podem ser selecionados ao criar uma nova ordem
  const statusFiltrados = useMemo(() => {
    let statusDisponivel = statusList;

    // se não é edição, filtra status que não podem ser criados
    if (!isEdicao) {
      // assume-se que os IDs dos status são:
      // 3 = Em produção, 4 = Finalizada, 5 = Cancelada
      const statusProibidos = ['3', '4', '5']; // ids dos status proibidos para criação
      statusDisponivel = statusList.filter(s => 
        !statusProibidos.includes(String(s.id_status))
      );
    }

    const statusOrdenados = statusDisponivel
      .map(s => ({
        ...s,
        nomeDisplay: s.descricao || s.nome_status || 'Status sem nome'
      }))
      .sort((a, b) => a.nomeDisplay.localeCompare(b.nomeDisplay));

    if (!pesquisaStatus) return statusOrdenados;

    return statusOrdenados.filter(s => 
      s.nomeDisplay.toLowerCase().includes(pesquisaStatus.toLowerCase())
    );
  }, [statusList, pesquisaStatus, isEdicao]);

  const handleClienteSelect = (cliente: any) => {
    handleChange({ target: { name: 'id_cliente', value: cliente.id_cliente } } as any);
    setPesquisaCliente(cliente.nomeDisplay);
    setShowDropdown(false);
  };

  const handleStatusSelect = (status: any) => {
    handleChange({ target: { name: 'status', value: status.id_status } } as any);
    setPesquisaStatus(status.nomeDisplay);
    setShowDropdownStatus(false);
  };

  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisaCliente(e.target.value);
    setShowDropdown(true);
    // Limpa seleção se o usuário está digitando
    if (form.id_cliente) {
      handleChange({ target: { name: 'id_cliente', value: '' } } as any);
    }
  };

  const handlePesquisaStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPesquisaStatus(e.target.value);
    setShowDropdownStatus(true);
    // Limpa seleção se o usuário está digitando
    if (form.status) {
      handleChange({ target: { name: 'status', value: '' } } as any);
    }
  };

  console.log("Acesso bloqueado?", bloqueado, "| Edição?", isEdicao);
  //bloqueia cadastro se nenhum pintura existe (menos em edição)
  if (bloqueado && !isEdicao) {
    return (
      <div className="container py-4">
        <div className="bg-paintviz-accent p-4 rounded shadow text-center">
          <h2 className="mb-4">Cadastro de Ordem de Serviço</h2>
          <div className="alert alert-warning">
            Para cadastrar uma ordem de serviço, primeiro crie e salve uma pintura.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Tooltip helpText="Formulário para criar uma nova ordem de serviço com base na pintura salva anteriormente.">
        <h2 className="mb-4 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
          <i className="bi bi-truck me-2"></i>
          Cadastro de Ordem de Serviço
        </h2>
      </Tooltip>
      
      <form
        className="p-4 shadow"
        style={{
          background: '#D5C0A0',
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
          border: "1px solid #fff",
          borderRadius: "24px"
        }}
        onSubmit={handleSubmit}
      >

        <div className="row mb-3">
          <div className="col-md-8">
            <Tooltip helpText="Selecione o cliente responsável por esta ordem. Digite para buscar ou clique na seta para ver todos os clientes cadastrados.">
              <label className="form-label">Cliente: <span className="text-danger">*</span></label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Selecione o nome do cliente"
                  value={pesquisaCliente}
                  onChange={handlePesquisaChange}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={(e) => {
                    // delay para permitir clique no dropdown
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <i 
                  className="bi bi-chevron-down position-absolute"
                  style={{
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#6c757d'
                  }}
                ></i>
                {showDropdown && clientesFiltrados.length > 0 && (
                  <div 
                    className="position-absolute w-100 bg-white border rounded shadow-lg"
                    style={{ 
                      top: '100%', 
                      zIndex: 1000, 
                      maxHeight: '200px', 
                      overflowY: 'auto' 
                    }}
                  >
                    {clientesFiltrados.map(cliente => (
                      <div
                        key={cliente.id_cliente}
                        className="p-2 border-bottom cursor-pointer hover-bg-light"
                        style={{ cursor: 'pointer' }}
                        onMouseDown={(e) => e.preventDefault()} // evita perder foco do input
                        onClick={() => handleClienteSelect(cliente)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {cliente.nomeDisplay}
                      </div>
                    ))}
                  </div>
                )}
                {showDropdown && pesquisaCliente && clientesFiltrados.length === 0 && (
                  <div 
                    className="position-absolute w-100 bg-white border rounded shadow-lg p-2"
                    style={{ top: '100%', zIndex: 1000 }}
                  >
                    <div className="text-muted">Nenhum cliente encontrado</div>
                  </div>
                )}
              </div>
            </Tooltip>
          </div>
          <div className="col-md-4">
            <Tooltip helpText="Clique aqui para cadastrar um novo cliente caso não encontre na lista.">
              <label className="form-label">&nbsp;</label>
              <button
                type="button"
                className="btn btn-primary w-100 d-block"
                onClick={() => setShowModal(true)}
                style={{
                  padding: "8px 16px",
                  fontWeight: "600",
                  borderRadius: "6px",
                  height: "38px"
                }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Cadastrar Cliente
              </button>
            </Tooltip>
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <Tooltip helpText="Usuário responsável por criar esta ordem. Este campo é preenchido automaticamente com seu login.">
              <label className="form-label">Usuário: <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                value={usuarioLogado?.nome || 'Usuário não encontrado'}
                disabled
                readOnly
              />
            </Tooltip>
          </div>
          <div className="col-md-6">
            <Tooltip helpText="Status atual da ordem. Para novas ordens, selecione 'Aguardando' ou 'Pré-Ordem'. Status como 'Finalizada' só podem ser selecionados na edição.">
              <label className="form-label">Status: <span className="text-danger">*</span></label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Selecione o status"
                  value={pesquisaStatus}
                  onChange={handlePesquisaStatusChange}
                  onFocus={() => setShowDropdownStatus(true)}
                  onBlur={(e) => {
                    setTimeout(() => setShowDropdownStatus(false), 200);
                  }}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <i 
                  className="bi bi-chevron-down position-absolute"
                  style={{
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#6c757d'
                  }}
                ></i>
                {showDropdownStatus && statusFiltrados.length > 0 && (
                  <div 
                    className="position-absolute w-100 bg-white border rounded shadow-lg"
                    style={{ 
                      top: '100%', 
                      zIndex: 1000, 
                      maxHeight: '200px', 
                      overflowY: 'auto' 
                    }}
                  >
                    {statusFiltrados.map(status => (
                      <div
                        key={status.id_status}
                        className="p-2 border-bottom cursor-pointer hover-bg-light"
                        style={{ cursor: 'pointer' }}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleStatusSelect(status)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {status.nomeDisplay}
                      </div>
                    ))}
                  </div>
                )}
                {showDropdownStatus && pesquisaStatus && statusFiltrados.length === 0 && (
                  <div 
                    className="position-absolute w-100 bg-white border rounded shadow-lg p-2"
                    style={{ top: '100%', zIndex: 1000 }}
                  >
                    <div className="text-muted">Nenhum status encontrado</div>
                  </div>
                )}
              </div>
            </Tooltip>
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-4">
            <Tooltip helpText="Digite o modelo completo do veículo. Ex: Scania R450, Volvo FH460, Mercedes Actros 2651.">
              <label className="form-label">Modelo do Veículo: <span className="text-danger">*</span></label>
              <input
                className="form-control"
                name="modelo_veiculo"
                value={form.modelo_veiculo}
                onChange={handleChange}
                required
                placeholder="Ex: Scania R450"
              />
            </Tooltip>
          </div>
          <div className="col-md-4">
            <Tooltip helpText="Digite a placa do veículo no formato brasileiro. Ex: ABC1234 ou ABC1D23 (Mercosul).">
              <label className="form-label">Placa do Veículo: <span className="text-danger">*</span></label>
              <input
                className="form-control"
                name="placa_veiculo"
                value={form.placa_veiculo}
                onChange={handleChange}
                required={!isPreOrdem}
                placeholder="Ex: ABC1234"
              />
            </Tooltip>
          </div>
          <div className="col-md-4">
            <Tooltip helpText="Número de identificação único do veículo (chassi). Ex: 9BD12345678901234. Importante para rastreabilidade.">
              <label className="form-label">Identificação do Veículo: <span className="text-danger">*</span></label>
              <input
                className="form-control"
                name="identificacao_veiculo"
                value={form.identificacao_veiculo}
                onChange={handleChange}
                required={!isPreOrdem}
                placeholder="Ex: XYZ789012345"
              />
            </Tooltip>
          </div>
        </div>
        
        {!isPreOrdem && (
          <div className="row mb-3">
            <div className="col-md-4">
              <Tooltip helpText="Data em que a ordem de serviço foi oficialmente criada e emitida para o cliente.">
                <label className="form-label">Data de Emissão:</label>
                <input
                  type="date"
                  className="form-control"
                  name="data_emissao"
                  value={form.data_emissao}
                  onChange={handleChange}
                  min={hoje}
                  required
                />
              </Tooltip>
            </div>
            <div className="col-md-4">
              <Tooltip helpText="Data prevista para entregar o veículo pintado ao cliente. Deve ser posterior à data de emissão.">
                <label className="form-label">Data de Entrega:</label>
                <input
                  type="date"
                  className="form-control"
                  name="data_entrega"
                  value={form.data_entrega}
                  onChange={handleChange}
                  min={hoje}
                  required
                />
              </Tooltip>
            </div>
            <div className="col-md-4">
              <Tooltip helpText="Data programada para iniciar o processo de pintura. Usado para planejamento da produção.">
                <label className="form-label">Data Programada:</label>
                <input
                  type="date"
                  className="form-control"
                  name="data_programada"
                  value={form.data_programada}
                  onChange={handleChange}
                  min={hoje}
                  required
                />
              </Tooltip>
            </div>
          </div>
        )}
        
        {String(form.status) === "3" && (
          <div className="row mb-3">
            <div className="col-md-4">
              <Tooltip helpText="Número do box/cabine onde o veículo será pintado. Necessário apenas para ordens em produção.">
                <label className="form-label">Número do Box:</label>
                <input
                  className="form-control"
                  name="numero_box"
                  value={form.numero_box}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Box 01, Cabine A"
                />
              </Tooltip>
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-end gap-2">
          <Tooltip helpText="Cancelar o cadastro e voltar para a tela anterior sem salvar as alterações.">
            <button type="button" className="btn btn-secondary" onClick={handleVoltar}
              style={{
                background: "#93908cff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "10px 20px"
              }}>
              <i className="bi bi-x-circle me-2"></i> Voltar
            </button>
          </Tooltip>
          
          <Tooltip helpText={isEdicao ? "Salvar as alterações feitas na ordem de serviço." : "Criar uma nova ordem de serviço com os dados informados."}>
            <button type="submit" className="btn btn-success" disabled={loading} style={{
              background: loading ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              padding: "10px 20px",
              boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
            }}>
              <i className="bi bi-check-circle me-2"></i> {loading ? "Salvando..." : "Salvar"}
            </button>
          </Tooltip>
        </div>
        
        {error && (
          <Tooltip helpText="Erro ocorrido durante o processamento. Verifique os dados e tente novamente.">
            <div className="alert alert-danger mt-3">{error}</div>
          </Tooltip>
        )}
      </form>
      
      <FormularioCliente
        show={showModal}
        onClose={() => setShowModal(false)}
        onClienteCadastrado={fetchData}
      />
      
      {/* Modal de Aviso */}
      <AvisoModal {...modalProps} />
    </div>
  );
};

export default FormularioOrdem;