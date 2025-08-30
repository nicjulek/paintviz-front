import React from 'react';
import './inputGenerico.css';
import { InputGenericoProps } from '../../types/types';

const InputGenerico: React.FC<InputGenericoProps> = ({
    titulo,
    placeholder = '',
    valor = '',
    onChange,
    type = 'text',
    required = false, 
    disabled = false  
}) => {
    return(
        <div className = "input-generico">
            <label className="input-label">{titulo}{required && '*'}:</label>
            <input
                type={type}
                className="input-campo"
                placeholder={placeholder}
                value={valor}
                onChange={(e) => onChange?.(e.target.value)}
                required={required} 
                disabled={disabled} 
            />
        </div>
    );
};

export default InputGenerico;