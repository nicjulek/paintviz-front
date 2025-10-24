import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export function useFormOrdem() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [statusList, setStatusList] = useState<any[]>([]);
    
    // Obter usuário logado apenas uma vez na inicialização
    const getUsuarioLogado = () => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    };

    const usuarioLogado = getUsuarioLogado();

    const [form, setForm] = useState({
        id_cliente: "",
        id_usuario_responsavel: usuarioLogado?.id ? String(usuarioLogado.id) : "",
        modelo_veiculo: "",
        placa_veiculo: "",
        identificacao_veiculo: "",
        data_emissao: "",
        data_entrega: "",
        data_programada: "",
        status: "",
        id_pintura: localStorage.getItem("id_pintura") || "",
        numero_box: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [bloqueado, setBloqueado] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const idOrdem = params.get("id_ordem");
    const isEdicao = !!idOrdem;

    const isPreOrdem = String(form.status) === "1";

    const fetchData = async () => {
        try {
            const [clientesRes, usuariosRes, statusRes] = await Promise.all([
                axios.get(`${API_URL}/clientes`),
                axios.get(`${API_URL}/usuarios`),
                axios.get(`${API_URL}/status`)
            ]);
            setClientes(clientesRes.data);
            setUsuarios(usuariosRes.data);
            setStatusList(statusRes.data);
        } catch (err) {
            setError("Erro ao carregar dados do servidor.");
        }
    };

    useEffect(() => {
        fetchData();
        if (isEdicao) {
            setBloqueado(false); 
            axios.get(`${API_URL}/ordem-servico/${idOrdem}`)
                .then(res => {
                    const ordem = res.data;
                    setForm({
                        id_cliente: ordem.id_cliente ? String(ordem.id_cliente) : "",
                        id_usuario_responsavel: ordem.id_usuario_responsavel ? String(ordem.id_usuario_responsavel) : "",
                        modelo_veiculo: ordem.modelo_veiculo || "",
                        placa_veiculo: ordem.placa_veiculo || "",
                        identificacao_veiculo: ordem.identificacao_veiculo || "",
                        data_emissao: ordem.data_emissao ? ordem.data_emissao.slice(0, 10) : "",
                        data_entrega: ordem.data_entrega ? ordem.data_entrega.slice(0, 10) : "",
                        data_programada: ordem.data_programada ? ordem.data_programada.slice(0, 10) : "",
                        status: ordem.id_status ? String(ordem.id_status) : "",
                        id_pintura: ordem.id_pintura ? String(ordem.id_pintura) : "",
                        numero_box: ordem.numero_box || ""
                    });
                })
                .catch(() => setError("Erro ao carregar ordem para edição."));
        } else {
            const idPintura = localStorage.getItem("id_pintura");
            setBloqueado(!idPintura);
        }
    }, [isEdicao, idOrdem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleVoltar = () => {
        if (isEdicao) {
            navigate(-1);
        } else {
            localStorage.removeItem("id_pintura");
            console.log("ID da pintura removido - usuário cancelou o cadastro da ordem");
            navigate("/pintura");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dataHoje = new Date().toISOString().slice(0, 10);

    if (!isPreOrdem) {
        if (
            !form.identificacao_veiculo.trim() ||
            !form.data_entrega.trim() ||
            !form.data_programada.trim() ||
            !form.placa_veiculo.trim()
        ) {
            setError("Preencha todos os campos obrigatórios.");
            setLoading(false);
            return;
        }
    }

    const payload: any = {
        modelo_veiculo: form.modelo_veiculo,
        id_cliente: Number(form.id_cliente),
        id_usuario_responsavel: Number(form.id_usuario_responsavel),
        id_status: Number(form.status),
        id_pintura: Number(form.id_pintura),
        data_ultima_modificacao: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    payload.identificacao_veiculo = form.identificacao_veiculo;
    payload.data_emissao = form.data_emissao && form.data_emissao.trim() !== "" ? form.data_emissao : dataHoje;
    payload.data_entrega = form.data_entrega && form.data_entrega.trim() !== "" ? form.data_entrega : dataHoje;
    payload.data_programada = form.data_programada && form.data_programada.trim() !== "" ? form.data_programada : dataHoje;
    payload.placa_veiculo = form.placa_veiculo;

    if (String(form.status) === "3") {
        const numeroBoxLimpo = form.numero_box.trim();
        if (numeroBoxLimpo !== "") {
            payload.numero_box = numeroBoxLimpo;
        } else {
            setError("Número do box é obrigatório para ordem em produção.");
            setLoading(false);
            return;
        }
    }

    if (String(form.status) !== "3" && "numero_box" in payload) {
        delete payload.numero_box;
    }

    console.log("Status selecionado:", form.status);
    console.log("Payload enviado:", payload);

    try {
        if (isEdicao && idOrdem) {
            await axios.put(`${API_URL}/ordem-servico/${idOrdem}`, payload);
            alert("Ordem de serviço atualizada com sucesso!");
            navigate(-1);
        } else {
            await axios.post(`${API_URL}/ordem-servico`, payload);
            alert("Ordem de serviço cadastrada com sucesso!");
            localStorage.removeItem("id_pintura");
            navigate("/galeria");
        }
    } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao salvar ordem de serviço.");
    } finally {
        setLoading(false);
    }
};

    return {
        clientes,
        usuarios,
        showModal,
        setShowModal,
        statusList,
        form,
        setForm,
        loading,
        error,
        bloqueado,
        handleChange,
        handleVoltar,
        handleSubmit,
        fetchData,
        isPreOrdem,
        isEdicao,
        usuarioLogado
    };
}