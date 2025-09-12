import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardInfo from "../components/CardInfo/CardInfo";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import iconP from '../assets/icon-p.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

const visualizacoes = [
  { tipo: "lateral", label: "Lateral" },
  { tipo: "traseira", label: "Traseira" },
  { tipo: "diagonal", label: "Diagonal" }
];

const Ordem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordem, setOrdem] = useState<any>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visualizacaoIdx, setVisualizacaoIdx] = useState(0);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrdem() {
      try {
        const ordemRes = await axios.get(`${API_URL}/ordem-servico/${id}`);
        setOrdem(ordemRes.data);

        let clienteId = ordemRes.data.id_cliente;
        if (clienteId) {
          const clienteRes = await axios.get(`${API_URL}/clientes/${clienteId}`);
          setCliente(clienteRes.data);
        }
      } catch (err) {
        setOrdem(null);
      } finally {
        setLoading(false);
      }
    }
    fetchOrdem();
  }, [id]);

  useEffect(() => {
    async function fetchSvg() {
      if (ordem?.id_pintura) {
        const tipo = visualizacoes[visualizacaoIdx].tipo;
        try {
          const svgRes = await axios.get(`${API_URL}/pinturas/${ordem.id_pintura}/svg/${tipo}?format=svg`);
          const svgString = typeof svgRes.data === "string"
            ? svgRes.data
            : svgRes.data.svg || "";
          setSvg(svgString);
        } catch {
          setSvg(null);
        }
      }
    }
    fetchSvg();
  }, [ordem?.id_pintura, visualizacaoIdx]);

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

  let clienteInfo: any[] = [];
  if (cliente?.pessoa_fisica) {
    clienteInfo = [
      { label: "Nome", desc: cliente.pessoa_fisica.nome || "-", highlight: true },
      { label: "CPF", desc: cliente.pessoa_fisica.cpf || "-" },
      { label: "E-mail", desc: cliente.email || "-" },
      { label: "Celular", desc: cliente.celular || "-" }
    ];
  } else if (cliente?.pessoa_juridica) {
    clienteInfo = [
      { label: "Empresa", desc: cliente.pessoa_juridica.empresa || "-", highlight: true },
      { label: "CNPJ", desc: cliente.pessoa_juridica.cnpj || "-" },
      { label: "Razão Social", desc: cliente.pessoa_juridica.razao_social || "-" },
      { label: "E-mail", desc: cliente.email || "-" },
      { label: "Telefone", desc: cliente.celular || "-" }
    ];
  } else {
    clienteInfo = [
      { label: "Cliente", desc: ordem.nome_cliente || "-", highlight: true },
      { label: "E-mail", desc: cliente?.email || "-" },
      { label: "Telefone", desc: cliente?.celular || "-" }
    ];
  }

  const veiculoInfo = [
    { label: "Modelo do Veículo", desc: ordem.modelo_veiculo || "-", highlight: true },
    { label: "Placa do Veículo", desc: ordem.placa_veiculo || "-", highlight: true },
    { label: "Identificação do Veículo", desc: ordem.identificacao_veiculo || "-" }
  ];

  const statusInfo = [
    { label: "Data de Emissão", desc: ordem.data_emissao ? ordem.data_emissao.slice(0, 10) : "-" },
    { label: "Data de Entrega", desc: ordem.data_entrega ? ordem.data_entrega.slice(0, 10) : "-" },
    { label: "Data Programada", desc: ordem.data_programada ? ordem.data_programada.slice(0, 10) : "-" },
    { label: "Usuário", desc: ordem.usuario || "-", highlight: true },
    { label: "Status", desc: ordem.status_nome || ordem.id_status || "-", highlight: true },
    { label: "Número de Box", desc: ordem.numero_box || "-" }
  ];

  const handlePrev = () => {
    setVisualizacaoIdx(idx => (idx === 0 ? visualizacoes.length - 1 : idx - 1));
  };
  const handleNext = () => {
    setVisualizacaoIdx(idx => (idx === visualizacoes.length - 1 ? 0 : idx + 1));
  };

  // Botão Editar Ordem
  const handleEditarOrdem = () => {
    if (ordem?.id_ordem_servico) {
      navigate(`/cadastro-ordem?id_ordem=${ordem.id_ordem_servico}`);
    }
  };

  // Função para gerar o PDF
  const handleGerarRelatorio = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // 1. Cabeçalho com logo
    doc.addImage(iconP, "PNG", 15, 2, 35, 30); // Ajuste posição/tamanho conforme PDF
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Ordem de Serviço", 60, 20);

    // 2. Informações do Cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Cliente:", 15, 35);
    clienteInfo.forEach((info, idx) => {
      doc.text(`${info.label}: ${info.desc}`, 25, 42 + idx * 6);
    });

    // 3. Informações do Veículo
    doc.text("Veículo:", 15, 75);
    veiculoInfo.forEach((info, idx) => {
      doc.text(`${info.label}: ${info.desc}`, 25, 82 + idx * 6);
    });

    // 4. Datas e Status
    doc.text("Status:", 15, 100);
    statusInfo.forEach((info, idx) => {
      doc.text(`${info.label}: ${info.desc}`, 25, 107 + idx * 6);
    });

    // 5. Visualizações do veículo (imagens)
  let yImg = 150;
  let imgData = "";

  for (const vis of visualizacoes) {
    console.log("Processando visualização:", vis.tipo);
    let pinturaSvg = "";

    try {
      // SVG pintado
      const pinturaRes = await axios.get(
        `${API_URL}/pinturas/${ordem.id_pintura}/svg/${vis.tipo}?format=svg&showColors=true`
      );
      pinturaSvg = typeof pinturaRes.data === "string"
        ? pinturaRes.data
        : pinturaRes.data.svg || "";

    } catch (err) { }

    // Renderizar SVG como imagem
    if (pinturaSvg) {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "650px";
      tempDiv.style.height = "400px";
      tempDiv.innerHTML = pinturaSvg.replace('<svg', '<svg style="width:100%;height:100%;display:block"');
      document.body.appendChild(tempDiv);

      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(tempDiv, {
        background: "#fff",
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight
      });

      const cropY = 30 // pixels do topo que você quer cortar
      const cropHeight = canvas.height - cropY;
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = canvas.width;
      croppedCanvas.height = cropHeight;

      const ctx = croppedCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, cropY, canvas.width, cropHeight,
          0, 0, canvas.width, cropHeight
        );
      }

      // Agora use imgData no jsPDF
      imgData = croppedCanvas.toDataURL("image/png");
      document.body.removeChild(tempDiv);

      doc.text(`Visualização: ${vis.label}`, 15, yImg);
      doc.addImage(imgData, "PNG", 10, yImg + 3, 190, 100); // Ajuste tamanho conforme PDF
      yImg += 130;
    }
    
    if (yImg > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yImg = 10;
    }
  }
  // 7. Rodapé igual ao PDF
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("PaintViz - Relatório gerado automaticamente", 15, 285);

  // 8. Salvar PDF
  doc.save(`relatorio_ordem_${ordem.id_ordem_servico}.pdf`);
};

