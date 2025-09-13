import React from "react";

interface PrioriModalProps {
  show: boolean;
  value: string;
  onChange: (data: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const PrioriModal: React.FC<PrioriModalProps> = ({
  show,
  value,
  onChange,
  onClose,
  onConfirm,
  loading
}) => {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{
      display: 'block',
      background: 'rgba(0,0,0,0.3)'
    }}>
      <div className="modal-dialog">
        <div 
          className="modal-content"
          style={{
            background: "#F5E3C6",
            border: "2px solid #D2B896",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Alterar Data de Entrega</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ borderTop: "2px solid #ceaf76ff", borderBottom: "2px solid #ceaf76ff" }}>
            <input
              type="date"
              className="form-control"
              value={value}
              onChange={e => onChange(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioriModal;