import React, { useState, useEffect } from "react";
import ColorPicker from "../components/ColorPicker/ColorPicker";
import { CorInput, PaletaModalProps } from "../types/types";
import InputGenerico from "../components/InputGenerico/InputGenerico";

const PaletaModal: React.FC<PaletaModalProps> = ({
    show,
    onClose,
    onSave,
    initialNome = "",
    initialCores = [{ nome_cor: "", cod_cor: "#FFFFFF" }],
    isEdit = false
}) => {
    const [nomePaleta, setNomePaleta] = useState(initialNome);
    const [cores, setCores] = useState<CorInput[]>(initialCores);
    const [colorPickerValue, setColorPickerValue] = useState("#FFFFFF");
    const [selectedCorIdx, setSelectedCorIdx] = useState<number | null>(null);

    useEffect(() => {
        setNomePaleta(initialNome);
        setCores(initialCores);
        setColorPickerValue("#FFFFFF");
        setSelectedCorIdx(null);
    }, [initialNome, initialCores, show]);

    const handleCorChange = (index: number, value: string) => {
        const novasCores = [...cores];
        novasCores[index].nome_cor = value;
        setCores(novasCores);
    };

    const handleSelectCor = (index: number) => {
        setSelectedCorIdx(index);
        setColorPickerValue(cores[index].cod_cor);
    };

    const handleColorChange = (color: string) => {
        setColorPickerValue(color);
        if (selectedCorIdx !== null) {
            const novasCores = [...cores];
            novasCores[selectedCorIdx].cod_cor = color;
            setCores(novasCores);
        }
    };

    const handleAddCor = () => {
        setCores([...cores, { nome_cor: "", cod_cor: colorPickerValue }]);
        setSelectedCorIdx(cores.length);
    };

    const handleRemoveCor = (index: number) => {
        const novasCores = cores.filter((_, i) => i !== index);
        setCores(novasCores);
        if (selectedCorIdx === index) {
            setSelectedCorIdx(null);
        } else if (selectedCorIdx !== null && selectedCorIdx > index) {
            setSelectedCorIdx(selectedCorIdx - 1);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!nomePaleta.trim() || cores.some(c => !c.nome_cor.trim() || !c.cod_cor.trim())) {
            alert("Preencha todos os campos!");
            return;
        }
        onSave(nomePaleta, cores);
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: "block", background: "#0008" }}>
            <div className="modal-dialog modal-lg">
                <div
                    className="modal-content"
                    style={{
                        background: "#F5E3C6",
                        border: "2px solid #D2B896",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                    }}
                >
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-palette me-2"></i>
                            {isEdit ? "Editar Paleta" : "Criar Nova Paleta"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body" style={{ borderTop: "2px solid #ceaf76ff", borderBottom: "2px solid #ceaf76ff" }}>
                        <style>
                            {`
            @media (max-width: 700px) {
                .paleta-modal-flex {
                    flex-direction: column !important;
                    align-items: center !important;
                }
                .paleta-modal-colorpicker {
                    margin-left: 0 !important;
                    margin-top: 16px !important;
                    justify-content: center !important;
                    width: 100% !important;
                    display: flex !important;
                }
            }
            @media (max-width: 500px) {
                .paleta-modal-colorpicker .react-colorful {
                    width: 90vw !important;
                    height: 90vw !important;
                    max-width: 300px !important;
                    max-height: 300px !important;
                }
            }
            @media (min-width: 501px) {
                .paleta-modal-colorpicker .react-colorful {
                    width: 300px !important;
                    height: 300px !important;
                }
            }
        `}
                        </style>
                        <div className="mb-3">
                            <InputGenerico
                                titulo="Nome da Paleta"
                                placeholder="Nome da Paleta (ex: Tons Pastel)"
                                valor={nomePaleta}
                                onChange={setNomePaleta}
                            />
                        </div>
                        <label className="form-label fw-bold">
                            <i className="bi bi-droplet me-2"></i>
                            Cores da Paleta
                        </label>
                        <div className="d-flex flex-row flex-wrap paleta-modal-flex">
                            <div style={{ flex: 1, minWidth: 220 }}>
                                {cores.map((cor, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex align-items-center mb-2 bg-light rounded px-1 py-1"
                                        style={{
                                            boxShadow: "2px 2px 6px #a7a39aff",
                                            maxWidth: 400,
                                            minWidth: 0,
                                            padding: "2px 4px"
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            placeholder="Nome da Cor"
                                            value={cor.nome_cor}
                                            onChange={e => handleCorChange(idx, e.target.value)}
                                            style={{
                                                maxWidth: 300,
                                                borderRadius: "6px",
                                                border: "1px solid #D2B896"
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn p-0"
                                            style={{
                                                border: selectedCorIdx === idx ? "2px solid #007bff" : "2px solid #ccc",
                                                borderRadius: "50%",
                                                width: 32,
                                                height: 32,
                                                marginRight: 8,
                                                background: cor.cod_cor,
                                                boxShadow: selectedCorIdx === idx ? "0 0 0 2px #007bff44" : undefined
                                            }}
                                            title={cor.cod_cor}
                                            onClick={() => handleSelectCor(idx)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleRemoveCor(idx)}
                                            disabled={cores.length <= 1}
                                            title="Remover cor"
                                            style={{ borderRadius: "6px" }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                ))}
                                <div className="text-muted small mb-3" style={{ width: 400 }}>
                                    <i className="bi bi-info-circle me-1"></i>
                                    Clique na bolinha e selecione uma cor
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary mt-2 d-flex align-items-center"
                                    style={{
                                        width: 400,
                                        padding: "4px 8px",
                                        borderRadius: "8px"
                                    }}
                                    onClick={handleAddCor}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Adicionar mais cores
                                </button>
                            </div>
                            <div className="d-flex justify-content-center mb-3 paleta-modal-colorpicker" style={{ marginLeft: 0, flex: "0 0 300px" }}>
                                <div style={{
                                    boxShadow: "0 4px 16px #0000005c",
                                    borderRadius: "18px",
                                    width: "300px",
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#F5E3C6"
                                }}>
                                    <ColorPicker
                                        value={colorPickerValue}
                                        onColorChange={handleColorChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary d-flex align-items-center"
                            onClick={onClose}
                            style={{
                                background: "#93908cff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                padding: "10px 20px"
                            }}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Voltar
                        </button>
                        <button
                            type="button"
                            className="btn btn-success d-flex align-items-center"
                            onClick={handleSave}
                            style={{
                                background: "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                padding: "10px 20px",
                                boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
                            }}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaletaModal;