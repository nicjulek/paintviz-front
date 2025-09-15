import React from "react";
import { PrioriModalProps } from "../types/types";

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
            <button type="button" className="btn btn-secondary" onClick={onClose}
              style={{
                background: "#93908cff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "10px 20px"
              }}>
              <i className="bi bi-x-circle me-2"></i>
              Voltar
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={loading} style={{
              background: loading ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              padding: "10px 20px",
              boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
            }}>
              <i className="bi bi-check-circle me-2"></i>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioriModal;