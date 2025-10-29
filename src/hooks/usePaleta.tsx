import { useState, useEffect } from "react";
import { Cor, Paleta } from "../types/types";
import { useAvisoModal } from "../modals/AvisoModal";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

export function usePaleta() {
  const [paletas, setPaletas] = useState<Paleta[]>([]);
  const [paletaSelecionada, setPaletaSelecionada] = useState<number | null>(null);
  const [cores, setCores] = useState<Cor[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [showPaletaModal, setShowPaletaModal] = useState(false);
  const [editPaletaId, setEditPaletaId] = useState<number | null>(null);
  const [paletaModalNome, setPaletaModalNome] = useState("");
  const [paletaModalCores, setPaletaModalCores] = useState<{ id_cor?: number, nome_cor: string, cod_cor: string }[]>([]);

  // Hook do AvisoModal
  const { modalProps, mostrarModal, mostrarSucesso, mostrarErro, fecharModal } = useAvisoModal();

  // Carregar todas as paletas ao montar
  useEffect(() => {
    fetch(`${API_URL}/paletas`)
      .then(res => res.json())
      .then(data => setPaletas(data))
      .catch(error => {
        console.error('Erro ao carregar paletas:', error);
        mostrarErro('Erro', 'Não foi possível carregar as paletas.');
      });
  }, [mostrarErro]);

  // Carregar cores da paleta selecionada
  useEffect(() => {
    if (paletaSelecionada) {
      fetch(`${API_URL}/paletas/${paletaSelecionada}/cores`)
        .then(res => res.json())
        .then(data => setCores(data))
        .catch(error => {
          console.error('Erro ao carregar cores da paleta:', error);
          mostrarErro('Erro', 'Não foi possível carregar as cores da paleta.');
        });
    } else {
      setCores([]);
    }
  }, [paletaSelecionada, mostrarErro]);

  // Abrir modal para criar paleta
  const handleNovaPaleta = () => {
    setEditPaletaId(null);
    setPaletaModalNome("");
    setPaletaModalCores([{ nome_cor: "", cod_cor: "#FFFFFF" }]);
    setShowPaletaModal(true);
  };

  // Abrir modal para editar paleta
  const handleEditarPaleta = async () => {
    if (!paletaSelecionada) {
      mostrarModal({
        titulo: 'Nenhuma Paleta Selecionada',
        mensagem: 'Por favor, selecione uma paleta para editar.',
        mostrarFechar: true,
        mostrarConfirmar: false
      });
      return;
    }

    try {
      const paleta = paletas.find(p => p.id_paleta === paletaSelecionada);

      const res = await fetch(`${API_URL}/paletas/${paletaSelecionada}/cores`);
      const coresData = await res.json();

      setEditPaletaId(paletaSelecionada);
      setPaletaModalNome(paleta?.nome_paleta || "");
      setPaletaModalCores(
        coresData.length > 0
          ? coresData.map((c: any) => ({
              id_cor: c.id_cor,
              nome_cor: c.nome_cor,
              cod_cor: c.cod_cor
            }))
          : [{ nome_cor: "", cod_cor: "#FFFFFF" }]
      );
      setShowPaletaModal(true);
    } catch (error) {
      console.error('Erro ao carregar dados da paleta:', error);
      mostrarErro('Erro', 'Não foi possível carregar os dados da paleta para edição.');
    }
  };

  // Salvar paleta e cores no banco
  const handleSalvarPaletaModal = async (
    nomePaleta: string,
    cores: { id_cor?: number; nome_cor: string; cod_cor: string }[]
  ) => {
    try {
      setLoading(true);
      let paletaId = editPaletaId;

      if (!editPaletaId) {
        // Criação de nova paleta
        const paletaRes = await fetch(`${API_URL}/paletas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome_paleta: nomePaleta })
        });

        if (!paletaRes.ok) {
          throw new Error('Erro ao criar paleta');
        }

        const paletaData = await paletaRes.json();
        paletaId = paletaData.id_paleta || paletaData.paleta?.id_paleta;

        // Adiciona as cores à nova paleta
        for (const cor of cores) {
          const corRes = await fetch(`${API_URL}/cores`);
          const corList = await corRes.json();
          let corId;
          const corExistente = corList.find(
            (c: any) =>
              c.nome_cor.toLowerCase() === cor.nome_cor.trim().toLowerCase() &&
              c.cod_cor.toUpperCase() === cor.cod_cor.trim().toUpperCase()
          );
          
          if (corExistente) {
            corId = corExistente.id_cor;
          } else {
            const novaCorRes = await fetch(`${API_URL}/cores`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nome_cor: cor.nome_cor.trim(),
                cod_cor: cor.cod_cor.trim().toUpperCase()
              })
            });
            
            if (!novaCorRes.ok) {
              throw new Error('Erro ao criar cor');
            }
            
            const novaCorData = await novaCorRes.json();
            corId = novaCorData.id_cor || novaCorData.cor?.id_cor;
          }
          
          const associacaoRes = await fetch(`${API_URL}/paletas/${paletaId}/cores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cor: corId })
          });

          if (!associacaoRes.ok) {
            throw new Error('Erro ao associar cor à paleta');
          }
        }

        mostrarSucesso('Sucesso', 'Paleta criada com sucesso!');
      } else {
        // Edição de paleta existente
        const updateRes = await fetch(`${API_URL}/paletas/${editPaletaId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome_paleta: nomePaleta })
        });

        if (!updateRes.ok) {
          throw new Error('Erro ao atualizar paleta');
        }

        // Remove todas as associações antigas
        const resCoresPaleta = await fetch(`${API_URL}/paletas/${editPaletaId}/cores`);
        const coresAtuais = await resCoresPaleta.json();
        
        for (const cor of coresAtuais) {
          await fetch(`${API_URL}/paletas/${editPaletaId}/cores/${cor.id_cor}`, {
            method: "DELETE"
          });
        }

        // Atualiza ou cria cada cor e associa à paleta
        for (const cor of cores) {
          let corId = cor.id_cor;
          if (corId) {
            const updateCorRes = await fetch(`${API_URL}/cores/${corId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nome_cor: cor.nome_cor.trim(),
                cod_cor: cor.cod_cor.trim().toUpperCase()
              })
            });

            if (!updateCorRes.ok) {
              throw new Error('Erro ao atualizar cor');
            }
          } else {
            const corRes = await fetch(`${API_URL}/cores`);
            const corList = await corRes.json();
            const corExistente = corList.find(
              (c: any) =>
                c.nome_cor.toLowerCase() === cor.nome_cor.trim().toLowerCase() &&
                c.cod_cor.toUpperCase() === cor.cod_cor.trim().toUpperCase()
            );
            
            if (corExistente) {
              corId = corExistente.id_cor;
            } else {
              const novaCorRes = await fetch(`${API_URL}/cores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nome_cor: cor.nome_cor.trim(),
                  cod_cor: cor.cod_cor.trim().toUpperCase()
                })
              });

              if (!novaCorRes.ok) {
                throw new Error('Erro ao criar nova cor');
              }

              const novaCorData = await novaCorRes.json();
              corId = novaCorData.id_cor || novaCorData.cor?.id_cor;
            }
          }
          
          const associacaoRes = await fetch(`${API_URL}/paletas/${editPaletaId}/cores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cor: corId })
          });

          if (!associacaoRes.ok) {
            throw new Error('Erro ao associar cor à paleta');
          }
        }

        mostrarSucesso('Sucesso', 'Paleta atualizada com sucesso!');
      }

      setShowPaletaModal(false);

      // Atualiza lista de paletas
      const paletasAtualizadas = await fetch(`${API_URL}/paletas`).then(res => res.json());
      setPaletas(paletasAtualizadas);

      // Atualiza as cores da paleta selecionada imediatamente após salvar
      if (paletaId) {
        const res = await fetch(`${API_URL}/paletas/${paletaId}/cores`);
        const coresPaleta = await res.json();
        setCores(coresPaleta);
        setPaletaSelecionada(paletaId);
      }

      // Fechar modal de sucesso após um tempo
      setTimeout(() => {
        fecharModal();
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar paleta:', error);
      mostrarErro('Erro', 'Não foi possível salvar a paleta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Selecionar paleta
  const handleEscolherPaleta = async (id: number) => {
    try {
      setPaletaSelecionada(id);
      if (!id) {
        setCores([]);
        return;
      }
      
      const res = await fetch(`${API_URL}/paletas/${id}/cores`);
      if (!res.ok) {
        throw new Error('Erro ao carregar cores');
      }
      
      const coresPaleta = await res.json();
      setCores(coresPaleta);
    } catch (error) {
      console.error('Erro ao selecionar paleta:', error);
      mostrarErro('Erro', 'Não foi possível carregar as cores da paleta selecionada.');
    }
  };

  return {
    paletas,
    paletaSelecionada,
    setPaletaSelecionada,
    cores,
    setCores,
    loading,
    setLoading,
    showPaletaModal,
    setShowPaletaModal,
    editPaletaId,
    setEditPaletaId,
    paletaModalNome,
    setPaletaModalNome,
    paletaModalCores,
    setPaletaModalCores,
    handleNovaPaleta,
    handleEditarPaleta,
    handleSalvarPaletaModal,
    handleEscolherPaleta,
    // Expor props do modal
    modalProps
  };
}