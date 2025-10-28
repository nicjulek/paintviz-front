import React from 'react';

export type UserRole = 'admin' | 'user';

// ========= USUARIO =========
export interface Usuario {
  id_usuario?: number;
  nome: string;
  senha: string;
  isAdmin?: boolean;
}

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  isAdmin: boolean;
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

export interface InputGenericoProps {
  titulo: string;
  placeholder?: string;
  valor?: string;
  onChange?: (novoValor: string) => void;
  type?: string;
}

export interface CadastroPecasProps {
  nomeModelo?: string;
  idSVG?: string;
  onChangeNome?: (novoNome: string) => void;
  onChangeIdSVG?: (novoIdSVG: string) => void;
  onDescartar?: () => void;
}

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

export interface HeaderProps {
  user?: {
    name: string;
    role: UserRole; 
  } | null;
  onLogout?: () => void;
}

export interface Item {
  label: string;
  desc: string;
  highlight?: boolean;
}

export interface ColorPickerProps {
  value: string;
  onColorChange: (color: string) => void;
}

export interface CorInput {
  nome_cor: string;
  cod_cor: string;
}

export interface CorPaletaProps {
  corQuadrado: string;
}

export interface PaletaModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (nomePaleta: string, cores: CorInput[]) => void;
  initialNome?: string;
  initialCores?: CorInput[];
  isEdit?: boolean;
}

export interface SvgUploadProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled: boolean;
}

export interface SidebarMenuProps {
  menuAberto: boolean;
  setMenuAberto: (open: boolean) => void;
  renderCarroceriaSelector: () => React.ReactNode;
  renderTipoVisualizacao: () => React.ReactNode;
  renderPaletaCores: () => React.ReactNode;
  renderListaPecas: () => React.ReactNode;
  pecaSelecionada: string | null;
  pecas: Peca[];
  handleSalvar: () => void;
  loading: boolean;
  handleDescartar: () => void;
  coresAplicadas: { [key: string]: string };
  cores: Cor[];
  setCores: (cores: Cor[]) => void;
  corSelecionada: string;
  handleColorChange: (cor: string) => void;
}

export interface CardInfoProps {
  titulo: string;
  icon?: React.ReactNode;
  informacoes: Item[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CardsGridProps {
  ordens: any[];
  openStatusModal: (ordem: any) => void;
  openPrioriModal: (ordem: any) => void;
}

// Props para FormularioCliente component
export interface FormularioClienteProps {
  show: boolean;
  onClose: () => void;
  onClienteCadastrado: () => void;
  cliente?: Cliente | null;
  isEditing?: boolean;
}

// Props para useFormCliente hook
export interface UseFormClienteProps {
  cliente?: Cliente | null;
  isEditing?: boolean;
  show: boolean;
}

export interface StatusModalProps {
  show: boolean;
  statusList: { id: number; nome: string }[];
  value: number;
  statusAtual: number;
  dataEmissao?: string;
  dataProgramada?: string;
  dataEntrega?: string;
  onDataEmissaoChange?: (v: string) => void;
  onDataProgramadaChange?: (v: string) => void;
  onDataEntregaChange?: (v: string) => void;
  numeroBox?: string;
  onNumeroBoxChange?: (box: string) => void;
  onChange: (id: number) => void;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export interface PrioriModalProps {
  show: boolean;
  value: string;
  onChange: (data: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export interface ModalCadastroAtendenteProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id?: number;
}

export interface TooltipProps {
  helpText: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export {};