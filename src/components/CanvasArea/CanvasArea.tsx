import React from "react";

const tiposVisualizacao = ['lateral', 'traseira', 'diagonal'] as const;

const CanvasArea = ({
  carroceriaSelecionada,
  tipoVisualizacao,
  setTipoVisualizacao,
  canvasContainerRef,
  canvasRef,
  error
}: any) => {
  const handleChangeVisualizacao = (direction: "prev" | "next") => {
    const idx = tiposVisualizacao.indexOf(tipoVisualizacao);
    let newIdx = idx;
    if (direction === "prev") {
      newIdx = (idx - 1 + tiposVisualizacao.length) % tiposVisualizacao.length;
    } else {
      newIdx = (idx + 1) % tiposVisualizacao.length;
    }
    setTipoVisualizacao(tiposVisualizacao[newIdx]);
  };

  return (
    <div
      className="bg-white position-relative rounded-4 shadow p-4 mx-auto my-4"
      style={{
        maxWidth: '1300px',
        width: '100%',
        minWidth: '400px',
        minHeight: '0',
        overflowY: 'auto',
        display: 'block'
      }}
    >
      <div
        className="bg-paintviz-brown text-paintviz-light rounded-3 shadow-sm fw-semibold mx-auto mb-4 text-center d-flex align-items-center justify-content-center"
        style={{
          padding: '16px 32px',
          fontSize: '1rem',
          letterSpacing: '1px',
          maxWidth: '700px'
        }}
      >
        {/* Flecha esquerda */}
        <button
          className="btn btn-sm d-flex align-items-center justify-content-center"
          style={{
            fontSize: "1.3rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #D5C0A0 0%, #97876fff 100%)",
            color: "#5A402A",
            border: "none",
            boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
            transition: "all 0.3s ease",
            marginRight: 32 
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,64,42,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
          }}
          onClick={() => handleChangeVisualizacao("prev")}
          disabled={!carroceriaSelecionada}
          title="Visualização anterior"
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <span style={{ fontWeight: 600, fontSize: "1.15rem" }}>
          {carroceriaSelecionada
            ? `${carroceriaSelecionada.nome_modelo.toUpperCase()} - Vista ${tipoVisualizacao.charAt(0).toUpperCase() + tipoVisualizacao.slice(1)}`
            : 'Selecione uma Carroceria'}
        </span>
        {/* Flecha direita */}
        <button
          className="btn btn-sm d-flex align-items-center justify-content-center"
          style={{
            fontSize: "1.3rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #D5C0A0 0%, #97876fff 100%)",
            color: "#5A402A",
            border: "none",
            boxShadow: "0 4px 15px rgba(90,64,42,0.3)",
            transition: "all 0.3s ease",
            marginLeft: 32 // aumenta o espaço entre botão e título
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,64,42,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(90,64,42,0.3)";
          }}
          onClick={() => handleChangeVisualizacao("next")}
          disabled={!carroceriaSelecionada}
          title="Próxima visualização"
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
      <div
        ref={canvasContainerRef}
        className="d-flex align-items-center justify-content-center w-100"
        style={{
          minHeight: 0,
          width: '100%',
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            maxWidth: '1100px',
            width: '100%',
            aspectRatio: '16/9',
            background: '#fff'
          }}
        >
          <canvas
            ref={canvasRef}
            className="border border-light rounded w-100 h-100"
            style={{
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default CanvasArea;