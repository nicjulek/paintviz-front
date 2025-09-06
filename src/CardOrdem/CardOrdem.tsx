import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Select from 'react-select';
import './cardordem.css';
import Button from '../components/Button/Button';
import { CardOrdemProps } from '../types/types';

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

interface StatusOption {
    value: string;
    label: string;
}

const statusToBootstrap: Record<string, string> = {
  'Em produção': 'primary',
  'Pendente': 'warning',
  'Finalizado': 'success',
  'Cancelado': 'danger',
  'Pré-ordem': 'info',
};

const CardOrdem: React.FC<CardOrdemProps & { onOrdemUpdate: () => void }> = ({
  idordem,
  status,
  nome,
  entrega,
  imgpintura,
  onOrdemUpdate // Função vinda da Galeria para recarregar a lista
}) => {
  const [modalAberto, setModalAberto] = useState<'prioridade' | 'status' | null>(null);
  
  // Estados para os valores dentro dos modais
  const [novaDataProgramada, setNovaDataProgramada] = useState('');
  const [novoStatusId, setNovoStatusId] = useState('');
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  // Busca as opções de status quando o modal de status for aberto
  useEffect(() => {
    if (modalAberto === 'status') {
      axios.get('http://localhost:3000/status').then(response => {
        const options = response.data.map((s: any) => ({ value: s.id_status, label: s.descricao }));
        setStatusOptions(options);
      });
    }
  }, [modalAberto]);

  const handleAlterarPrioridade = async () => {
    if (!novaDataProgramada) {
      alert("Por favor, selecione uma data.");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/ordens-servico/${idordem}`, {
        data_programada: novaDataProgramada
      });
      alert('Prioridade atualizada com sucesso!');
      onOrdemUpdate(); // Chama a função da Galeria para recarregar os dados
      setModalAberto(null); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar prioridade:", error);
      alert("Falha ao atualizar a prioridade.");
    }
  };

  const handleAlterarStatus = async () => {
    if (!novoStatusId) {
      alert("Por favor, selecione um status.");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/ordens-servico/${idordem}`, {
        id_status: novoStatusId
      });
      alert('Status atualizado com sucesso!');
      onOrdemUpdate(); // Chama a função da Galeria para recarregar os dados
      setModalAberto(null); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Falha ao atualizar o status.");
    }
  };

  const corBadge = statusToBootstrap[status] || 'secondary';  

  const formatarData = (data: string | null) => {
    if (!data) return 'Não definida'; 
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="ordem-card shadow-sm mb-4 rounded bg-white">
      <div className="ordem-topo d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 ordem-titulo">
          <i className="bi bi-file-earmark-text me-2"></i>
          Ordem de Serviço ID: {idordem}
        </h5>
        <span className={`badge rounded-pill text-bg-${corBadge}`}>
          {status}
        </span>
      </div>

      <div className="ordem-corpo d-flex justify-content-between align-items-start mb-3 flex-wrap">
        <div className="d-flex flex-column gap-1 ordem-infos">
          <span><strong>Nome:</strong> {nome}</span>
          <span><strong>Entrega programada:</strong> {formatarData(entrega)}</span>
        </div>
        <div
          className="img-thumbnail ordem-img" 
          dangerouslySetInnerHTML={{ __html: imgpintura }}
        />
      </div>   

      <div className=" card-botoes ">
        <Button
          tipo="button"
          texto="Alterar Prioridade"
          onClick={() => setModalAberto('prioridade')}
          icone={<i className="bi bi-list"></i>}
          cor="primary"
        />
        <Button
          tipo="button"
          texto="Alterar Status"
          onClick={() => setModalAberto('status')}
          icone={<i className="bi bi-clock"></i>}
          cor="primary"
        />
      </div>
      {/* --- MODAIS --- */}

      {/* Modal de Alterar Prioridade (Data Programada) */}
      <Modal
        isOpen={modalAberto === 'prioridade'}
        onRequestClose={() => setModalAberto(null)}
        style={customModalStyles}
        contentLabel="Alterar Prioridade"
      >
        <h2>Alterar Data Programada</h2>
        <p>Ordem de Serviço ID: {idordem}</p>
        <div className="form-group">
          <label>Nova Data Programada:</label>
          <input
            type="date"
            className="form-control"
            value={novaDataProgramada}
            onChange={(e) => setNovaDataProgramada(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button texto="Cancelar" cor="secondary" onClick={() => setModalAberto(null)} />
          <Button texto="Salvar" cor="success" onClick={handleAlterarPrioridade} />
        </div>
      </Modal>

      {/* Modal de Alterar Status */}
      <Modal
        isOpen={modalAberto === 'status'}
        onRequestClose={() => setModalAberto(null)}
        style={customModalStyles}
        contentLabel="Alterar Status"
      >
        <h2>Alterar Status</h2>
        <p>Ordem de Serviço ID: {idordem}</p>
        <div className="form-group">
          <label>Novo Status:</label>
          <Select
            options={statusOptions}
            onChange={(option) => setNovoStatusId(option ? option.value : '')}
            placeholder="Selecione..."
          />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button texto="Cancelar" cor="secondary" onClick={() => setModalAberto(null)} />
          <Button texto="Salvar" cor="success" onClick={handleAlterarStatus} />
        </div>
      </Modal>
    </div>
  );
};

export default CardOrdem;
