import React from "react";
import { StatusModalProps } from "../types/types";
import AvisoModal, { useAvisoModal } from "../modals/AvisoModal";

const StatusModal: React.FC<StatusModalProps> = ({
  show,
  statusList,
  value,
  statusAtual,
  dataEmissao,
  dataProgramada,
  dataEntrega,
  onDataEmissaoChange,
  onDataProgramadaChange,
  onDataEntregaChange,
  numeroBox,
  onNumeroBoxChange,
  onChange,
  onClose,
  onConfirm,
  loading
}) => {
  // Hook do AvisoModal
  const { modalProps, mostrarModal } = useAvisoModal();

  if (!show) return null;

  // Se a ordem está em pré-ordem antes da alteração, peça as datas
  const pedirDatas = statusAtual === 1 && value !== 1;

  // Obter data atual no formato YYYY-MM-DD
  const hoje = new Date().toISOString().split('T')[0];

  // Função para verificar se um status pode ser selecionado
  const podeAlterarParaStatus = (novoStatus: number) => {
    // Status "Cancelada" pode ser selecionado de qualquer status atual
    if (novoStatus === 5) return true;
    
    // Não pode voltar para um status anterior (exceto cancelada)
    if (novoStatus < statusAtual && novoStatus !== 5) return false;
    
    // Pode avançar para próximos status ou manter o atual
    return true;
  };

  // Função para obter a mensagem de erro para status inválido
  const getMensagemErroStatus = (novoStatus: number) => {
    if (novoStatus < statusAtual && novoStatus !== 5) {
      return `Não é possível voltar do status "${statusList.find(s => s.id === statusAtual)?.nome}" para "${statusList.find(s => s.id === novoStatus)?.nome}". O progresso da ordem só pode avançar ou ser cancelado.`;
    }
    return '';
  };

  const handleStatusChange = (novoStatus: number) => {
    if (!podeAlterarParaStatus(novoStatus)) {
      mostrarModal({
        titulo: 'Alteração de Status Inválida',
        mensagem: getMensagemErroStatus(novoStatus),
        mostrarFechar: true,
        mostrarConfirmar: false,
        tipo: 'erro'
      });
      return;
    }
    onChange(novoStatus);
  };

  const handleConfirm = () => {
    // Validações antes de confirmar
    if (pedirDatas && (!dataEmissao || !dataProgramada || !dataEntrega)) {
      mostrarModal({
        titulo: 'Campos Obrigatórios',
        mensagem: 'Preencha todas as datas obrigatórias para prosseguir com a alteração de status.',
        mostrarFechar: true,
        mostrarConfirmar: false,
        tipo: 'erro'
      });
      return;
    }

    if (value === 3 && !numeroBox) {
      mostrarModal({
        titulo: 'Campo Obrigatório',
        mensagem: 'O número do box é obrigatório para ordens em produção.',
        mostrarFechar: true,
        mostrarConfirmar: false,
        tipo: 'erro'
      });
      return;
    }

    // Validar datas não podem ser anteriores ao dia atual
    if (pedirDatas) {
      if (dataEmissao && dataEmissao < hoje) {
        mostrarModal({
          titulo: 'Data Inválida',
          mensagem: 'A data de emissão não pode ser anterior à data atual.',
          mostrarFechar: true,
          mostrarConfirmar: false,
          tipo: 'erro'
        });
        return;
      }

      if (dataProgramada && dataProgramada < hoje) {
        mostrarModal({
          titulo: 'Data Inválida',
          mensagem: 'A data programada não pode ser anterior à data atual.',
          mostrarFechar: true,
          mostrarConfirmar: false,
          tipo: 'erro'
        });
        return;
      }

      if (dataEntrega && dataEntrega < hoje) {
        mostrarModal({
          titulo: 'Data Inválida',
          mensagem: 'A data de entrega não pode ser anterior à data atual.',
          mostrarFechar: true,
          mostrarConfirmar: false,
          tipo: 'erro'
        });
        return;
      }
    }

    onConfirm();
  };

  return (
    <>
      <div 
        className="modal fade show" 
        style={{
          display: 'block',
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050,
          paddingTop: '10vh' // Posiciona o modal acima do centro
        }}
      >
        <div 
          className="modal-dialog"
          style={{
            margin: '0 auto',
            maxWidth: '500px',
            width: '90%'
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#F5E3C6",
              border: "2px solid #D2B896",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
            }}
          >
            <div
              className="modal-header"
              style={{
                borderBottom: "2px solid #D2B896",
                background: "linear-gradient(135deg, #F5E3C6 0%, #E8D4B3 100%)"
              }}
            >
              <h4
                className="modal-title fw-bold"
                style={{ color: "#5A402A" }}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Alterar Status
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
                style={{
                  filter: "sepia(1) hue-rotate(20deg) saturate(2) brightness(0.8)"
                }}
              ></button>
            </div>
            <div
              className="modal-body"
              style={{ background: "#F5E3C6" }}
            >
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: "#5A402A" }}>
                  Novo Status:
                </label>
                <select
                  className="form-select"
                  value={value}
                  onChange={e => handleStatusChange(Number(e.target.value))}
                  disabled={loading}
                  style={{
                    border: "2px solid #D2B896",
                    borderRadius: "8px",
                    background: "#FFFFFF",
                    padding: "12px"
                  }}
                >
                  {statusList.map(s => (
                    <option
                      key={s.id}
                      value={s.id}
                      disabled={!podeAlterarParaStatus(s.id)}
                      style={{
                        color: podeAlterarParaStatus(s.id) ? 'inherit' : '#999',
                        fontStyle: podeAlterarParaStatus(s.id) ? 'normal' : 'italic'
                      }}
                    >
                      {s.nome}
                      {!podeAlterarParaStatus(s.id) && s.id !== 5 ? ' (não disponível)' : ''}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted mt-1">
                  <i className="bi bi-info-circle me-1"></i>
                  Status atual: <strong>{statusList.find(s => s.id === statusAtual)?.nome}</strong>
                </small>
              </div>

              {/* Se a ordem está em pré-ordem antes da alteração, peça as datas */}
              {pedirDatas && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "#5A402A" }}>
                      Data de Emissão: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataEmissao || ""}
                      onChange={e => onDataEmissaoChange && onDataEmissaoChange(e.target.value)}
                      disabled={loading}
                      min={hoje}
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF",
                        padding: "12px"
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "#5A402A" }}>
                      Data Programada: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataProgramada || ""}
                      onChange={e => onDataProgramadaChange && onDataProgramadaChange(e.target.value)}
                      disabled={loading}
                      min={hoje}
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF",
                        padding: "12px"
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "#5A402A" }}>
                      Data de Entrega: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataEntrega || ""}
                      onChange={e => onDataEntregaChange && onDataEntregaChange(e.target.value)}
                      disabled={loading}
                      min={hoje}
                      style={{
                        border: "2px solid #D2B896",
                        borderRadius: "8px",
                        background: "#FFFFFF",
                        padding: "12px"
                      }}
                    />
                  </div>
                  <div className="alert alert-info" style={{ 
                    backgroundColor: 'rgba(13, 202, 240, 0.1)', 
                    borderColor: '#0dcaf0', 
                    color: '#055160' 
                  }}>
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Atenção:</strong> Ao alterar de Pré-Ordem, todas as datas são obrigatórias e devem ser iguais ou posteriores à data atual.
                  </div>
                </>
              )}

              {/* Se for "Em produção", peça o número do box */}
              {value === 3 && (
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: "#5A402A" }}>
                    Número do Box: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={numeroBox || ""}
                    onChange={e => onNumeroBoxChange && onNumeroBoxChange(e.target.value)}
                    placeholder="Digite o número do box"
                    disabled={loading}
                    style={{
                      border: "2px solid #D2B896",
                      borderRadius: "8px",
                      background: "#FFFFFF",
                      padding: "12px"
                    }}
                  />
                  <small className="form-text text-muted mt-1">
                    <i className="bi bi-info-circle me-1"></i>
                    Obrigatório para ordens em produção.
                  </small>
                </div>
              )}

              {/* Se for "Pré-Ordem", avise que datas e box não serão enviados */}
              {value === 1 && (
                <div className="alert alert-warning" style={{ 
                  backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                  borderColor: '#ffc107', 
                  color: '#664d03' 
                }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Pré-Ordem:</strong> Datas e número do box não são obrigatórios neste status.
                </div>
              )}

              {/* Informação sobre status cancelado */}
              {value === 5 && (
                <div className="alert alert-danger" style={{ 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  borderColor: '#dc3545', 
                  color: '#721c24' 
                }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Atenção:</strong> Ao cancelar a ordem, ela não poderá ser reativada posteriormente.
                </div>
              )}
            </div>
            <div
              className="modal-footer"
              style={{
                borderTop: "2px solid #D2B896",
                background: "#F5E3C6"
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
                style={{
                  background: "#93908cff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  padding: "10px 20px"
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirm}
                disabled={
                  loading ||
                  (value === 3 && !numeroBox) ||
                  (pedirDatas && (!dataEmissao || !dataProgramada || !dataEntrega))
                }
                style={{
                  background: loading || 
                    (value === 3 && !numeroBox) || 
                    (pedirDatas && (!dataEmissao || !dataProgramada || !dataEntrega))
                    ? "#6c757d" 
                    : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  padding: "10px 20px",
                  boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Aviso */}
      <AvisoModal {...modalProps} />
    </>
  );
};

export default StatusModal;