import React, { useState, useEffect } from 'react';
import CadastroPecas from '../components/CadastroPecas/CadastroPecas';
import Button from '../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Peca, Carroceria } from '../types/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

const getSvgBoxStyle = (hasFile: boolean) => ({
  background: hasFile ? '#e6ffe6' : '#fff',
  border: hasFile ? '2px solid #2ecc40' : '2px dashed #8B6B3A',
  borderRadius: '18px',
  minWidth: 300,
  minHeight: 200,
  maxWidth: 400,
  boxShadow: hasFile ? '0 2px 16px #2ecc4033' : '0 2px 12px #0001',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, background 0.2s, border 0.2s',
  margin: '0 auto',
  position: 'relative'
});

const svgIconStyle = {
  fontSize: '2.5rem',
  color: '#6d4c1c',
  marginBottom: '0.5rem'
};

const svgLabelStyle = {
  color: '#6d4c1c',
  fontWeight: 500,
  fontSize: '1.07rem'
};

const svgHintStyle = {
  color: '#8B6B3A',
  fontSize: '0.95rem'
};

const CadastroModelos = () => {
  const [nomeModelo, setNomeModelo] = useState('');
  const [lateralSVG, setLateralSVG] = useState<File | null>(null);
  const [traseiraSVG, setTraseiraSVG] = useState<File | null>(null);
  const [diagonalSVG, setDiagonalSVG] = useState<File | null>(null);
  const { id } = useParams();
  const [modelo, setModelo] = useState<Carroceria | null>(null);
  const [pecas, setPecas] = useState<Peca[]>([
    { nome_peca: '', id_svg: '', id_pintura: 1, id_carroceria: 0, cor_atual: '', cor_inicial: '' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Se tem id, está editando: carregue os dados
      axios.get(`/carrocerias/${id}`).then(res => setModelo(res.data));
    }
  }, [id]);


  const handleAddPeca = () => {
    setPecas(prev => [
      ...prev,
      { nome_peca: '', id_svg: '', id_pintura: 1, id_carroceria: 0, cor_atual: '', cor_inicial: '' }
    ]);
  };

  const handleVoltar = () => navigate('/gestao-modelos');

  const handlePecaChange = (index: number, nome?: string, idSVG?: string) => {
    setPecas(prev =>
      prev.map((p, i) =>
        i === index
          ? { ...p, nome_peca: nome ?? p.nome_peca, id_svg: idSVG ?? p.id_svg }
          : p
      )
    );
  };

  const handleDescartarPeca = (index: number) => {
    setPecas(prev => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleSalvar = async () => {
    try {
      if (
        !nomeModelo.trim() ||
        !lateralSVG ||
        !traseiraSVG ||
        !diagonalSVG ||
        pecas.length === 0 ||
        pecas.some(p => !p.nome_peca.trim() || !p.id_svg.trim())
      ) {
        alert('Preencha todos os campos obrigatórios e todas as peças.');
        return;
      }

      const lateralStr = await fileToBase64(lateralSVG);
      const traseiraStr = await fileToBase64(traseiraSVG);
      const diagonalStr = await fileToBase64(diagonalSVG);

      const token = localStorage.getItem('token');

      const carroceriaResp = await axios.post<{ carroceria: Carroceria }>(
        `${API_URL}/carrocerias`,
        {
          nome_modelo: nomeModelo.trim(),
          lateral_svg: lateralStr,
          traseira_svg: traseiraStr,
          diagonal_svg: diagonalStr
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      const carroceriaId = carroceriaResp.data.carroceria.id_carroceria!;

      for (const peca of pecas) {
        await axios.post(
          `${API_URL}/pecas`,
          {
            nome_peca: peca.nome_peca.trim(),
            id_svg: peca.id_svg.trim(),
            id_carroceria: carroceriaId,
            id_pintura: peca.id_pintura || 1
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );
      }

      alert('Modelo de carroceria e peças salvos com sucesso!');
      navigate('/gestao-modelos');
    } catch (error: any) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Erro ao salvar modelo. Verifique os campos.');
      }
      console.error(error);
    }
  };

  return (
    <div style={{ background: '#F5E3C6', minHeight: '100vh', padding: 0 }}>
      <div className="container py-4">
        <div className="mb-4" style={{
          background: '#D5C0A0',
          borderRadius: '12px',
          boxShadow: '0 2px 8px #0002',
          padding: '2rem'
        }}>
          <h4 className="fw-bold mb-3" style={{ color: '#4B3A1A' }}>
            Cadastro de Modelo de Carroceria
          </h4>
          <div className="mb-3">
            <label className="fw-bold mb-2" htmlFor="nome-modelo" style={{ color: '#4B3A1A' }}>
              Nome do Modelo: <span style={{ color: '#c00' }}>*</span>
            </label>
            <input
              id="nome-modelo"
              type="text"
              className="form-control"
              placeholder="Nome do modelo da carroceria"
              value={nomeModelo}
              onChange={e => setNomeModelo(e.target.value)}
              style={{
                width: '100%',
                fontSize: '1rem',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                boxShadow: '0 2px 8px #0001',
                border: '1.5px solid #bca57a'
              }}
            />
          </div>
          <div className="mb-4">
            <h5 className="fw-bold" style={{ color: '#4B3A1A', fontSize: '1rem' }}>Arquivos SVG</h5>

            <div
              className="d-flex flex-wrap justify-content-center gap-4"
              style={{ width: '100%' }}
            >
              {/* Lateral SVG */}
              <label style={getSvgBoxStyle(!!lateralSVG) as React.CSSProperties} htmlFor="lateral-svg-upload">
                <i className="bi bi-cloud-upload" style={svgIconStyle}></i>
                <div style={svgLabelStyle}>Lateral (.svg)</div>
                <div style={svgHintStyle}>Clique para enviar</div>
                {lateralSVG && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 18,
                      background: '#2ecc40',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: '0 1px 6px #2ecc4044'
                    }}
                    title="Arquivo selecionado"
                  >
                    <i className="bi bi-check-lg"></i>
                  </span>
                )}
                <input
                  id="lateral-svg-upload"
                  type="file"
                  accept=".svg"
                  style={{ display: 'none' }}
                  onChange={e => setLateralSVG(e.target.files?.[0] || null)}
                />
              </label>
              {/* Traseira SVG */}
              <label style={getSvgBoxStyle(!!traseiraSVG) as React.CSSProperties} htmlFor="traseira-svg-upload">
                <i className="bi bi-cloud-upload" style={svgIconStyle}></i>
                <div style={svgLabelStyle}>Traseira (.svg)</div>
                <div style={svgHintStyle}>Clique para enviar</div>
                {traseiraSVG && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 18,
                      background: '#2ecc40',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: '0 1px 6px #2ecc4044'
                    }}
                    title="Arquivo selecionado"
                  >
                    <i className="bi bi-check-lg"></i>
                  </span>
                )}
                <input
                  id="traseira-svg-upload"
                  type="file"
                  accept=".svg"
                  style={{ display: 'none' }}
                  onChange={e => setTraseiraSVG(e.target.files?.[0] || null)}
                />
              </label>
              {/* Diagonal SVG */}
              <label style={getSvgBoxStyle(!!diagonalSVG) as React.CSSProperties} htmlFor="diagonal-svg-upload">
                <i className="bi bi-cloud-upload" style={svgIconStyle}></i>
                <div style={svgLabelStyle}>Diagonal (.svg)</div>
                <div style={svgHintStyle}>Clique para enviar</div>
                {diagonalSVG && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 18,
                      background: '#2ecc40',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: '0 1px 6px #2ecc4044'
                    }}
                    title="Arquivo selecionado"
                  >
                    <i className="bi bi-check-lg"></i>
                  </span>
                )}
                <input
                  id="diagonal-svg-upload"
                  type="file"
                  accept=".svg"
                  style={{ display: 'none' }}
                  onChange={e => setDiagonalSVG(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>
        </div>

        <div
          className="mb-4"
          style={{
            background: '#D5C0A0',
            borderRadius: '12px',
            boxShadow: '0 2px 8px #0002',
            padding: '2rem'
          }}
        >
          <h4 className="fw-bold mb-3" style={{ color: '#4B3A1A' }}>
            Cadastro das peças
          </h4>
          <div className="row g-2">
            {pecas.map((peca, index) => (
              <CadastroPecas
                key={index}
                nomeModelo={peca.nome_peca}
                idSVG={peca.id_svg}
                onChangeNome={nome => handlePecaChange(index, nome)}
                onChangeIdSVG={idSVG => handlePecaChange(index, undefined, idSVG)}
                onDescartar={() => handleDescartarPeca(index)}
              />
            ))}
          </div>
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddPeca}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Adicionar mais peças
            </button>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          <button
            type="button"
            className="btn btn-secondary btn-margin-right"
            onClick={handleVoltar}
          >
            <i className="bi bi-arrow-left-circle me-2"></i>
            Voltar
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSalvar}
          >
            <i className="bi bi-save me-2"></i>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroModelos;