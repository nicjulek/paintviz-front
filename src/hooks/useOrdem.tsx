import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import iconP from '../assets/icon-p.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

const visualizacoes = [
  { tipo: "lateral", label: "Lateral" },
  { tipo: "traseira", label: "Traseira" },
  { tipo: "diagonal", label: "Diagonal" }
];

const statusMap: { [key: number]: string } = {
  1: 'Pré-Ordem',
  2: 'Aberta',
  3: 'Em Produção',
  4: 'Finalizada',
  5: 'Cancelada'
};

// Função para formatar data para dd/mm/aaaa
const formatarData = (dataIso: string | null): string => {
  if (!dataIso) return "-";
  try {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return "-";
    
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
  } catch {
    return "-";
  }
};

export const useOrdem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordem, setOrdem] = useState<any>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visualizacaoIdx, setVisualizacaoIdx] = useState(0);
  const [svg, setSvg] = useState<string | null>(null);

  // CORRIGIDO: Usar useCallback para evitar dependência no useEffect
  const fetchOrdem = useCallback(async () => {
    try {
      setLoading(true);
      const ordemRes = await axios.get(`${API_URL}/ordem-servico/${id}`);
      setOrdem(ordemRes.data);

      let clienteId = ordemRes.data.id_cliente;
      if (clienteId) {
        try {
          const clienteRes = await axios.get(`${API_URL}/clientes/${clienteId}`);
          setCliente(clienteRes.data);
        } catch {
          setCliente(null);
        }
      }

      let usuarioId = ordemRes.data.id_usuario_responsavel;
      if (usuarioId) {
        try {
          const usuarioRes = await axios.get(`${API_URL}/usuarios/${usuarioId}`);
          setUsuario(usuarioRes.data);
        } catch {
          setUsuario(null);
        }
      }

    } catch (err) {
      setOrdem(null);
      setCliente(null);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const recarregarDados = async () => {
    await fetchOrdem();
  };

  // CORRIGIDO: Adicionar fetchOrdem como dependência
  useEffect(() => {
    fetchOrdem();
  }, [fetchOrdem]);

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

  const handlePrev = () => {
    setVisualizacaoIdx(idx => (idx === 0 ? visualizacoes.length - 1 : idx - 1));
  };

  const handleNext = () => {
    setVisualizacaoIdx(idx => (idx === visualizacoes.length - 1 ? 0 : idx + 1));
  };

  const handleEditarOrdem = () => {
    if (ordem?.id_ordem_servico) {
      navigate(`/cadastro-ordem?id_ordem=${ordem.id_ordem_servico}`);
    }
  };

  const handleGerarRelatorio = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // 1. Cabeçalho com logo
    doc.addImage(iconP, "PNG", 15, 2, 35, 30);
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
        const pinturaRes = await axios.get(
          `${API_URL}/pinturas/${ordem.id_pintura}/svg/${vis.tipo}?format=svg&showColors=true`
        );
        pinturaSvg = typeof pinturaRes.data === "string"
          ? pinturaRes.data
          : pinturaRes.data.svg || "";
      } catch (err) { }

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

        const cropY = 30;
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

        imgData = croppedCanvas.toDataURL("image/png");
        document.body.removeChild(tempDiv);

        doc.text(`Visualização: ${vis.label}`, 15, yImg);
        doc.addImage(imgData, "PNG", 10, yImg + 3, 190, 100);
        yImg += 130;
      }

      if (yImg > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yImg = 10;
      }
    }

    // 7. Rodapé
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("PaintViz - Relatório gerado automaticamente", 15, 285);

    // 8. Salvar PDF
    doc.save(`relatorio_ordem_${ordem.id_ordem_servico}.pdf`);
  };

  // Computed values com formatação de data
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
      { label: "Cliente", desc: ordem?.nome_cliente || "-", highlight: true },
      { label: "E-mail", desc: cliente?.email || "-" },
      { label: "Telefone", desc: cliente?.celular || "-" }
    ];
  }

  const veiculoInfo = [
    { label: "Modelo do Veículo", desc: ordem?.modelo_veiculo || "-", highlight: true },
    { label: "Placa do Veículo", desc: ordem?.placa_veiculo || "-", highlight: true },
    { label: "Identificação do Veículo", desc: ordem?.identificacao_veiculo || "-" }
  ];

  const statusInfo = [
    { label: "Data de Emissão", desc: formatarData(ordem?.data_emissao) },
    { label: "Data de Entrega", desc: formatarData(ordem?.data_entrega) },
    { label: "Data Programada", desc: formatarData(ordem?.data_programada) },
    { label: "Usuário Responsável", desc: usuario?.nome || "-", highlight: true },
    { label: "Status", desc: ordem?.status_nome || statusMap[ordem?.id_status] || `Status ${ordem?.id_status}` || "-", highlight: true },
    { label: "Número de Box", desc: ordem?.numero_box || "-" }
  ];

  return {
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
    recarregarDados,
    setVisualizacaoIdx
  };
};