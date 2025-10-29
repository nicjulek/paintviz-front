import React, { useState } from "react";
import { Peca } from "../../types/types";
import ColorPicker from "../ColorPicker/ColorPicker";
import PaletaModal from "../../modals/PaletaModal";
import { usePaleta } from "../../hooks/usePaleta";
import CorPaleta from "../CorPaleta/CorPaleta";
import { SidebarMenuProps } from "../../types/types";
import { Tooltip } from "../Tooltip";

const SidebarMenu: React.FC<SidebarMenuProps> = ({
    menuAberto,
    setMenuAberto,
    renderCarroceriaSelector,
    renderTipoVisualizacao,
    renderListaPecas,
    pecaSelecionada,
    pecas,
    handleSalvar,
    loading,
    handleDescartar,
    coresAplicadas,
    corSelecionada,
    handleColorChange
}) => {
    const [carroceriaOpen, setCarroceriaOpen] = useState(false);
    const [paletaOpen, setPaletaOpen] = useState(false);
    const {
        paletas,
        paletaSelecionada,
        cores,
        showPaletaModal,
        setShowPaletaModal,
        editPaletaId,
        paletaModalNome,
        paletaModalCores,
        handleNovaPaleta,
        handleEditarPaleta,
        handleSalvarPaletaModal,
        handleEscolherPaleta
    } = usePaleta();

    return (
        <div
            className={`transition-width`}
            style={{
                width: menuAberto ? 420 : 80,
                minWidth: menuAberto ? 420 : 80,
                transition: 'width 0.3s',
                zIndex: 2,
                minHeight: 0,
                overflowY: 'auto',
                background: menuAberto
                    ? 'linear-gradient(180deg, #D5C0A0 0%, #C4AE78 100%)'
                    : 'transparent',
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24
            }}
        >
            <div
                className="card border-0"
                style={{
                    background: 'transparent',
                    boxShadow: 'none',
                    borderRadius: 24
                }}
            >
                <div className="card-header bg-paintviz-brown text-paintviz-light p-0 rounded-top-4 shadow-sm">
                    <div className="d-flex align-items-center justify-content-between rounded-top-4 px-3 py-2">
                        {menuAberto && (
                                <h5 className="mb-0" style={{ letterSpacing: 1 }}>🎨 Controles de Pintura</h5>
                        )}
                            <button
                                className="btn btn-light btn-sm border"
                                style={{
                                    backgroundColor: '#5A402A',
                                    color: '#fff',
                                    borderColor: '#fff',
                                    boxShadow: '0 2px 8px #5a402a22'
                                }}
                                onClick={() => setMenuAberto(!menuAberto)}
                                title={menuAberto ? "Esconder menu" : "Mostrar menu"}
                            >
                                {menuAberto ? (
                                    <span className="fs-5">&#x25C0;</span>
                                ) : (
                                    <span className="fs-5">&#x25B6;</span>
                                )}
                            </button>
                    </div>
                </div>
                {menuAberto && (
                    <div className="card-body px-3 py-4" style={{ background: "transparent" }}>
                        {/* Paleta & Peças */}
                        <div className="mb-3">
                            <Tooltip helpText="Gerencie paletas e selecione peças para pintar.">
                                <button
                                    className={`btn w-100 mb-2 text-start border-0 shadow-sm d-flex align-items-center justify-content-between ${paletaOpen ? "bg-paintviz-brown text-light" : "bg-paintviz-light text-paintviz-brown"}`}
                                    type="button"
                                    onClick={() => setPaletaOpen(!paletaOpen)}
                                    aria-expanded={paletaOpen}
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '1.08rem',
                                        borderRadius: '0.7rem',
                                        transition: 'background 0.3s, color 0.3s'
                                    }}
                                >
                                    <span><i className="bi bi-palette me-2"></i>Paleta & Peças</span>
                                    <span style={{ transition: 'transform 0.3s' }}>
                                        {paletaOpen ? <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>▲</span> : "▼"}
                                    </span>
                                </button>
                            </Tooltip>
                            {paletaOpen && (
                                <div className="fade-in">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Paleta de Cores:</label>
                                        <div className="mb-3">
                                            <div className="d-flex gap-2 mb-2">
                                                <Tooltip helpText="Criar nova paleta personalizada.">
                                                    <button
                                                        className="btn btn-sm d-flex align-items-center px-3 py-2 shadow-sm w-100"
                                                        onClick={handleNovaPaleta}
                                                        style={{
                                                            backgroundColor: '#393125ec',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            borderRadius: '0.5rem',
                                                            boxShadow: '0 2px 8px #c4ae7844',
                                                            border: 'none',
                                                            minWidth: 0,
                                                            flex: 1
                                                        }}
                                                    >
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                        Criar Paleta
                                                    </button>
                                                </Tooltip>
                                                <Tooltip helpText="Editar paleta selecionada.">
                                                    <button
                                                        className="btn btn-info btn-sm d-flex align-items-center px-3 py-2 shadow-sm w-100"
                                                        onClick={handleEditarPaleta}
                                                        disabled={!paletaSelecionada}
                                                        style={{
                                                            backgroundColor: '#393125ec',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            borderRadius: '0.5rem',
                                                            boxShadow: '0 2px 8px #c4ae7844',
                                                            border: 'none',
                                                            minWidth: 0,
                                                            flex: 1
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil-square me-2"></i>
                                                        Editar Paleta
                                                    </button>
                                                </Tooltip>
                                            </div>
                                            <div className="mb-2 position-relative">
                                                <Tooltip helpText="Escolha uma paleta existente.">
                                                    <select
                                                        className="form-select form-select-sm w-100"
                                                        style={{
                                                            width: '100%',
                                                            maxWidth: '100%',
                                                            borderRadius: '0.5rem',
                                                            boxShadow: '0 1px 4px #c4ae7822',
                                                            minWidth: 0,
                                                            flex: 1,
                                                            paddingRight: '2.5rem',
                                                            appearance: 'none',
                                                            backgroundImage: 'none'
                                                        }}
                                                        value={paletaSelecionada ?? ""}
                                                        onChange={e => handleEscolherPaleta(Number(e.target.value))}
                                                    >
                                                        <option value="" disabled>Escolha uma paleta</option>
                                                        {paletas.map(p => (
                                                            <option key={p.id_paleta} value={p.id_paleta}>
                                                                {p.nome_paleta}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Tooltip>
                                                <div
                                                    className="position-absolute top-50 translate-middle-y"
                                                    style={{
                                                        right: '12px',
                                                        pointerEvents: 'none',
                                                        color: '#6c757d',
                                                        fontSize: '0.9rem',
                                                        zIndex: 10
                                                    }}
                                                >
                                                    <i className="bi bi-chevron-down"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <PaletaModal
                                            show={showPaletaModal}
                                            onClose={() => setShowPaletaModal(false)}
                                            onSave={handleSalvarPaletaModal}
                                            initialNome={paletaModalNome}
                                            initialCores={paletaModalCores}
                                            isEdit={!!editPaletaId}
                                        />
                                        <Tooltip helpText="Clique em uma cor para selecioná-la.">
                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                {paletaSelecionada && cores.map(cor => (
                                                    <Tooltip key={cor.id_cor} helpText={`${cor.nome_cor} - ${cor.cod_cor}`}>
                                                        <div
                                                            style={{
                                                                border: '2px solid #222',
                                                                borderRadius: '8px',
                                                                width: '40px',
                                                                height: '40px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: corSelecionada === cor.cod_cor ? '0 2px 8px #6b422644' : 'none',
                                                                cursor: 'pointer',
                                                                background: 'transparent', 
                                                                padding: 0 
                                                            }}
                                                            onClick={() => handleColorChange(cor.cod_cor)}
                                                            title={cor.nome_cor}
                                                        >
                                                            <CorPaleta corQuadrado={cor.cod_cor} />
                                                        </div>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </Tooltip>
                                        <div className="d-flex justify-content-center mb-3">
                                            <Tooltip helpText="Seletor de cor personalizada.">
                                                <ColorPicker
                                                    value={corSelecionada}
                                                    onColorChange={handleColorChange}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div>
                                        <Tooltip helpText="Lista de peças disponíveis para pintar.">
                                            {renderListaPecas()}
                                        </Tooltip>
                                    </div>
                                    {pecaSelecionada && (
                                        <Tooltip helpText="Peça atualmente selecionada.">
                                            <div className="alert alert-info mt-2">
                                                <i className="bi bi-brush me-2"></i>
                                                {pecas.find((p: Peca) => p.id_svg === pecaSelecionada)?.nome_peca}
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Opções de Carrocerias */}
                        <div className="mb-3">
                            <Tooltip helpText="Escolha modelo e ângulo de visualização.">
                                <button
                                    className={`btn w-100 mb-2 text-start border-0 shadow-sm d-flex align-items-center justify-content-between ${carroceriaOpen ? "bg-paintviz-brown text-light" : "bg-paintviz-light text-paintviz-brown"}`}
                                    type="button"
                                    onClick={() => setCarroceriaOpen(!carroceriaOpen)}
                                    aria-expanded={carroceriaOpen}
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '1.08rem',
                                        borderRadius: '0.7rem',
                                        transition: 'background 0.3s, color 0.3s'
                                    }}
                                >
                                    <span><i className="bi bi-truck me-2"></i>Opções de Carroceria</span>
                                    <span style={{ transition: 'transform 0.3s' }}>
                                        {carroceriaOpen ? <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>▲</span> : "▼"}
                                    </span>
                                </button>
                            </Tooltip>
                            <div
                                style={{
                                    maxHeight: carroceriaOpen ? 500 : 0,
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)'
                                }}
                            >
                                {carroceriaOpen && (
                                    <div className="mb-4 pb-2 fade-in" >
                                        <Tooltip helpText="Selecione o modelo de carroceria.">
                                            {renderCarroceriaSelector()}
                                        </Tooltip>
                                        <Tooltip helpText="Altere o ângulo de visualização.">
                                            {renderTipoVisualizacao()}
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </div>
                                                <div className="d-flex gap-2 mt-4">
                            <div style={{ flex: 1 }}>
                                <Tooltip helpText="Salvar trabalho de pintura atual.">
                                    <button
                                        className="btn btn-success border-0 shadow-sm d-flex align-items-center justify-content-center w-100"
                                        onClick={handleSalvar}
                                        disabled={loading}
                                        style={{
                                            background: loading ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            padding: "10px 20px",
                                            boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
                                        }}
                                    >
                                        <i className="bi bi-check-circle"></i>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                                                <span className="ms-2">Salvando...</span>
                                            </>
                                        ) : <span className="ms-2">Salvar Pintura</span>}
                                    </button>
                                </Tooltip>
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <Tooltip helpText="Descartar alterações de cor.">
                                    <button
                                        className="btn btn-danger border-0 shadow-sm d-flex align-items-center justify-content-center w-100"
                                        onClick={handleDescartar}
                                        disabled={loading || Object.keys(coresAplicadas).length === 0}
                                        style={{
                                            border: "none",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            padding: "10px 20px"
                                        }}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                        <span className="ms-2">Descartar</span>
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>
                {`
                .fade-in {
                    animation: fadeIn 0.4s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                `}
            </style>
        </div>
    );
};

export default SidebarMenu;