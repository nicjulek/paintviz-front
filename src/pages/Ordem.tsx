import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import CardInfo from "../components/CardInfo/CardInfo";
import { Container, Row, Col, Card } from 'react-bootstrap';
import Button from "../components/Button/Button";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const Ordem: React.FC = () => {

    const productImages = [
        'https://via.placeholder.com/600x400/87CEFA/000000?text=Imagem+do+Produto+1',
        'https://via.placeholder.com/600x400/FFA07A/000000?text=Imagem+do+Produto+2',
        'https://via.placeholder.com/600x400/90EE90/000000?text=Imagem+do+Produto+3'
    ];

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    //exemplos para o CardItem
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
                <Container className="p-4">
                    <Row>
                        <Col md={6}>
                            <Card className="rounded-4 h-100 p-3 shadow">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Card.Title as="h2" className="mb-0">Ordem de Serviç<option value=""></option></Card.Title>
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
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="rounded-4 h-100 p-3 shadow">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                        <Card.Title as="h2" className="mb-0">Boiadeira</Card.Title>
                                        <img

                                        //PLACEHOLDER DA IMAGEM
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
                                            icone=""
                                            className="me-2"
                                        />
                                        <Button
                                            texto=""
                                            onClick={handleProxImg}
                                            cor="light"
                                            icone=""
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
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
        );
};

export default Ordem;