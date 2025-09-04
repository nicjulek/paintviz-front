import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import CardOrdem from "../CardOrdem/CardOrdem";
import { CardOrdemProps } from '../types/types';

interface StatusOption {
    value: string;
    label: string;
}

const Galeria: React.FC = () => {
    const [ordens, setOrdens] = useState<CardOrdemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchStatusOptions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/status');
                const options = response.data.map((s: { id_status: number, descricao: string }) => ({
                    value: String(s.id_status),
                    label: s.descricao
                }));
                setStatusOptions(options);
            } catch (err) {
                console.error("Erro ao buscar opções de status:", err);
            }
        };
        fetchStatusOptions();
    }, []);

    useEffect(() => {
        const fetchOrdens = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedStatus) {
                    params.append('status', selectedStatus.value);
                }
                if (searchTerm) {
                    params.append('nomeCliente', searchTerm);
                }
                const queryString = params.toString();
                
                const url = `http://localhost:3000/ordens-servico/galeria${queryString ? `?${queryString}` : ''}`;

                const response = await axios.get(url);
                setOrdens(response.data);
            } catch (err) {
                console.error("Erro ao buscar ordens de serviço:", err);
                setError("Não foi possível carregar as ordens de serviço.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrdens();
    }, [selectedStatus, searchTerm]); 

    if (error) {
        return <div className="container mt-5 text-center"><h2 className="text-danger">{error}</h2></div>;
    }

return (
    <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 container mt-4">
            <h1 className="mb-4">Galeria de Ordens de Serviço</h1>

            <div className="row mb-4 align-items-end">
                <div className="col-md-4">
                    <label htmlFor="status-filter" className="form-label">Filtrar por Status</label>
                    <Select
                        id="status-filter"
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={(option) => setSelectedStatus(option)}
                        placeholder="Todos os status"
                        isClearable
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="name-search" className="form-label">Pesquisar por Nome do Cliente</label>
                    <input
                        type="text"
                        id="name-search"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Digite o nome do cliente..."
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center"><h2>Carregando Ordens...</h2></div>
            ) : error ? (
                <div className="alert alert-danger text-center">
                    <strong>Erro:</strong> {error}
                </div>
            ) : (
                <div className="row">
                    {ordens.length > 0 ? (
                        ordens.map((ordem) => (
                            <div className="col-lg-6 col-md-12" key={ordem.idordem}>
                                <CardOrdem {...ordem} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>Nenhuma ordem de serviço encontrada com os filtros aplicados.</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    </div>
);}

export default Galeria;