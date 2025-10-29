import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PrioriModalProps } from "../types/types";

const PrioriModal: React.FC<PrioriModalProps> = ({
  show,
  value,
  onChange,
  onClose,
  onConfirm,
  loading = false
}) => {
  if (!show) return null;

  // Obter data atual no formato YYYY-MM-DD
  const hoje = new Date().toISOString().split('T')[0];

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validar se a data não é anterior à data atual
    if (value && value < hoje) {
      alert('A data de entrega não pode ser anterior à data atual.');
      return;
    }
    
    onConfirm();
  };

  return (
    <div 
      className="modal d-block" 
      tabIndex={-1} 
      style={{ 
        background: "rgba(0,0,0,0.3)",
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'flex-start', 
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
    >
      <div 
        className="modal-dialog"
        style={{
          margin: '0 auto',
          maxWidth: '500px',
          width: '90%',
          marginTop: '0' 
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
              <i className="bi bi-calendar2-week me-2"></i>
              Alterar Prioridade/Data de Entrega
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
              <label htmlFor="data-entrega" className="form-label fw-bold" style={{ color: "#5A402A" }}>
                Nova Data de Entrega:
              </label>
              <input
                id="data-entrega"
                type="date"
                className="form-control"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                min={hoje} // Impede seleção de datas anteriores à data atual
                style={{
                  border: "2px solid #D2B896",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  padding: "12px"
                }}
              />
              <small className="form-text text-muted mt-1">
                <i className="bi bi-info-circle me-1"></i>
                A data de entrega deve ser igual ou posterior à data atual ({new Date().toLocaleDateString('pt-BR')}).
              </small>
            </div>
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
              disabled={loading || !value || value < hoje}
              style={{
                background: loading || !value || value < hoje ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "10px 20px",
                boxShadow: loading || !value || value < hoje ? "none" : "0 4px 15px rgba(40,167,69,0.3)"
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
  );
};

export default PrioriModal;