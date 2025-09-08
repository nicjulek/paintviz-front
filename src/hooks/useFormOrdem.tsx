import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export function useFormOrdem() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [statusList, setStatusList] = useState<any[]>([]);
    const [form, setForm] = useState({
        id_cliente: "",
        id_usuario_responsavel: "",
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
        const idPintura = localStorage.getItem("id_pintura");
        setBloqueado(!idPintura);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleVoltar = () => {
        const idPintura = localStorage.getItem("id_pintura");
        if (idPintura && idPintura !== "undefined" && idPintura !== "") {
            navigate(`/pintura?id_pintura=${idPintura}`);
        } else {
            navigate("/pintura");
        }
    };

    // ...existing code...
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

        // Sempre envia os campos preenchidos ou data do dia
        payload.identificacao_veiculo = form.identificacao_veiculo;
        payload.data_emissao = form.data_emissao && form.data_emissao.trim() !== "" ? form.data_emissao : dataHoje;
        payload.data_entrega = form.data_entrega && form.data_entrega.trim() !== "" ? form.data_entrega : dataHoje;
        payload.data_programada = form.data_programada && form.data_programada.trim() !== "" ? form.data_programada : dataHoje;
        payload.placa_veiculo = form.placa_veiculo;
        payload.numero_box = form.numero_box && form.numero_box.trim() !== "" ? form.numero_box : null;

        console.log("Payload enviado para o backend:", payload);

        try {
            await axios.post(`${API_URL}/ordem-servico`, payload);
            alert("Ordem de serviço cadastrada com sucesso!");
            localStorage.removeItem("id_pintura");
            navigate("/galeria");
        } catch (err: any) {
            setError(err.response?.data?.error || "Erro ao cadastrar ordem de serviço.");
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
        isPreOrdem
    };
}