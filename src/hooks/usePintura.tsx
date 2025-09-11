import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Canvas, loadSVGFromString, util, Group, FabricObject } from "fabric";
import axios from "axios";
import { Carroceria, Peca, UsuarioAutenticado, Cor, Paleta } from "../types/types";

export function usePintura(navigate?: (path: string) => void) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<UsuarioAutenticado | null>(null);
    const [carrocerias, setCarrocerias] = useState<Carroceria[]>([]);
    const [carroceriaSelecionada, setCarroceriaSelecionada] = useState<Carroceria | null>(null);
    const [pecas, setPecas] = useState<Peca[]>([]);
    const [pecaSelecionada, setPecaSelecionada] = useState<string | null>(null);
    const [coresAplicadas, setCoresAplicadas] = useState<{ [key: string]: string }>({});
    const [tipoVisualizacao, setTipoVisualizacao] = useState<'lateral' | 'traseira' | 'diagonal'>('lateral');
    const [cores, setCores] = useState<Cor[]>([]);
    const [paletas, setPaletas] = useState<Paleta[]>([]);
    const [paletaSelecionada, setPaletaSelecionada] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [corSelecionada, setCorSelecionada] = useState<string>('#000000');
    const [menuAberto, setMenuAberto] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    useEffect(() => {
        // Restaurar pintura anterior do localStorage ao entrar na tela de pintura
        const storedCores = localStorage.getItem("coresAplicadas");
        const storedCarroceria = localStorage.getItem("carroceriaSelecionada");
        const storedTipoVisualizacao = localStorage.getItem("tipoVisualizacao");

        if (storedCores) setCoresAplicadas(JSON.parse(storedCores));
        if (storedCarroceria) setCarroceriaSelecionada(JSON.parse(storedCarroceria));
        if (storedTipoVisualizacao) setTipoVisualizacao(storedTipoVisualizacao as 'lateral' | 'traseira' | 'diagonal');

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        carregarDados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function resizeCanvas() {
            if (canvasContainerRef.current && fabricCanvasRef.current) {
                const container = canvasContainerRef.current;
                const width = Math.min(container.offsetWidth, 1100);
                const height = Math.min(container.offsetHeight, 600);
                let aspectRatio = 16 / 9;
                if (tipoVisualizacao === 'traseira') {
                    aspectRatio = 297 / 210; // Aspect ratio do SVG traseira
                }

                let canvasWidth = width;
                let canvasHeight = width / aspectRatio;
                if (canvasHeight > height) {
                    canvasHeight = height;
                    canvasWidth = height * aspectRatio;
                }

                fabricCanvasRef.current.setWidth(canvasWidth);
                fabricCanvasRef.current.setHeight(canvasHeight);

                const group = fabricCanvasRef.current.getObjects().find(obj => obj.type === 'group') as Group;
                if (group) {
                    // Para traseira, não force o zoom!
                    if (tipoVisualizacao === 'traseira') {
                        group.scaleToWidth(canvasWidth * 0.5); // Use 0.6 ou ajuste para menos zoom
                    } else {
                        group.scaleToWidth(canvasWidth * 0.9);
                    }
                    fabricCanvasRef.current.centerObject(group);
                    fabricCanvasRef.current.renderAll();
                }
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [carroceriaSelecionada, tipoVisualizacao]);

    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#f8f9fa',
                selection: false
            });

            fabricCanvasRef.current.on('selection:created', handleSelection);
            fabricCanvasRef.current.on('selection:updated', handleSelection);
            fabricCanvasRef.current.on('selection:cleared', handleSelectionCleared);
        }

        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.off('selection:created', handleSelection);
                fabricCanvasRef.current.off('selection:updated', handleSelection);
                fabricCanvasRef.current.off('selection:cleared', handleSelectionCleared);
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem("coresAplicadas", JSON.stringify(coresAplicadas));
    }, [coresAplicadas]);

    useEffect(() => {
        if (carroceriaSelecionada)
            localStorage.setItem("carroceriaSelecionada", JSON.stringify(carroceriaSelecionada));
    }, [carroceriaSelecionada]);

    useEffect(() => {
        localStorage.setItem("tipoVisualizacao", tipoVisualizacao);
    }, [tipoVisualizacao]);

    const handleSelection = (e: { selected?: fabric.Object[] }) => {
        const selectedObject = e.selected && e.selected[0];

        if (selectedObject && (selectedObject as any).data?.id) {
            const pecaId = (selectedObject as any).data.id;
            setPecaSelecionada(pecaId);

            if (selectedObject.fill && typeof selectedObject.fill === 'string') {
                setCorSelecionada(selectedObject.fill);
            }
        }
    };

    const handleSelectionCleared = () => {
        setPecaSelecionada(null);
    };

    useEffect(() => {
        if (carroceriaSelecionada && fabricCanvasRef.current) {
            carregarSvgNoCanvas();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carroceriaSelecionada, tipoVisualizacao, coresAplicadas]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError('');

            const [carroceriasRes, paletasRes] = await Promise.all([
                axios.get(`${API_URL}/carrocerias`, getAuthHeaders()),
                axios.get(`${API_URL}/paletas`, getAuthHeaders())
            ]);

            const carroceriasData: Carroceria[] = carroceriasRes.data;
            const paletasData: Paleta[] = paletasRes.data;

            setCarrocerias(carroceriasData);
            setPaletas(paletasData);

            if (carroceriasData.length > 0) {
                await selecionarCarroceria(carroceriasData[0]);
            }

            if (paletasData.length > 0 && paletasData[0].id_paleta) {
                await selecionarPaleta(paletasData[0].id_paleta);
            }

        } catch (error: any) {
            setError('Erro ao carregar dados do servidor.');
        } finally {
            setLoading(false);
        }
    };

    const selecionarCarroceria = async (carroceria: Carroceria) => {
        try {
            setLoading(true);
            setError('');
            setCarroceriaSelecionada(carroceria);

            const response = await axios.get(
                `${API_URL}/carrocerias/${carroceria.id_carroceria}/pecas`,
                getAuthHeaders()
            );

            const pecasData: Peca[] = response.data;
            setPecas(pecasData);

            const coresIniciais: { [key: string]: string } = {};
            pecasData.forEach(peca => {
                if (peca.id_svg && peca.cor_atual) {
                    coresIniciais[peca.id_svg] = peca.cor_atual;
                }
            });

            setCoresAplicadas(coresIniciais);
            setPecaSelecionada(null);

        } catch (error: any) {
            setError('Erro ao carregar peças da carroceria.');
        } finally {
            setLoading(false);
        }
    };

    const selecionarPaleta = async (id_paleta: number) => {
        try {
            setPaletaSelecionada(id_paleta);

            const response = await axios.get(
                `${API_URL}/paletas/${id_paleta}/cores`,
                getAuthHeaders()
            );

            const coresData: Cor[] = response.data;
            setCores(coresData);

        } catch (error: any) {
            setError('Erro ao carregar cores da paleta.');
        }
    };

    const carregarSvgNoCanvas = async () => {
        if (!carroceriaSelecionada || !fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        try {
            let svgString = '';
            switch (tipoVisualizacao) {
                case 'lateral':
                    svgString = carroceriaSelecionada.lateral_svg || '';
                    break;
                case 'traseira':
                    svgString = carroceriaSelecionada.traseira_svg || '';
                    break;
                case 'diagonal':
                    svgString = carroceriaSelecionada.diagonal_svg || '';
                    break;
            }

            if (!svgString) {
                canvas.clear();
                return;
            }

            canvas.clear();

            const { objects, options } = await loadSVGFromString(svgString);
            const validObjects = objects.filter((obj): obj is FabricObject => obj !== null);

            validObjects.forEach((obj: FabricObject) => {
                const objId = (obj as any).id;
                // Procura a peça cujo id_svg está contido no objId
                const peca = objId
                    ? pecas.find(p => p.id_svg && objId.toString().includes(p.id_svg.toString()))
                    : undefined;

                if (peca) {
                    // Use o id_svg da peça para buscar a cor
                    if (coresAplicadas[peca.id_svg]) {
                        obj.set('fill', coresAplicadas[peca.id_svg]);
                    }
                    (obj as any).data = { id: peca.id_svg };
                    obj.selectable = true;
                    obj.hoverCursor = 'pointer';
                    obj.lockMovementX = true;
                    obj.lockMovementY = true;
                    obj.lockScalingX = true;
                    obj.lockScalingY = true;
                    obj.lockRotation = true;
                    obj.hasControls = false;
                    obj.hasBorders = false;
                    obj.evented = true;
                } else {
                    obj.selectable = false;
                    obj.evented = false;
                }
            });

            const group = util.groupSVGElements(validObjects, options);

            if (tipoVisualizacao === 'traseira') {
                group.scaleToWidth(canvas.getWidth() * 0.4);
            } else {
                group.scaleToWidth(canvas.getWidth() * 0.9);
            }

            canvas.centerObject(group);
            group.selectable = false;
            group.evented = false;
            canvas.add(group);

            canvas.renderAll();

            if (pecaSelecionada) {
                const items = (group as Group).getObjects();
                const novaPeca = items.find((obj: any) => obj.data?.id === pecaSelecionada);
                if (novaPeca) {
                    canvas.discardActiveObject();
                    canvas.renderAll();
                }
            }
        } catch (error) {
            setError('Erro ao carregar visualização da carroceria.');
        }
    };

    const aplicarCorNaPeca = (cor: string) => {
        if (!pecaSelecionada || !fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const group = canvas.getObjects().find(obj => obj.type === 'group') as Group;
        if (group) {
            const items = group.getObjects();
            // Agora procura se o id_svg da peça está contido no id do objeto SVG
            const targetObject = items.find((obj: any) =>
                obj.data?.id && obj.data.id.toString().includes(pecaSelecionada)
            );
            if (targetObject) {
                targetObject.set('fill', cor);
                canvas.renderAll();
            }
        }

        setCoresAplicadas(prev => ({
            ...prev,
            [pecaSelecionada]: cor
        }));
    };

    const handleColorChange = (cor: string) => {
        setCorSelecionada(cor);
        if (pecaSelecionada) {
            aplicarCorNaPeca(cor);
        }
    };

    const handleSalvar = async () => {
        if (!carroceriaSelecionada || !user?.id) {
            setError('Carroceria ou usuário não selecionado corretamente.');
            return;
        }

        try {
            setLoading(true);

            let pintura_svg_lateral = carroceriaSelecionada.lateral_svg;
            let pintura_svg_traseira = carroceriaSelecionada.traseira_svg;
            let pintura_svg_diagonal = carroceriaSelecionada.diagonal_svg;

            // Função para renderizar e exportar SVG de cada visualização
            const exportSVG = async (tipo: 'lateral' | 'traseira' | 'diagonal') => {
                setTipoVisualizacao(tipo);
                await new Promise(resolve => setTimeout(resolve, 100)); // Aguarda o canvas atualizar
                return fabricCanvasRef.current ? fabricCanvasRef.current.toSVG() : '';
            };

            pintura_svg_lateral = await exportSVG('lateral');
            pintura_svg_traseira = await exportSVG('traseira');
            pintura_svg_diagonal = await exportSVG('diagonal');

            const response = await axios.post(`${API_URL}/pinturas`, {
                pintura_svg_lateral,
                pintura_svg_traseira,
                pintura_svg_diagonal,
                id_carroceria: carroceriaSelecionada.id_carroceria,
                id_usuario: user.id
            }, getAuthHeaders());

            localStorage.setItem('id_pintura', response.data.id_pintura);

            alert('Pintura salva com sucesso!');
            if (navigate) navigate('/cadastro-ordem');

        } catch (error: any) {
            setError('Erro ao salvar pintura.');
        } finally {
            setLoading(false);
        }
    };

    const handleDescartar = () => {
        const coresIniciais: { [key: string]: string } = {};
        pecas.forEach(peca => {
            if (peca.id_svg && peca.cor_inicial) {
                coresIniciais[peca.id_svg] = peca.cor_inicial;
            }
        });

        setCoresAplicadas({});
        setPecaSelecionada(null);
        setCorSelecionada('#000000');

        if (carroceriaSelecionada) {
            carregarSvgNoCanvas();
        }
    };

    // Render helpers
    const renderCarroceriaSelector = () => (
        <div className="mb-3">
            <label className="form-label fw-bold">Modelo da Carroceria:</label>
            <div className="input-group">
                <span className="input-group-text bg-white border-2 border-secondary" style={{ borderRadius: '8px 0 0 8px', borderColor: '#6b4226' }}>
                    <i className="bi bi-truck"></i>
                </span>
                <select
                    className="form-select border-1"
                    style={{
                        borderRadius: '0 8px 8px 0',
                        borderColor: '#6b4226'
                    }}
                    value={carroceriaSelecionada?.id_carroceria || ''}
                    onChange={(e) => {
                        const carroceria = carrocerias.find(c => c.id_carroceria === Number(e.target.value));
                        if (carroceria) selecionarCarroceria(carroceria);
                    }}
                >
                    <option value="">Selecione uma carroceria...</option>
                    {carrocerias.map(carroceria => (
                        <option key={carroceria.id_carroceria} value={carroceria.id_carroceria}>
                            {carroceria.nome_modelo}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const renderTipoVisualizacao = () => (
        <div className="mb-3">
            <label className="form-label fw-bold">Tipo de Visualização:</label>
            <div className="btn-group w-100" role="group">
                {(['lateral', 'traseira', 'diagonal'] as const).map(tipo => (
                    <button
                        key={tipo}
                        type="button"
                        className={`btn border-1 ${tipoVisualizacao === tipo ? 'btn-paintviz-brown text-paintviz-light' : 'btn-outline-paintviz-brown'}`}
                        style={{
                            borderColor: '#6b4226',
                            borderRadius: '8px',
                            marginRight: '8px'
                        }}
                        onClick={() => setTipoVisualizacao(tipo)}
                        disabled={
                            (tipo === 'traseira' && !carroceriaSelecionada?.traseira_svg) ||
                            (tipo === 'diagonal' && !carroceriaSelecionada?.diagonal_svg)
                        }
                    >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderPaletaCores = () => (
        <div className="mb-3">
            <label className="form-label fw-bold">Paleta de Cores:</label>
            <select
                className="form-select mb-2"
                value={paletaSelecionada || ''}
                onChange={(e) => selecionarPaleta(Number(e.target.value))}
            >
                <option value="">Selecione uma paleta...</option>
                {paletas.map(paleta => (
                    <option key={paleta.id_paleta} value={paleta.id_paleta}>
                        {paleta.nome_paleta}
                    </option>
                ))}
            </select>

            <div className="d-flex flex-wrap gap-2">
                {cores.map(cor => (
                    <button
                        key={cor.id_cor}
                        className={`btn p-2 border ${corSelecionada === cor.cod_cor ? 'border-dark border-3' : 'border-secondary'}`}
                        style={{
                            backgroundColor: cor.cod_cor,
                            width: '40px',
                            height: '40px'
                        }}
                        onClick={() => handleColorChange(cor.cod_cor)}
                        title={cor.nome_cor}
                    />
                ))}
            </div>
        </div>
    );

    const renderListaPecas = () => (
        <div className="mb-3">
            <label className="form-label fw-bold">Peças:</label>
            <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {pecas.map(peca => {
                    const corAtual = (peca.id_svg && coresAplicadas[peca.id_svg])
                        ? coresAplicadas[peca.id_svg]
                        : peca.cor_atual || '#FFFFFF';

                    return (
                        <button
                            key={peca.id_peca}
                            type="button"
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${pecaSelecionada === peca.id_svg ? 'active' : ''
                                }`}
                            onClick={() => {
                                setPecaSelecionada(peca.id_svg);
                                setCorSelecionada(corAtual);

                                if (fabricCanvasRef.current) {
                                    const canvas = fabricCanvasRef.current;
                                    const pecaObject = canvas.getObjects().find(
                                        (obj: any) => obj.data?.id === peca.id_svg
                                    );

                                    if (pecaObject) {
                                        canvas.discardActiveObject();
                                        canvas.renderAll();
                                    }
                                }
                            }}
                        >
                            <span>{peca.nome_peca}</span>
                            <div
                                className="rounded-circle border"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: corAtual
                                }}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return {
        canvasRef,
        fabricCanvasRef,
        canvasContainerRef,
        user,
        carrocerias,
        carroceriaSelecionada,
        setCarroceriaSelecionada,
        pecas,
        pecaSelecionada,
        setPecaSelecionada,
        coresAplicadas,
        setCoresAplicadas,
        tipoVisualizacao,
        setTipoVisualizacao,
        cores,
        setCores,
        paletas,
        paletaSelecionada,
        setPaletaSelecionada,
        loading,
        error,
        corSelecionada,
        setCorSelecionada,
        menuAberto,
        setMenuAberto,
        handleSalvar,
        handleDescartar,
        renderCarroceriaSelector,
        renderTipoVisualizacao,
        renderPaletaCores,
        renderListaPecas,
        handleColorChange
    }
}