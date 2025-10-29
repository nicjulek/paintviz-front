import React, { useState, useCallback } from 'react';
import { AvisoModalProps } from '../types/types';

const AvisoModal: React.FC<AvisoModalProps> = ({
  show = false,
  onClose,
  onConfirm,
  onRetry,
  titulo = 'Aviso',
  mensagem = 'Mensagem não informada',
  textoConfirmar = 'Confirmar',
  textoFechar = 'Fechar',
  textoRetry = 'Tentar Novamente',
  mostrarFechar = true,
  mostrarConfirmar = false,
  mostrarRetry = false,
  loading = false,
  className = '',
  style = {},
  tipo = 'generico'
}) => {

  if (!show) return null;

  // Função para determinar a cor do header baseada no tipo
  const getHeaderStyle = () => {
    switch (tipo) {
      case 'erro':
        return {
          backgroundColor: '#dc3545',
          color: 'white',
          borderBottom: '1px solid #b02a37'
        };
      case 'sucesso':
        return {
          backgroundColor: '#28a745',
          color: 'white',
          borderBottom: '1px solid #1e7e34'
        };
      case 'confirmacao':
        return {
          backgroundColor: '#ffc107',
          color: '#212529',
          borderBottom: '1px solid #e0a800'
        };
      case 'conexao':
        return {
          backgroundColor: '#fd7e14',
          color: 'white',
          borderBottom: '1px solid #e8681f'
        };
      default:
        return {
          backgroundColor: '#6c757d',
          color: 'white',
          borderBottom: '1px solid #545b62'
        };
    }
  };

  // Função para determinar o ícone baseado no tipo
  const getIcon = () => {
    switch (tipo) {
      case 'erro':
        return 'bi-exclamation-triangle-fill';
      case 'sucesso':
        return 'bi-check-circle-fill';
      case 'confirmacao':
        return 'bi-question-circle-fill';
      case 'conexao':
        return 'bi-wifi-off';
      default:
        return 'bi-info-circle-fill';
    }
  };

  const handleConfirmar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading && onConfirm) {
      onConfirm();
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading && onRetry) {
      onRetry();
    }
  };

  const handleFechar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-backdrop ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-start', 
        justifyContent: 'center',
        paddingTop: '15vh',
        zIndex: 9999,
        ...style
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="modal-dialog"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '70vh', 
          overflow: 'auto',
          marginTop: '0' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com cor dinâmica */}
        <div 
          className="modal-header"
          style={{ 
            padding: '16px 20px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            ...getHeaderStyle()
          }}
        >
          <h5 className="modal-title mb-0 fw-bold d-flex align-items-center">
            <i className={`bi ${getIcon()} me-2`}></i>
            {titulo}
          </h5>
        </div>
        
        {/* Body */}
        <div 
          className="modal-body"
          style={{ padding: '20px' }}
        >
          <p className="mb-0">
            {mensagem}
          </p>

          {loading && (
            <div className="d-flex align-items-center justify-content-center mt-3">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <span>Processando...</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div 
          className="modal-footer"
          style={{ 
            padding: '12px 20px',
            borderTop: '1px solid #dee2e6',
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end'
          }}
        >
          {mostrarRetry && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleRetry}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              {textoRetry}
            </button>
          )}

          {mostrarConfirmar && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmar}
              disabled={loading}
            >
              <i className="bi bi-check-lg me-1"></i>
              {textoConfirmar}
            </button>
          )}

          {mostrarFechar && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleFechar}
              disabled={loading}
            >
              <i className="bi bi-x-lg me-1"></i>
              {textoFechar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface UseAvisoModalProps {
  tipo?: 'erro' | 'sucesso' | 'confirmacao' | 'conexao' | 'generico';
  onConfirm?: () => void;
  onRetry?: () => void;
}

export const useAvisoModal = (defaultConfig?: UseAvisoModalProps) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Partial<AvisoModalProps>>({
    mostrarFechar: true,
    mostrarConfirmar: false,
    mostrarRetry: false,
    tipo: 'generico',
    ...defaultConfig
  });

  const mostrarModal = useCallback((novoConfig: Partial<AvisoModalProps>) => {
    setConfig(prev => ({ ...prev, ...novoConfig }));
    setShow(true);
  }, []);

  const fecharModal = useCallback(() => {
    setShow(false);
    setLoading(false);
  }, []);

  const mostrarErro = useCallback((titulo?: string, mensagem?: string) => {
    mostrarModal({
      titulo: titulo || 'Erro',
      mensagem: mensagem || 'Ocorreu um erro inesperado.',
      mostrarRetry: true,
      mostrarConfirmar: false,
      tipo: 'erro'
    });
  }, [mostrarModal]);

  const mostrarSucesso = useCallback((titulo?: string, mensagem?: string) => {
    mostrarModal({
      titulo: titulo || 'Sucesso',
      mensagem: mensagem || 'Operação realizada com sucesso!',
      mostrarConfirmar: false,
      mostrarRetry: false,
      tipo: 'sucesso'
    });
  }, [mostrarModal]);

  const mostrarConfirmacao = useCallback((
    titulo?: string, 
    mensagem?: string, 
    onConfirm?: () => void
  ) => {
    mostrarModal({
      titulo: titulo || 'Confirmar',
      mensagem: mensagem || 'Deseja realmente continuar?',
      mostrarConfirmar: true,
      onConfirm,
      tipo: 'confirmacao'
    });
  }, [mostrarModal]);

  const modalProps: AvisoModalProps = {
    show,
    loading,
    onClose: fecharModal,
    ...config
  };

  return {
    modalProps,
    mostrarModal,
    fecharModal,
    mostrarErro,
    mostrarSucesso,
    mostrarConfirmacao,
    setLoading
  };
};

export default AvisoModal;