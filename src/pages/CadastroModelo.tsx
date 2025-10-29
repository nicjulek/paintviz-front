import React from 'react';
import CadastroPecas from '../components/CadastroPecas/CadastroPecas';
import SvgUpload from '../components/SvgUpload/SvgUpload';
import AvisoModal from '../modals/AvisoModal';
import { useCadastroModelo } from '../hooks/useCadastroModelo';
import { Tooltip } from '../components/Tooltip';

// Componente para pré-visualização dos SVGs
const SvgPreview = ({ file, label }: { file: File | null; label: string }) => {
  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvgContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setSvgContent(null);
    }
  }, [file]);

  if (!svgContent) {
    return (
      <div
        style={{
          width: '200px',
          height: '150px',
          border: '2px dashed #bca57a',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          color: '#6c757d'
        }}
      >
        <div className="text-center">
          <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
          <p className="mb-0 mt-2 small">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '300px',
        height: '220px',
        border: '1px solid #bca57a',
        borderRadius: '8px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '4px',
          background: '#5A402A',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.7rem'
        }}
      >
        {label}
      </div>
    </div>
  );
};

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
    handleSalvar,
    modalProps
  } = useCadastroModelo();

  if (carregandoDados) {
    return (
      <>
        <div style={{ background: '#F5E3C6', minHeight: '100vh', padding: 0 }}>
          <div className="container py-4">
            <div className="text-center p-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-2 text-muted">Carregando dados do modelo...</p>
            </div>
          </div>
        </div>
        <AvisoModal {...modalProps} />
      </>
    );
  }

  return (
    <>
      <div style={{ background: '#F5E3C6', minHeight: '100vh', padding: 0 }}>
        <h2
          className="mb-4 fw-bold text-center"
          style={{ color: '#6d4c1c', textShadow: '1px 2px 8px #d5c0a0' }}
        >
          <i className="bi bi-truck me-2"></i>
          {isEdicao ? 'Editar Modelo de Carroceria' : 'Cadastro de Modelo de Carroceria'}
        </h2>

        <div className="container py-4">
          {/* Bloco de nome do modelo */}
          <div
            className="mb-4"
            style={{
              background: '#D5C0A0',
              borderRadius: '12px',
              boxShadow: '0 2px 8px #0002',
              padding: '2rem'
            }}
          >
            <div className="mb-3">
              <label
                className="fw-bold mb-2"
                htmlFor="nome-modelo"
                style={{ color: '#4B3A1A' }}
              >
                Nome do Modelo: <span style={{ color: '#c00' }}>*</span>
              </label>
              <input
                id="nome-modelo"
                type="text"
                className="form-control"
                placeholder="Nome do modelo da carroceria"
                value={nomeModelo}
                onChange={(e) => setNomeModelo(e.target.value)}
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

            {/* Bloco de uploads SVG */}
            <div className="mb-4">
              <h5
                className="fw-bold"
                style={{ color: '#4B3A1A', fontSize: '1rem' }}
              >
                Arquivos SVG: {isEdicao && <small className="text-muted">(deixe em branco para manter os atuais)</small>}
              </h5>

              <div
                className="d-flex flex-wrap justify-content-center gap-4"
                style={{ width: '100%' }}
              >
                <Tooltip helpText="Faça upload do SVG lateral do modelo">
                  <SvgUpload
                    id="lateral-svg-upload"
                    label="Lateral"
                    file={lateralSVG}
                    onFileChange={setLateralSVG}
                    disabled={loading}
                  />
                </Tooltip>

                <Tooltip helpText="Faça upload do SVG traseiro do modelo">
                  <SvgUpload
                    id="traseira-svg-upload"
                    label="Traseira"
                    file={traseiraSVG}
                    onFileChange={setTraseiraSVG}
                    disabled={loading}
                  />
                </Tooltip>

                <Tooltip helpText="Faça upload do SVG diagonal do modelo">
                  <SvgUpload
                    id="diagonal-svg-upload"
                    label="Diagonal"
                    file={diagonalSVG}
                    onFileChange={setDiagonalSVG}
                    disabled={loading}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Pré-visualização dos SVGs */}
            {(lateralSVG || traseiraSVG || diagonalSVG) && (
              <div className="mt-4">
                <h5
                  className="fw-bold mb-3"
                  style={{ color: '#4B3A1A', fontSize: '1rem' }}
                >
                  <i className="bi bi-eye me-2"></i>
                  Pré-visualização:
                </h5>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <SvgPreview file={lateralSVG} label="Lateral" />
                  <SvgPreview file={traseiraSVG} label="Traseira" />
                  <SvgPreview file={diagonalSVG} label="Diagonal" />
                </div>
              </div>
            )}
          </div>

          {/* Bloco de peças */}
          <div
            className="mb-4"
            style={{
              background: '#D5C0A0',
              borderRadius: '12px',
              boxShadow: '0 2px 8px #0002',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <h4 className="fw-bold mb-0" style={{ color: '#4B3A1A' }}>
                {isEdicao ? 'Editar peças' : 'Cadastro das peças'}
              </h4>
              <Tooltip helpText="Todas as peças cadastradas devem estar presentes no .svg">
                 <span style={{ display: 'inline-block', width: '1rem', height: '1rem' }} />
              </Tooltip>
            </div>
            <div className="row g-2">
              {pecas.map((peca, index) => (
                <CadastroPecas
                  key={index}
                  nomeModelo={peca.nome_peca}
                  idSVG={peca.id_svg}
                  onChangeNome={(nome) => handlePecaChange(index, nome)}
                  onChangeIdSVG={(idSVG) => handlePecaChange(index, undefined, idSVG)}
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

          {/* Botões de ação */}
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
              style={{
                background: loading ? "#6c757d" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "10px 20px",
                boxShadow: "0 4px 15px rgba(40,167,69,0.3)"
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isEdicao ? 'Atualizando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {isEdicao ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Aviso */}
      <AvisoModal {...modalProps} />
    </>
  );
};

export default CadastroModelos;