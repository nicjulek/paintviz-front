import React, { useState } from "react";
import CardInfo from "../components/CardInfo/CardInfo";
import FormularioCliente from "../components/FormularioCliente/FormularioCliente";
import { useOrdem } from "../hooks/useOrdem";

const Ordem: React.FC = () => {
  const {
    ordem,
    cliente,
    loading,
    visualizacaoIdx,
    svg,
    clienteInfo,
    veiculoInfo,
    statusInfo,
    visualizacoes,
    navigate,
    handlePrev,
    handleNext,
    handleEditarOrdem,
    handleGerarRelatorio,
    recarregarDados
  } = useOrdem();

  const [showClienteModal, setShowClienteModal] = useState(false);

  const handleEditarCliente = () => {
    setShowClienteModal(true);
  };

  const handleClienteAtualizado = () => {
    // Recarregar dados da ordem após atualizar cliente
    if (recarregarDados) {
      recarregarDados();
    }
    setShowClienteModal(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "#e9e1d0" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!ordem) {
    return <div className="text-center mt-5">Ordem de serviço não encontrada.</div>;
  }

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        background: "linear-gradient(135deg, #C4AE79 0%, #d2c09e 100%)",
        borderRadius: "32px",
        boxShadow: "0 12px 40px 0 rgba(90,64,42,0.18), 0 2px 8px 0 rgba(90,64,42,0.10)"
      }}
    >
      <main className="flex-grow-1 container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-primary"
            style={{
              borderRadius: "15px",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
              border: "none",
              padding: "10px 20px",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)"
            }}
            onClick={() => navigate(-1)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(90,64,42,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
            }}
          >
            <i className="bi bi-arrow-left"></i> Voltar
          </button>
          
          <h2 className="mb-0 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
            <i className="bi bi-file-earmark-text me-2"></i>
            Ordem de Serviço
          </h2>
          
          <div style={{ width: "120px" }}></div> {/* Espaço para balancear */}
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-5 d-flex flex-column gap-3">
            <CardInfo
              titulo={cliente?.pessoa_fisica ? "Informações do Cliente (Físico)" : cliente?.pessoa_juridica ? "Informações do Cliente (Jurídico)" : "Informações do Cliente"}
              icon={<i className="bi bi-person"></i>}
              informacoes={clienteInfo}
            />
            <CardInfo
              titulo="Detalhes do Veículo"
              icon={<i className="bi bi-truck"></i>}
              informacoes={veiculoInfo}
            />
            <CardInfo
              titulo="Datas e Status"
              icon={<i className="bi bi-calendar"></i>}
              informacoes={statusInfo}
            />
          </div>
          <div className="col-12 col-lg-7 d-flex flex-column align-items-center">
            <div
              className="card p-4 mb-4"
              style={{
                background: "#e9e1d0",
                borderRadius: "22px",
                boxShadow: "0 8px 32px 0 rgba(90,64,42,0.13), 0 2px 8px 0 rgba(90,64,42,0.10)",
                minHeight: 540,
                width: "100%",
                maxWidth: 820,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <h5 className="fw-bold mb-3" style={{ color: "#5A402A", fontSize: "1.25rem" }}>
                <i className="bi bi-truck-front me-2"></i>
                {ordem.nome_modelo || "Modelo"}
              </h5>
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{
                  width: "100%",
                  background: "#fff",
                  borderRadius: "18px",
                  boxShadow: "0 2px 8px #5a402a22",
                  padding: "0px",
                  minHeight: 220,
                  height: "auto",
                  overflow: "visible"
                }}
              >
                {svg ? (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 760,
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                ) : (
                  <div
                    style={{
                      width: 760,
                      height: 180,
                      background: "#f8f9fa",
                      borderRadius: "18px",
                      border: "1px solid #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888"
                    }}
                  >
                    Imagem não disponível
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{ width: "100%" }}>
                <button 
                  className="btn btn-light rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease"
                  }}
                  onClick={handlePrev}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                >
                  <i className="bi bi-chevron-left fs-5"></i>
                </button>
                <span className="fw-semibold" style={{ color: "#5A402A", fontSize: "1.08rem" }}>
                  <i className="bi bi-display"></i> Visualização: {visualizacoes[visualizacaoIdx].label}
                </span>
                <button 
                  className="btn btn-light rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease"
                  }}
                  onClick={handleNext}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                >
                  <i className="bi bi-chevron-right fs-5"></i>
                </button>
              </div>
            </div>

            {/* Grid de 4 botões do mesmo tamanho */}
            <div className="row g-3 w-100" style={{ maxWidth: "820px" }}>
              <div className="col-6">
                <button 
                  className="btn btn-primary w-100"
                  style={{
                    borderRadius: "15px",
                    fontWeight: "600",
                    padding: "16px 20px",
                    background: "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
                    transition: "all 0.3s ease",
                    minHeight: "65px"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,64,42,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
                  }}
                >
                  <i className="bi bi-brush me-2 fs-5"></i>
                  <span className="fw-bold">Editar Pintura</span>
                </button>
              </div>
              
              <div className="col-6">
                <button
                  className="btn btn-primary w-100"
                  style={{
                    borderRadius: "15px",
                    fontWeight: "600",
                    padding: "16px 20px",
                    background: "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
                    transition: "all 0.3s ease",
                    minHeight: "65px"
                  }}
                  onClick={handleGerarRelatorio}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,64,42,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
                  }}
                >
                  <i className="bi bi-file-earmark-pdf me-2 fs-5"></i>
                  <span className="fw-bold">Gerar Relatório</span>
                </button>
              </div>
              
              <div className="col-6">
                <button
                  className="btn btn-primary w-100"
                  style={{
                    borderRadius: "15px",
                    fontWeight: "600",
                    padding: "16px 20px",
                    background: "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
                    transition: "all 0.3s ease",
                    minHeight: "65px"
                  }}
                  onClick={handleEditarOrdem}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,64,42,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
                  }}
                >
                  <i className="bi bi-pencil-square me-2 fs-5"></i>
                  <span className="fw-bold">Editar Ordem</span>
                </button>
              </div>
              
              <div className="col-6">
                <button 
                  className="btn btn-primary w-100"
                  style={{
                    borderRadius: "15px",
                    fontWeight: "600",
                    padding: "16px 20px",
                    background: "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
                    transition: "all 0.3s ease",
                    minHeight: "65px"
                  }}
                  onClick={handleEditarCliente}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,64,42,0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
                  }}
                >
                  <i className="bi bi-person-gear me-2 fs-5"></i>
                  <span className="fw-bold">Editar Cliente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Edição do Cliente */}
      <FormularioCliente
        show={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onClienteCadastrado={handleClienteAtualizado}
        cliente={cliente}
        isEditing={true}
      />
    </div>
  );
};

export default Ordem;