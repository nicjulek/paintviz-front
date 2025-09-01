import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import CardOrdem from "../CardOrdem/CardOrdem";
import { CardOrdemProps } from '../types/types';

const Galeria: React.FC = () => {
    // Estado para guardar as ordens, o status de carregamento e possíveis erros
    const [ordens, setOrdens] = useState<CardOrdemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrdens = async () => {
            try {
                const response = await axios.get('http://localhost:3000/ordens-servico');
                setOrdens(response.data);
            } catch (err) {
                console.error("Erro ao buscar ordens de serviço:", err);
                setError("Não foi possível carregar as ordens de serviço.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrdens();
    }, []); 

    if (loading) {
        return <div className="container mt-5 text-center"><h2>Carregando...</h2></div>;
    }

    if (error) {
        return <div className="container mt-5 text-center"><h2 className="text-danger">{error}</h2></div>;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1 container mt-4">
                <h1 className="mb-4">Galeria de Ordens de Serviço</h1>
                <div className="row">
                    {ordens.length > 0 ? (
                        ordens.map((ordem) => (
                            <div className="col-lg-6 col-md-12" key={ordem.idordem}>
                                <CardOrdem {...ordem} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>Nenhuma ordem de serviço encontrada.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Galeria;