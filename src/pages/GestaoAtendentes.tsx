import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import InputGenerico from '../components/InputGenerico/InputGenerico';
import CadastroAtendenteModal from '../modals/CadastroAtendenteModal';
import { useAtendentes } from '../hooks/useAtendentes';

const GestaoAtendentes: React.FC = () => {
    const {
        carregando,
        erro,
        termoPesquisa,
        modalOpen,
        modalId,
        atendentesFiltrados,
        buscarUsuarios,
        handlePesquisaChange,
        handleCadastrarAtendente,
        handleEditar,
        handleExcluir,
        handleCloseModal
    } = useAtendentes();

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 fw-bold text-center" style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}>
                <i className="bi bi-people-fill me-2"></i>
                Gestão de Atendentes
            </h2>
            <div className="card p-4 rounded-4 shadow-lg" style={{
                backgroundColor: '#D5C0A0',
                border: 'none',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0 fs-5 fw-bold" style={{ color: '#6d4c1c' }}>
                        <i className="bi bi-person-lines-fill me-2"></i>
                        Atendentes
                    </h3>
                    <div className="d-flex align-items-end gap-2">
                        <div style={{ minWidth: 0 }}>
                            <InputGenerico
                                titulo=""
                                placeholder="Pesquisar..."
                                valor={termoPesquisa}
                                onChange={handlePesquisaChange}
                                type="text"
                            />
                        </div>
                        <button
                            className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
                            onClick={handleCadastrarAtendente}
                            style={{
                                transition: 'box-shadow 0.2s',
                                minWidth: '180px',
                                height: '40px'
                            }}
                            onMouseEnter={e => e.currentTarget.classList.add('shadow')}
                            onMouseLeave={e => e.currentTarget.classList.remove('shadow')}
                        >
                            <i className="bi bi-person-plus-fill"></i>
                            Cadastrar Atendente
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover bg-white rounded-3 overflow-hidden shadow-sm">
                        <thead>
                            <tr>
                                <th className="p-3 text-secondary">Nome</th>
                                <th className="p-3 text-end text-secondary">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carregando ? (
                                <tr>
                                    <td colSpan={2} className="text-center p-5">
                                        <div className="spinner-border text-warning" role="status"></div>
                                        <span className="ms-2 text-muted">Carregando...</span>
                                    </td>
                                </tr>
                            ) : erro ? (
                                <tr>
                                    <td colSpan={2} className="text-center p-5 text-danger">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {erro}
                                    </td>
                                </tr>
                            ) : atendentesFiltrados.length > 0 ? (
                                atendentesFiltrados.map((atendente, index) => (
                                    <tr key={atendente.id_usuario || index}>
                                        <td className="p-3 fw-medium">{atendente.nome}</td>
                                        <td className="p-3">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-secondary btn-sm shadow-sm d-flex align-items-center gap-2"
                                                    onClick={() => handleEditar(atendente)}
                                                    style={{ transition: 'box-shadow 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.classList.add('shadow')}
                                                    onMouseLeave={e => e.currentTarget.classList.remove('shadow')}
                                                >
                                                    <i className="bi bi-pencil-fill"></i>
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm shadow-sm d-flex align-items-center gap-2"
                                                    onClick={() => handleExcluir(atendente.id_usuario)}
                                                    style={{ transition: 'box-shadow 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.classList.add('shadow')}
                                                    onMouseLeave={e => e.currentTarget.classList.remove('shadow')}
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center p-3 text-muted">
                                        <i className="bi bi-emoji-frown me-2"></i>
                                        Nenhum atendente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <CadastroAtendenteModal
                show={modalOpen}
                onClose={handleCloseModal}
                onSuccess={buscarUsuarios}
                id={modalId}
            />
        </div>
    );
};

export default GestaoAtendentes;