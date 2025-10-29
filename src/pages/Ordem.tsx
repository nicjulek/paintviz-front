import React, { useState } from 'react';
import { useOrdem } from '../hooks/useOrdem';
import CardInfo from '../components/CardInfo/CardInfo';
import FormularioCliente from '../components/FormularioCliente/FormularioCliente';
import { Tooltip } from '../components/Tooltip';

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
    if (recarregarDados) {
      recarregarDados();
    }
    setShowClienteModal(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ 
        background: "linear-gradient(135deg, #C4AE79 0%, #d2c09e 100%)",
        backdropFilter: "blur(10px)"
      }}>
        <div className="text-center">
          <div 
            className="spinner-border text-primary mb-3" 
            role="status" 
            style={{ 
              width: "3rem", 
              height: "3rem",
              color: "#5A402A !important"
            }}
          >
            <span className="visually-hidden">Carregando...</span>
          </div>
          <h5 style={{ color: "#5A402A", fontWeight: "600" }}>Carregando ordem de serviço...</h5>
        </div>
      </div>
    );
  }

  if (!ordem) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ 
        background: "linear-gradient(135deg, #C4AE79 0%, #d2c09e 100%)" 
      }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem", color: "#5A402A" }}></i>
          <h4 className="mt-3" style={{ color: "#5A402A" }}>Ordem de serviço não encontrada</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .ordem-slide-left {
            animation: slideInLeft 0.6s ease-out;
          }

          .ordem-slide-left-delayed {
            animation: slideInLeft 0.8s ease-out;
          }

          .ordem-slide-left-more-delayed {
            animation: slideInLeft 1s ease-out;
          }

          .ordem-slide-right {
            animation: slideInRight 0.6s ease-out;
          }

          .ordem-slide-up {
            animation: slideInUp 0.8s ease-out;
          }
        `}
      </style>
      
      <div
        className="min-vh-100"
        style={{
          background: "linear-gradient(135deg, #C4AE79 0%, #d2c09e 50%, #B8A570 100%)",
          position: "relative",
          overflow: "hidden",
          borderRadius: "2px"
        }}
      >
        {/* Background pattern */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle at 25% 25%, #5A402A 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #5A402A 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 30px 30px"
          }}
        />

        <div className="container-fluid py-4 position-relative" style={{ zIndex: 1 }}>
          {/* Header */}
          <div className="row mb-5">
            <div className="col-12">
              <div 
                className="d-flex justify-content-between align-items-center p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "25px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(90, 64, 42, 0.15)"
                }}
              >
                <Tooltip helpText="Voltar para a página anterior">
                  <button
                    className="btn"
                    style={{
                      borderRadius: "20px",
                      fontWeight: "600",
                      boxShadow: "0 6px 20px rgba(90,64,42,0.25)",
                      border: "none",
                      padding: "12px 24px",
                      transition: "all 0.4s ease",
                      background: "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onClick={() => navigate(-1)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(90,64,42,0.35)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(90,64,42,0.25)";
                    }}
                  >
                    <i className="bi bi-arrow-left"></i>
                    <span>Voltar</span>
                  </button>
                </Tooltip>
                
                <Tooltip helpText="Visualização detalhada da ordem de serviço com todas as informações do cliente, veículo e pintura aplicada">
                  <div className="text-center">
                    <h1 
                      className="mb-0 fw-bold"
                      style={{ 
                        color: '#5A402A',
                        textShadow: '2px 4px 8px rgba(90, 64, 42, 0.3)',
                        fontSize: "2.2rem",
                        letterSpacing: "-0.5px"
                      }}
                    >
                      <i className="bi bi-file-earmark-text me-3"></i>
                      Ordem de Serviço #{ordem.id_ordem_servico}
                    </h1>
                    <div 
                      className="mt-2"
                      style={{
                        height: "3px",
                        width: "200px",
                        background: "linear-gradient(90deg, transparent, #5A402A, transparent)",
                        margin: "0 auto",
                        borderRadius: "2px"
                      }}
                    />
                  </div>
                </Tooltip>
                
                <div style={{ width: "140px" }}></div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center g-4">
            {/* Cards de Informação */}
            <div className="col-12 col-xl-4">
              <div className="d-flex flex-column gap-4">
                <div className="ordem-slide-left">
                  <CardInfo
                    titulo={cliente?.pessoa_fisica ? "Informações do Cliente (Físico)" : cliente?.pessoa_juridica ? "Informações do Cliente (Jurídico)" : "Informações do Cliente"}
                    icon={<i className="bi bi-person"></i>}
                    informacoes={clienteInfo}
                  />
                  <Tooltip helpText="Informações completas do cliente responsável por esta ordem de serviço">
                    <div className="text-center mt-2">
                      <small 
                        className="text-muted d-flex align-items-center justify-content-center gap-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <i className="bi bi-info-circle"></i>
                        Informações do cliente
                      </small>
                    </div>
                  </Tooltip>
                </div>
                
                <div className="ordem-slide-left-delayed">
                  <CardInfo
                    titulo="Detalhes do Veículo"
                    icon={<i className="bi bi-truck"></i>}
                    informacoes={veiculoInfo}
                  />
                  <Tooltip helpText="Detalhes técnicos do veículo que será pintado">
                    <div className="text-center mt-2">
                      <small 
                        className="text-muted d-flex align-items-center justify-content-center gap-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <i className="bi bi-info-circle"></i>
                        Detalhes técnicos do veículo
                      </small>
                    </div>
                  </Tooltip>
                </div>
                
                <div className="ordem-slide-left-more-delayed">
                  <CardInfo
                    titulo="Datas e Status"
                    icon={<i className="bi bi-calendar"></i>}
                    informacoes={statusInfo}
                  />
                  <Tooltip helpText="Datas importantes da ordem e status atual do serviço">
                    <div className="text-center mt-2">
                      <small 
                        className="text-muted d-flex align-items-center justify-content-center gap-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <i className="bi bi-info-circle"></i>
                        Status e cronograma
                      </small>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Visualização do Veículo */}
            <div className="col-12 col-xl-8">
              <div className="ordem-slide-right">
                <div
                  className="card p-4 mb-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "30px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 20px 60px rgba(90, 64, 42, 0.15), 0 8px 20px rgba(90, 64, 42, 0.1)",
                    minHeight: 450,
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 25px 70px rgba(90, 64, 42, 0.2), 0 10px 25px rgba(90, 64, 42, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(90, 64, 42, 0.15), 0 8px 20px rgba(90, 64, 42, 0.1)";
                  }}
                >
                  <div className="text-center mb-3">
                    <h4 
                      className="fw-bold mb-2"
                      style={{ 
                        color: "#5A402A",
                        fontSize: "1.3rem",
                        textShadow: "1px 2px 4px rgba(90, 64, 42, 0.2)"
                      }}
                    >
                      <i className="bi bi-truck-front me-2"></i>
                      {ordem.nome_modelo || "Modelo do Veículo"}
                    </h4>
                    <div 
                      style={{
                        height: "2px",
                        width: "100px",
                        background: "linear-gradient(90deg, transparent, #5A402A, transparent)",
                        margin: "0 auto",
                        borderRadius: "1px"
                      }}
                    />
                  </div>
                  
                  <div
                    className="d-flex justify-content-center align-items-center mb-3"
                    style={{
                      background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                      borderRadius: "20px",
                      boxShadow: "inset 0 2px 10px rgba(90, 64, 42, 0.1)",
                      padding: "15px",
                      minHeight: 220,
                      border: "2px solid rgba(90, 64, 42, 0.1)"
                    }}
                  >
                    {svg ? (
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 600,
                          height: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          filter: "drop-shadow(0 4px 8px rgba(90, 64, 42, 0.1))"
                        }}
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                    ) : (
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          width: "100%",
                          height: 180,
                          background: "linear-gradient(135deg, #f1f3f4 0%, #e9ecef 100%)",
                          borderRadius: "15px",
                          border: "2px dashed #dee2e6",
                          color: "#6c757d"
                        }}
                      >
                        <i className="bi bi-image" style={{ fontSize: "2.5rem", marginBottom: "8px" }}></i>
                        <span style={{ fontSize: "1rem", fontWeight: "500" }}>Imagem não disponível</span>
                      </div>
                    )}
                  </div>

                  {/* Controles de Navegação */}
                  <div 
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{
                      background: "rgba(90, 64, 42, 0.05)",
                      borderRadius: "15px",
                      padding: "12px 16px"
                    }}
                  >
                    <Tooltip helpText="Visualizar ângulo anterior da carroceria">
                      <button 
                        className="btn"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                          border: "2px solid rgba(90, 64, 42, 0.2)",
                          boxShadow: "0 4px 15px rgba(90, 64, 42, 0.15)",
                          transition: "all 0.4s ease",
                          color: "#5A402A"
                        }}
                        onClick={handlePrev}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1) rotate(-5deg)";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(90, 64, 42, 0.25)";
                          e.currentTarget.style.background = "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(90, 64, 42, 0.15)";
                          e.currentTarget.style.background = "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)";
                          e.currentTarget.style.color = "#5A402A";
                        }}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </Tooltip>

                    <div className="text-center">
                      <div
                        className="fw-semibold mb-1"
                        style={{ 
                          color: "#5A402A",
                          fontSize: "1rem",
                          textShadow: "1px 1px 2px rgba(90, 64, 42, 0.1)"
                        }}
                      >
                        <i className="bi bi-display me-1"></i> 
                        {visualizacoes[visualizacaoIdx].label}
                      </div>
                      <div className="d-flex justify-content-center gap-1">
                        {visualizacoes.map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: index === visualizacaoIdx 
                                ? "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)"
                                : "rgba(90, 64, 42, 0.3)",
                              transition: "all 0.3s ease",
                              boxShadow: index === visualizacaoIdx ? "0 2px 6px rgba(90, 64, 42, 0.4)" : "none"
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <Tooltip helpText="Visualizar próximo ângulo da carroceria">
                      <button 
                        className="btn"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                          border: "2px solid rgba(90, 64, 42, 0.2)",
                          boxShadow: "0 4px 15px rgba(90, 64, 42, 0.15)",
                          transition: "all 0.4s ease",
                          color: "#5A402A"
                        }}
                        onClick={handleNext}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(90, 64, 42, 0.25)";
                          e.currentTarget.style.background = "linear-gradient(135deg, #5A402A 0%, #3D2B1C 100%)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(90, 64, 42, 0.15)";
                          e.currentTarget.style.background = "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)";
                          e.currentTarget.style.color = "#5A402A";
                        }}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="row g-3 ordem-slide-up">
                  <div className="col-12 col-md-4">
                    <Tooltip helpText="Gerar relatório PDF com todas as informações da ordem e visualizações da carroceria">
                      <button
                        className="btn w-100"
                        style={{
                          borderRadius: "20px",
                          fontWeight: "600",
                          padding: "18px 20px",
                          background: "linear-gradient(135deg, #442F1F 0%, #5A402A 100%)",
                          border: "none",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          transition: "all 0.4s ease",
                          minHeight: "70px",
                          color: "white",
                          fontSize: "1rem"
                        }}
                        onClick={handleGerarRelatorio}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf me-2 fs-5"></i>
                        <div>
                          <div className="fw-bold">Gerar Relatório</div>
                          <small style={{ opacity: 0.9 }}>PDF completo</small>
                        </div>
                      </button>
                    </Tooltip>
                  </div>
                  
                  <div className="col-12 col-md-4">
                    <Tooltip helpText="Editar informações gerais da ordem como datas, status, modelo do veículo, etc.">
                      <button
                        className="btn w-100"
                        style={{
                          borderRadius: "20px",
                          fontWeight: "600",
                          padding: "18px 20px",
                          background: "linear-gradient(135deg, #442F1F 0%, #5A402A 100%)",
                          border: "none",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          transition: "all 0.4s ease",
                          minHeight: "70px",
                          color: "white",
                          fontSize: "1rem"
                        }}
                        onClick={handleEditarOrdem}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                        }}
                      >
                        <i className="bi bi-pencil-square me-2 fs-5"></i>
                        <div>
                          <div className="fw-bold">Editar Ordem</div>
                          <small style={{ opacity: 0.9 }}>Dados gerais</small>
                        </div>
                      </button>
                    </Tooltip>
                  </div>
                  
                  <div className="col-12 col-md-4">
                    <Tooltip helpText="Editar dados do cliente responsável por esta ordem de serviço">
                      <button 
                        className="btn w-100"
                        style={{
                          borderRadius: "20px",
                          fontWeight: "600",
                          padding: "18px 20px",
                          background: "linear-gradient(135deg, #442F1F 0%, #5A402A 100%)",
                          border: "none",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          transition: "all 0.4s ease",
                          minHeight: "70px",
                          color: "white",
                          fontSize: "1rem"
                        }}
                        onClick={handleEditarCliente}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                        }}
                      >
                        <i className="bi bi-person-gear me-2 fs-5"></i>
                        <div>
                          <div className="fw-bold">Editar Cliente</div>
                          <small style={{ opacity: 0.9 }}>Informações pessoais</small>
                        </div>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FormularioCliente
          show={showClienteModal}
          onClose={() => setShowClienteModal(false)}
          onClienteCadastrado={handleClienteAtualizado}
          cliente={cliente}
          isEditing={true}
        />
      </div>
    </>
  );
};

export default Ordem;