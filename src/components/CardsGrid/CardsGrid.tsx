import React from "react";
import CardOrdem from "../CardOrdem/CardOrdem";
import { getStatusNome } from "../../hooks/useGaleria";
import { CardsGridProps } from "../../types/types";

const CardsGrid: React.FC<CardsGridProps> = ({ ordens, openStatusModal, openPrioriModal }) => (
  <div className="row gx-4 gy-4 justify-content-center" style={{ marginLeft: 0, marginRight: 0 }}>
    {ordens.map(ordem => (
      <div
        className="col-12 col-sm-10 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
        key={ordem.id_ordem_servico}
        style={{ minWidth: 260, maxWidth: 420, width: "100%" }}
      >
        <CardOrdem
          id_ordem_servico={ordem.id_ordem_servico}
          placa_veiculo={ordem.placa_veiculo}
          status={getStatusNome(ordem.id_status)}
          nome_cliente={
            ordem.cliente?.pessoa_fisica?.nome ||
            ordem.cliente?.pessoa_juridica?.empresa ||
            ordem.nome_cliente ||
            ""
          }
          data_entrega={ordem.data_entrega}
          id_pintura={ordem.id_pintura}
          onAlterarStatus={() => openStatusModal(ordem)}
          onAlterarPrioridade={() => openPrioriModal(ordem)}
        />
      </div>
    ))}
  </div>
);

export default CardsGrid;