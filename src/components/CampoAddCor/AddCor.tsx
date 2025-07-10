import './addCor.css';
import { AddCorProps } from '../../types/types';

const AddCor: React.FC<AddCorProps> = ({
  nomeCor = '',
  corQuadrado = '',
  onChangeNome,
  onDelete
}) => {
  return (
    <div className="campo-cor-container">
      <input
        className="input-nome-cor"
        type="text"
        placeholder="Nome da Cor"
        value={nomeCor}
        onChange={(e) => onChangeNome?.(e.target.value)}
      />

      <div
        className="bolinha-cor"
        style={{ backgroundColor: corQuadrado }}
      ></div>

      <span className="icone-x" onClick={onDelete}>×</span>
    </div>
  );
};

export default AddCor;




