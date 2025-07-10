import React from 'react';

export type UserRole = 'admin' | 'user';

// Interface objeto de usuário
export interface User {
  id?: string;
  name: string;
  role: UserRole;
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

export interface AddCorProps {
  nomeCor?: string;
  corQuadrado?: string;
  onChangeNome?: (novoNome: string) => void;
  onDelete?: () => void;
}

export interface CorPaletaProps {
  corQuadrado: string;
}

// Props componente Button
export interface ButtonProps {
  texto: string;
  onClick?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  cor?: 'primary' | 'secondary' | 'paintviz-light' | 'paintviz-brown';
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

export {};