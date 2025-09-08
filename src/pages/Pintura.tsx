import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import SidebarMenu from "../components/SidebarMenu/SidebarMenu";
import CanvasArea from "../components/CanvasArea/CanvasArea";
import { usePintura } from "../hooks/usePintura";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

const Pintura: React.FC = () => {
  const query = useQuery();
  const idPintura = query.get("id_pintura");
  const navigate = useNavigate();
  const {
    canvasRef,
    canvasContainerRef,
    carroceriaSelecionada,
    setCarroceriaSelecionada,
    pecas,
    pecaSelecionada,
    coresAplicadas,
    setCoresAplicadas,
    tipoVisualizacao,
    setTipoVisualizacao,
    cores,
    setCores,
    corSelecionada,
    loading,
    error,
    menuAberto,
    setMenuAberto,
    handleSalvar,
    handleDescartar,
    renderCarroceriaSelector,
    renderTipoVisualizacao,
    renderPaletaCores,
    renderListaPecas,
    handleColorChange
  } = usePintura(navigate);

  // Restaurar pintura pelo id_pintura
  useEffect(() => {
    if (idPintura && idPintura !== "undefined" && idPintura !== "") {
      axios.get(`${API_URL}/pinturas/${idPintura}`)
        .then(res => {
          const pintura = res.data;
          if (pintura.carroceria) setCarroceriaSelecionada(pintura.carroceria);
          if (pintura.cores_aplicadas) setCoresAplicadas(pintura.cores_aplicadas);
          if (pintura.tipo_visualizacao) setTipoVisualizacao(pintura.tipo_visualizacao);
        })
        .catch(() => {
          // Se não encontrar pintura, apenas ignora e segue fluxo normal
        });
    }
  }, [idPintura, setCarroceriaSelecionada, setCoresAplicadas, setTipoVisualizacao]);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        minHeight: '100vh',
        background: 'var(--paintviz-light)'
      }}
    >
      <div className="flex-grow-1 d-flex flex-row">
        <SidebarMenu
          menuAberto={menuAberto}
          setMenuAberto={setMenuAberto}
          renderCarroceriaSelector={renderCarroceriaSelector}
          renderTipoVisualizacao={renderTipoVisualizacao}
          renderPaletaCores={renderPaletaCores}
          renderListaPecas={renderListaPecas}
          pecaSelecionada={pecaSelecionada}
          pecas={pecas}
          handleSalvar={handleSalvar}
          loading={loading}
          handleDescartar={handleDescartar}
          coresAplicadas={coresAplicadas}
          cores={cores}
          setCores={setCores}
          corSelecionada={corSelecionada}
          handleColorChange={handleColorChange}
        />

        <CanvasArea
          carroceriaSelecionada={carroceriaSelecionada}
          tipoVisualizacao={tipoVisualizacao}
          setTipoVisualizacao={setTipoVisualizacao}
          canvasContainerRef={canvasContainerRef}
          canvasRef={canvasRef}
          error={error}
        />

      </div>
    </div>
  );
};

export default Pintura;