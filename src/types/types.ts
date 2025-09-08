import React from 'react';

export type UserRole = 'admin' | 'user';

// ========= USUARIO =========
export interface Usuario {
  id_usuario?: number;
  nome: string;
  senha: string;
}

export interface Administrador {
  id_usuario: number;
}

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  isAdmin: boolean;
}

export interface AuthRequest extends Request {
  user?: UsuarioAutenticado;
}

// ========= PALETA =========
export interface Paleta {
  id_paleta?: number;
  nome_paleta: string;
}

export interface Cor {
  id_cor?: number;
  nome_cor: string;
  cod_cor: string;
  id_paleta: number;
}

export interface PaletaCor {
  id_paleta: number;
  id_cor: number;
}

// ========= CLIENTE =========
export interface Cliente {
  id_cliente?: number;
  celular: string;
  email: string;
  pessoa_fisica?: Fisico | null;
  pessoa_juridica?: Juridico | null;
}

export interface Fisico {
  id_cliente: number;
  nome: string;
  cpf: string;
}

export interface Juridico {
  id_cliente: number;
  empresa: string;
  razao_social?: string;
  cnpj: string;
}

// ========= CARROCERIA =========
export interface Carroceria {
  id_carroceria?: number;
  nome_modelo: string;
  lateral_svg?: string;
  traseira_svg?: string;
  diagonal_svg?: string;
  data_criacao?: Date;
}

// ========= PINTURA =========
export interface Pintura {
  id_pintura?: number;
  pintura_svg_lateral: string;
  pintura_svg_traseira: string;
  pintura_svg_diagonal: string;
  id_carroceria: number;
  id_usuario: number;
}

// ========= PECA =========
export interface Peca {
  id_peca?: number;
  nome_peca: string;
  id_svg: string;
  id_cor?: number;
  id_pintura: number;
  id_carroceria: number;
  cor_atual: string;
  cor_inicial: string;
}

// ========= ORDEM DE SERVICO =========
export interface Status {
  id_status?: number;
  descricao: string;
  data_definicao_status: Date;
}

export interface OrdemDeServico {
  id_ordem_servico?: number;
  identificacao_veiculo: string;
  data_emissao: Date;
  data_entrega?: Date;
  data_programada?: Date;
  modelo_veiculo: string;
  placa_veiculo: string;
  numero_box?: string;
  id_cliente: number;
  id_usuario_responsavel: number;
  id_status: number;
  id_pintura?: number;
  data_ultima_modificacao?: Date;
}

export interface CardOrdemProps {
  id_ordem_servico: number;
  identificacao_veiculo: string;
  status: string;
  nome_cliente: string;
  data_entrega: string;
  id_pintura?: number;
  onAlterarPrioridade?: (id: number) => void;
  onAlterarStatus?: (id: number) => void;
}

// Interface peças coloridas
export interface PecaColorida {
  id: string;
  nomePeca: string;
  corQuadrado: string;
  corSelecionada: string;
}

// Props componente PecaColorida
export interface PecaColoridaProps {
  nomePeca: string;
  corQuadrado: string;
  corSelecionada: string;
  onCorChange: (novaCor: string) => void;
  id?: string;
}

export interface InputGenericoProps {
  titulo: string;
  placeholder?: string;
  valor?: string;
  onChange?: (novoValor: string) => void;
  type?: string;
}

export interface AddCorProps {
  nomeCor?: string;
  corQuadrado?: string;
  onChangeNome?: (novoNome: string) => void;
  onDelete?: () => void;
}

export interface CorPaletaProps {
  corQuadrado: string;
}

export interface CadastroPecasProps {
    nomeModelo?: string;
    idSVG?: string;
    onChangeNome?: (novoNome: string) => void;
    onChangeIdSVG?: (novoIdSVG: string) => void;
}

// Props componente Button
export interface ButtonProps {
  texto: string;
  onClick?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  cor?: 
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
    | `outline-${'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'}`
    | 'paintviz-light'
    | 'paintviz-brown';
  tamanho?: 'sm' | 'lg';
  desabilitado?: boolean;
  icone?: React.ReactNode;
  className?: string;
}


// Props para o componente Header
export interface HeaderProps {
  user?: {
    name: string;
    role: UserRole; 
  } | null;
  onLogout?: () => void;
}

//interface para o Item do componente CardItem
export interface Item {
  label: string;
  desc: string;
}

export interface ColorPickerProps {
  value: string;
  onColorChange: (color: string) => void;
}

export interface CorInput {
    nome_cor: string;
    cod_cor: string;
}

export interface PaletaModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (nomePaleta: string, cores: CorInput[]) => void;
    initialNome?: string;
    initialCores?: CorInput[];
    isEdit?: boolean;
}

export {};