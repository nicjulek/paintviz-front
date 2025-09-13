import React from 'react';
import CadastroPecas from '../components/CadastroPecas/CadastroPecas';
import SvgUpload from '../components/SvgUpload/SvgUpload';
import { useCadastroModelo } from '../hooks/useCadastroModelo';

const CadastroModelos = () => {
  const {
    nomeModelo,
    lateralSVG,
    traseiraSVG,
    diagonalSVG,
    pecas,
    loading,
    carregandoDados,
    isEdicao,
    setNomeModelo,
    setLateralSVG,
    setTraseiraSVG,
    setDiagonalSVG,
    handleAddPeca,
    handleVoltar,
    handlePecaChange,
    handleDescartarPeca,
    handleSalvar
  } = useCadastroModelo();

  // Mostra loading enquanto carrega dados para edição
  if (carregandoDados) {
    return (
      <div style={{ background: '#F5E3C6', minHeight: '100vh', padding: 0 }}>
        <div className="container py-4">
          <div className="text-center p-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2 text-muted">Carregando dados do modelo...</p>
          </div>
        </div>
      </div>
    );
  }

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
            {isEdicao ? 'Editar Modelo de Carroceria' : 'Cadastro de Modelo de Carroceria'}
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
              disabled={loading}
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
            <h5 className="fw-bold" style={{ color: '#4B3A1A', fontSize: '1rem' }}>
              Arquivos SVG {isEdicao && <small className="text-muted">(deixe em branco para manter os atuais)</small>}
            </h5>

            <div
              className="d-flex flex-wrap justify-content-center gap-4"
              style={{ width: '100%' }}
            >
              <SvgUpload
                id="lateral-svg-upload"
                label="Lateral"
                file={lateralSVG}
                onFileChange={setLateralSVG}
                disabled={loading}
              />
              
              <SvgUpload
                id="traseira-svg-upload"
                label="Traseira"
                file={traseiraSVG}
                onFileChange={setTraseiraSVG}
                disabled={loading}
              />
              
              <SvgUpload
                id="diagonal-svg-upload"
                label="Diagonal"
                file={diagonalSVG}
                onFileChange={setDiagonalSVG}
                disabled={loading}
              />
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
            {isEdicao ? 'Editar peças' : 'Cadastro das peças'}
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
              disabled={loading}
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
            disabled={loading}
          >
            <i className="bi bi-arrow-left-circle me-2"></i>
            Voltar
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSalvar}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEdicao ? 'Atualizando...' : 'Salvando...'}
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                {isEdicao ? 'Atualizar' : 'Salvar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroModelos;