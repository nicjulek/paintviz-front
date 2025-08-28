import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carroceria } from "../types/types";
import InputGenerico from "../components/InputGenerico/InputGenerico";
import Button from "../components/Button/Button";

export default function GestaoModelos() {
  const [modelos, setModelos] = useState<Carroceria[]>([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Carroceria[]>("http://localhost:3000/carroceria") 
      .then((res) => setModelos(res.data))
      .catch((err) => console.error("Erro ao buscar modelos:", err));
  }, []);

  const excluirModelo = async (id?: number) => {
    if (!id) return;
    if (window.confirm("Tem certeza que deseja excluir este modelo?")) {
      try {
        await axios.delete(`http://localhost:3000/carroceria/${id}`);
        setModelos((prev) => prev.filter((m) => m.id_carroceria !== id));
      } catch (err) {
        console.error("Erro ao excluir modelo:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Gestão de Modelos</h2>

      <div className="bg-[#d3b991] rounded-xl shadow-lg p-4">
        <div className="flex justify-between mb-4">
          <InputGenerico
          titulo=''
          type="text"
          placeholder="Pesquisar..."
          valor={busca}
          onChange={(valor) => setBusca(valor)}
        />
          <Button
            texto="Cadastrar Modelo"
            onClick={() => navigate("/cadastromodelo")}
            cor="primary"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          />
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Nome</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {modelos
              .filter((m) =>
                m.nome_modelo.toLowerCase().includes(busca.toLowerCase())
              )
              .map((modelo) => (
                <tr key={modelo.id_carroceria} className="border-b">
                  <td className="p-2">{modelo.nome_modelo}</td>
                  <td className="p-2">
                    <Button
                      texto="Editar"
                      cor="primary"
                      onClick={() =>
                        navigate(`/editar-modelo/${modelo.id_carroceria}`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    />
                    <Button
                      texto="Excluir"
                      cor="danger"
                      onClick={() => excluirModelo(modelo.id_carroceria)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