return (
  <div
    className="d-flex flex-column min-vh-100"
    style={{
      background: "#d2c09e",
      borderRadius: "32px",
      boxShadow: "0 12px 40px 0 rgba(90,64,42,0.18), 0 2px 8px 0 rgba(90,64,42,0.10)"
    }}
  >
    <main className="flex-grow-1 container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          <div className="d-flex align-items-center mb-3 gap-2">
            <button
              className="btn btn-primary"
              style={{
                borderRadius: 12,
                fontWeight: 600,
                boxShadow: "0 2px 8px #5a402a22",
                border: "none",
                padding: "8px 18px",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i> Voltar
            </button>
            <h2
              className="fw-bold mb-0"
              style={{
                color: "#5A402A",
                letterSpacing: 1,
                fontSize: "1.7rem",
                marginLeft: 10
              }}
            >
              <i className="bi bi-file-earmark-text me-2"></i>
              Ordem de Serviço
            </h2>
          </div>
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
              <button className="btn btn-link text-dark fs-4 px-2" onClick={handlePrev}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="fw-semibold" style={{ color: "#5A402A", fontSize: "1.08rem" }}>
                <i className="bi bi-display"></i> Visualização: {visualizacoes[visualizacaoIdx].label}
              </span>
              <button className="btn btn-link text-dark fs-4 px-2" onClick={handleNext}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-brush"></i> Editar Pintura
            </button>
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={handleGerarRelatorio}
            >
              <i className="bi bi-file-earmark-text"></i> Gerar Relatório
            </button>
          </div>
          <div className="d-flex flex-wrap gap-3 justify-content-center mt-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleEditarOrdem}
            >
              <i className="bi bi-pencil"></i> Editar Ordem
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-person"></i> Editar Cliente
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
);
};

export default Ordem;