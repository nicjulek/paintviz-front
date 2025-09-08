import React from "react";

interface StatusModalProps {
  show: boolean;
  statusList: { id: number; nome: string }[];
  value: number;
  statusAtual: number;
  dataEmissao?: string;
  dataProgramada?: string;
  dataEntrega?: string;
  onDataEmissaoChange?: (v: string) => void;
  onDataProgramadaChange?: (v: string) => void;
  onDataEntregaChange?: (v: string) => void;
  numeroBox?: string;
  onNumeroBoxChange?: (box: string) => void;
  onChange: (id: number) => void;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

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
  if (!show) return null;

  // Se a ordem está em pré-ordem antes da alteração, peça as datas
  const pedirDatas = statusAtual === 1 && value !== 1;

  return (
    <div className="modal fade show" style={{
      display: 'block',
      background: 'rgba(0,0,0,0.3)'
    }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Alterar Status</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <select
              className="form-select mb-3"
              value={value}
              onChange={e => onChange(Number(e.target.value))}
            >
              {statusList.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            {/* Se a ordem está em pré-ordem antes da alteração, peça as datas */}
            {pedirDatas && (
              <>
                <div className="mb-2">
                  <label className="form-label">Data de Emissão</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataEmissao || ""}
                    onChange={e => onDataEmissaoChange && onDataEmissaoChange(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Data Programada</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataProgramada || ""}
                    onChange={e => onDataProgramadaChange && onDataProgramadaChange(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Data de Entrega</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataEntrega || ""}
                    onChange={e => onDataEntregaChange && onDataEntregaChange(e.target.value)}
                  />
                </div>
              </>
            )}
            {/* Se for "Em produção", peça o número do box */}
            {value === 3 && (
              <div className="mb-3">
                <label className="form-label">Número do Box</label>
                <input
                  type="text"
                  className="form-control"
                  value={numeroBox || ""}
                  onChange={e => onNumeroBoxChange && onNumeroBoxChange(e.target.value)}
                  placeholder="Digite o número do box"
                  required
                />
              </div>
            )}
            {/* Se for "Pré-Ordem", avise que datas e box não serão enviados */}
            {value === 1 && (
              <div className="alert alert-warning">
                Para Pré-Ordem, datas e número do box não serão enviados.
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirm}
              disabled={
                loading ||
                (value === 3 && !numeroBox) ||
                (pedirDatas && (!dataEmissao || !dataProgramada || !dataEntrega))
              }
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;