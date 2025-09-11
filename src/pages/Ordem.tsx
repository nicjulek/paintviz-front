import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardInfo from "../components/CardInfo/CardInfo";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
      unit: "px",
      format: "a4"
    });

    doc.setFontSize(22);
    doc.text("Relatório da Ordem de Serviço", 40, 40);

    doc.setFontSize(14);
    doc.text("Cliente:", 40, 70);
    clienteInfo.forEach((info, idx) => {
      doc.text(`${info.label}: ${info.desc}`, 60, 90 + idx * 18);
    });

    doc.text("Veículo:", 40, 140);
    veiculoInfo.forEach((info, idx) => {
      doc.text(`${info.label}: ${info.desc}`, 60, 160 + idx * 18);
    });

    doc.text("Status:", 40, 210);
    statusInfo.forEach((info, idx) => {
      doc.text(`${info.label}: ${info.desc}`, 60, 230 + idx * 18);
    });

    // Para cada visualização, gera imagem e lista de peças pintadas
    for (const vis of visualizacoes) {
      let pinturaSvg = "";
      let pecasOriginais: any[] = [];
      let pecasPintura: any[] = [];
      let pecasPintadas: any[] = [];

      try {
        // SVG pintado
        const pinturaRes = await axios.get(
          `${API_URL}/pinturas/${ordem.id_pintura}/svg/${vis.tipo}?format=svg&showColors=true`
        );
        pinturaSvg = typeof pinturaRes.data === "string"
          ? pinturaRes.data
          : pinturaRes.data.svg || "";

        // Peças originais da carroceria
        const pecasOriginaisRes = await axios.get(
          `${API_URL}/carrocerias/${ordem.id_carroceria}/pecas/${vis.tipo}`
        );
        pecasOriginais = Array.isArray(pecasOriginaisRes.data) ? pecasOriginaisRes.data : [];

        // Peças pintadas (com cor aplicada)
        const pecasPintadasRes = await axios.get(
          `${API_URL}/pinturas/${ordem.id_pintura}/pecas/${vis.tipo}`
        );
        pecasPintura = Array.isArray(pecasPintadasRes.data) ? pecasPintadasRes.data : [];

        // Compara cor original com cor pintada
        pecasPintadas = pecasPintura.filter((peca: any) => {
          const original = pecasOriginais.find((p: any) => p.id_svg === peca.id_svg);
          return (
            (peca.cor_codigo && original && peca.cor_codigo.toLowerCase() !== (original.cor_original || "#fff").toLowerCase()) ||
            (peca.cor_nome && peca.cor_nome !== "" && (!original || peca.cor_nome !== original.cor_nome))
          );
        });
      } catch (err) {
        // Se não conseguir buscar, ignora
      }

      if (pinturaSvg) {
        // Cria um elemento SVG temporário fora do DOM visível
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "fixed";
        tempDiv.style.left = "-9999px";
        tempDiv.style.width = "420px"; // largura A4 retrato
        tempDiv.style.height = "595px"; // altura A4 retrato
        tempDiv.innerHTML = pinturaSvg;
        document.body.appendChild(tempDiv);

        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(tempDiv, {
          backgroundColor: "#fff",
          scale: 1,
          width: tempDiv.offsetWidth,
          height: tempDiv.offsetHeight
        });
        const imgData = canvas.toDataURL("image/png");

        // Cada visualização em uma página inteira
        doc.addPage();
        doc.setFontSize(18);
        doc.text(`Visualização: ${vis.label}`, 40, 40);
        doc.addImage(imgData, "PNG", 40, 60, 340, 220);

        document.body.removeChild(tempDiv);

        // Lista de peças pintadas e cores (em nova página)
        doc.addPage();
        doc.setFontSize(18);
        doc.text(`Peças Pintadas - ${vis.label}`, 40, 40);
        let y = 70;
        if (pecasPintadas && pecasPintadas.length > 0) {
          pecasPintadas.forEach((peca: any, idx: number) => {
            const cor = peca.cor_nome || peca.cor_codigo || "-";
            doc.text(`${peca.nome_peca}: ${cor}`, 60, y + idx * 18);
          });
        } else {
          doc.text("Nenhuma peça pintada encontrada.", 60, y);
        }
      }
    }

    // Salva o PDF apenas uma vez ao final
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