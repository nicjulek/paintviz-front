import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import CardInfo from "../components/CardInfo/CardInfo";
import Button from "../components/Button/Button";
import Modal from 'react-modal'; 
import FormularioOrdem from "../components/FormularioOrdem/FormularioOrdem";


const Ordem: React.FC = () => {

    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate(); 

    const [ordem, setOrdem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchOrdem = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/ordens-servico/${id}/detalhes`);
            setOrdem(response.data);
        } catch (err) {
            setError("Não foi possível carregar os dados da ordem de serviço.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrdem();
    }, [fetchOrdem]);

    const handleUpdateSuccess = () => {
        setIsEditModalOpen(false); // Fecha o modal
        fetchOrdem(); // Recarrega os dados da página
    };

    if (loading) {
        return <div className="text-center"><h2>Carregando...</h2></div>;
    }

    if (error || !ordem) {
        return <div className="text-center text-danger"><h2>{error || "Ordem não encontrada."}</h2></div>;
    }

    // Estruturando os dados para os cards
    const productImages = [
        { svg: ordem.pintura_svg_lateral, label: 'Lateral' },
        { svg: ordem.pintura_svg_traseira, label: 'Traseira' },
        { svg: ordem.pintura_svg_diagonal, label: 'Diagonal' },
    ];

    const cardsData = [
        {
            titulo: "Informações do Cliente",
            informacoes: [
                { label: "Cliente", desc: ordem.cliente_nome },
                { label: ordem.cliente_cpf ? "CPF" : "CNPJ", desc: ordem.cliente_cpf || ordem.cliente_cnpj },
                { label: "E-mail", desc: ordem.cliente_email },
                { label: "Telefone", desc: ordem.cliente_celular },
            ],
        },
        {
            titulo: "Detalhes do Veículo",
            informacoes: [
                { label: "Modelo do Veículo", desc: ordem.modelo_veiculo },
                { label: "Placa do Veículo", desc: ordem.placa_veiculo || "N/A" },
                { label: "Identificação do Veículo", desc: ordem.identificacao_veiculo || "N/A" },
            ],
        },
        {
            titulo: "Datas e Status",
            informacoes: [
                { label: "Data de Emissão", desc: new Date(ordem.data_emissao).toLocaleDateString('pt-BR') },
                { label: "Data de Entrega", desc: ordem.data_entrega ? new Date(ordem.data_entrega).toLocaleDateString('pt-BR') : "Pendente" },
                { label: "Data Programada", desc: ordem.data_programada ? new Date(ordem.data_programada).toLocaleDateString('pt-BR') : "Não definida" },
                { label: "Usuário Responsável", desc: ordem.usuario_responsavel },
                { label: "Status", desc: ordem.status_descricao },
                { label: "Número do Box", desc: ordem.numero_box || "N/A" },
            ],
        },
    ];

    const handleProxImg = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    const handleVoltaImg = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    const handleVoltar = () => navigate('/galeria'); // Navega de volta para a galeria
    const handleEditarPintura = () => console.log('Editar Pintura');
    const handleRelatorio = () => console.log('Gerar Relatório');

    const handleEditar = () => {
        setIsEditModalOpen(true); // Abre o modal
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1">
                <div className="container p-4">
                    <div className="row">
                        <div className="col-md-6">
                            {/* Card de Informações */}
                            <div className="card rounded-4 h-100 p-3 shadow">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h2 className="card-title mb-0">Ordem de Serviço #{id}</h2>
                                        <Button texto="Voltar" onClick={handleVoltar} cor="outline-secondary" icone={<i className="bi bi-arrow-left"></i>}/>
                                    </div>
                                    <div className="d-flex flex-column gap-3 mt-4">
                                        {cardsData.map((card, index) => (
                                            <CardInfo key={index} titulo={card.titulo} informacoes={card.informacoes} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* Card da Pintura */}
                            <div className="card rounded-4 h-100 p-3 shadow">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h2 className="card-title mb-0">{ordem.carroceria_nome} - {productImages[currentImageIndex].label}</h2>
                                    <div className="d-flex align-items-center justify-content-center flex-grow-1">
                                        <div
                                            style={{ height: 'auto', maxHeight: '400px', width: '100%' }}
                                            dangerouslySetInnerHTML={{ __html: productImages[currentImageIndex].svg }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center my-3">
                                        {/* Botões de Navegação de Imagem */}
                                        <Button
                                            texto=""
                                            onClick={handleVoltaImg}
                                            cor="light"
                                            icone={<i className="bi bi-arrow-left-circle-fill fs-4"></i>}
                                            className="me-2"
                                        />
                                        <Button
                                            texto=""
                                            onClick={handleProxImg}
                                            cor="light"
                                            icone={<i className="bi bi-arrow-right-circle-fill fs-4"></i>}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                        <Button
                                            texto="Editar Ordem"
                                            onClick={handleEditar}
                                            cor="success" 
                                            icone={<i className="bi bi-pencil-square"></i>}
                                            className="me-2"
                                        />
                                        <Button
                                            texto="Editar Pintura"
                                            onClick={handleEditarPintura}
                                            cor="primary"
                                            className="me-2"
                                        />
                                        <Button
                                            texto="Gerar Relatório"
                                            onClick={handleRelatorio}
                                            cor="primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    contentLabel="Editar Ordem de Serviço"
                >
                    <FormularioOrdem idDaOrdemParaEditar={id} 
                    onUpdateSuccess={handleUpdateSuccess} />
                </Modal>
            </main>
        </div>
    );
    /*const productImages = [
        'https://via.placeholder.com/600x400/87CEFA/000000?text=Imagem+do+Produto+1',
        'https://via.placeholder.com/600x400/FFA07A/000000?text=Imagem+do+Produto+2',
        'https://via.placeholder.com/600x400/90EE90/000000?text=Imagem+do+Produto+3'
    ];

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const cardsData = [
      {
        titulo: "Informações do Cliente",
        informacoes: [
          { label: "Cliente", desc: "João da Silva" },
          { label: "CPF", desc: "000.000.000-00" },
          { label: "E-mail", desc:"joao.silva@ex.com" },
          { label: "Telefone", desc: "(00)0000-0000" },
        ],
      },
      {
        titulo: "Detalhes do Veículo",
        informacoes: [
          { label: "Modelo do Veículo", desc: "Scania" },
          { label: "Placa do Veículo", desc: "ABC1234" },
          { label: "Identificação do Veículo", desc: "XYZ789012345" },
        ],
      },
      {
        titulo: "Datas a Status",
        informacoes: [
          { label: "Data de Emissão", desc: "01/05/2025" },
          { label: "Data de Entrega", desc:"22/05/2025" },
          { label: "Data Programada", desc: "22/05/2025" },
          { label: "Usuário", desc: "Maria da Silva" },
          { label: "Status", desc: "Em produção" },
          { label: "Número do Box", desc: "02" },
        ],
      },
    ];

    const handleProxImg = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
    };

    const handleVoltaImg = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length);
    };

    const handleVoltar = () => {
        console.log('Voltar para a página anterior');
    };

    const handleEditar = () => {
        console.log('Editar Pintura');
    };

    const handleRelatorio = () => {
        console.log('Gerar Relatório');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1">
                <div className="container p-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card rounded-4 h-100 p-3 shadow">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h2 className="card-title mb-0">Ordem de Serviço</h2>
                                        <Button
                                            texto="Voltar"
                                            onClick={handleVoltar}
                                            cor="outline-secondary"
                                            icone={<i className="bi bi-arrow-left"></i>}
                                        />
                                    </div>
                                    <div className="d-flex flex-column gap-3 mt-4">
                                        {cardsData.map((card, index) => (
                                            <CardInfo
                                                key={index}
                                                titulo={card.titulo}
                                                informacoes={card.informacoes}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card rounded-4 h-100 p-3 shadow">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h2 className="card-title mb-0">Boiadeira</h2>
                                    <img
                                        src={productImages[currentImageIndex]}
                                        alt="Imagem do Produto"
                                        className="img-fluid rounded"
                                        style={{ height: 'auto', maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                                    />
                                    <div className="d-flex justify-content-center my-3">
                                        <Button
                                            texto=""
                                            onClick={handleVoltaImg}
                                            cor="light"
                                            icone={<i className="bi bi-arrow-left-circle-fill"></i>}
                                            className="me-2"
                                        />
                                        <Button
                                            texto=""
                                            onClick={handleProxImg}
                                            cor="light"
                                            icone={<i className="bi bi-arrow-right-circle-fill"></i>}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                        <Button
                                            texto="Editar Pintura"
                                            onClick={handleEditar}
                                            cor="primary"
                                            className="me-2"
                                        />
                                        <Button
                                            texto="Gerar Relatório"
                                            onClick={handleRelatorio}
                                            cor="primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );*/
};

export default Ordem;